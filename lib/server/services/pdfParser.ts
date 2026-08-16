import 'server-only'
import { getDocumentProxy, extractText } from 'unpdf'

interface PdfPageText {
  pageNumber: number
  text: string
}

export async function parsePdfPages(data: Buffer): Promise<PdfPageText[]> {
  const pdf = await getDocumentProxy(new Uint8Array(data))
  const { text } = await extractText(pdf, { mergePages: false })

  return text.map((pageText, index) => ({
    pageNumber: index + 1,
    text: pageText,
  }))
}
