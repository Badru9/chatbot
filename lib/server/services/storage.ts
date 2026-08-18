import 'server-only'
import { Client as MinioClient } from 'minio'

const rawEndpoint = process.env.S3_ENDPOINT || 'localhost'

let endPoint = rawEndpoint
let useSSL = process.env.S3_USE_SSL === 'true'
let port = process.env.S3_PORT ? Number(process.env.S3_PORT) : undefined

if (rawEndpoint.startsWith('http://') || rawEndpoint.startsWith('https://')) {
  try {
    const url = new URL(rawEndpoint)
    endPoint = url.hostname
    useSSL = url.protocol === 'https:'
    port = url.port ? Number(url.port) : useSSL ? 443 : 80
  } catch (e) {
    console.error('[storage] Error parsing S3_ENDPOINT URL:', e)
  }
} else if (!port) {
  port = useSSL ? 443 : 9000
}

const accessKey =
  process.env.S3_ACCESS_KEY_ID ||
  process.env.S3_ACCESS_KEY ||
  'minioadmin'

const secretKey =
  process.env.S3_SECRET_ACCESS_KEY ||
  process.env.S3_SECRET_KEY ||
  'minioadmin'

const BUCKET_NAME =
  process.env.S3_BUCKET ||
  process.env.S3_BUCKET_NAME ||
  'pdf-documents'

const s3Client = new MinioClient({
  endPoint,
  port,
  useSSL,
  accessKey,
  secretKey,
})

export async function initBucket(): Promise<void> {
  try {
    const exists = await s3Client.bucketExists(BUCKET_NAME)
    if (!exists) {
      await s3Client.makeBucket(BUCKET_NAME)
      console.log(`[storage] Bucket "${BUCKET_NAME}" created.`)
    } else {
      console.log(`[storage] Bucket "${BUCKET_NAME}" ready.`)
    }
  } catch (err) {
    console.error(`[storage] Failed to initialize bucket "${BUCKET_NAME}":`, err)
  }
}

export async function uploadPdf(
  documentId: string,
  buffer: Buffer,
  fileName: string,
): Promise<void> {
  await s3Client.putObject(BUCKET_NAME, documentId, buffer, buffer.length, {
    'Content-Type': 'application/pdf',
    'X-Original-Filename': encodeURIComponent(fileName),
  })
}

export async function downloadPdf(
  documentId: string,
): Promise<NodeJS.ReadableStream> {
  return s3Client.getObject(BUCKET_NAME, documentId)
}

export async function deletePdf(documentId: string): Promise<void> {
  try {
    await s3Client.removeObject(BUCKET_NAME, documentId)
  } catch {
    // Ignore — file may already have been removed
  }
}

export async function getPdfUrl(
  documentId: string,
  expiry = 3600,
): Promise<string> {
  return s3Client.presignedGetObject(BUCKET_NAME, documentId, expiry)
}
