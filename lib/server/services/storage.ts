import 'server-only'
import { Client as MinioClient } from 'minio'

const s3Client = new MinioClient({
  endPoint: process.env.S3_ENDPOINT || 'localhost',
  port: Number(process.env.S3_PORT) || 9000,
  useSSL: process.env.S3_USE_SSL === 'true',
  accessKey: process.env.S3_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.S3_SECRET_KEY || 'minioadmin',
})

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'pdf-documents'

export async function initBucket(): Promise<void> {
  const exists = await s3Client.bucketExists(BUCKET_NAME)
  if (!exists) {
    await s3Client.makeBucket(BUCKET_NAME)
    console.log(`[storage] Bucket "${BUCKET_NAME}" created.`)
  } else {
    console.log(`[storage] Bucket "${BUCKET_NAME}" ready.`)
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
