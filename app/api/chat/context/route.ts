import { NextRequest } from 'next/server'
import { getTokenFromCookies } from '@/lib/server/middleware/auth'
import { getSession } from '@/lib/server/services/auth'
import { retrievePdfContext } from '@/lib/server/services/retriever'
import { chatContextSchema } from '@/lib/server/middleware/validators'

export async function POST(request: NextRequest) {
  const token = await getTokenFromCookies()
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sessionResult = await getSession(token)
  if (!sessionResult) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = sessionResult.user
  const isUserAdmin = user.role === 'admin'
  const userId = isUserAdmin ? undefined : user.id

  let body: any
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = chatContextSchema.safeParse(body)
  if (!parsed.success) {
    const errors = parsed.error.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }))
    return Response.json({ error: 'Validasi gagal', details: errors }, { status: 400 })
  }

  const { prompt, documentIds, limit } = parsed.data

  const ids = Array.isArray(documentIds)
    ? documentIds.filter(
        (id: unknown): id is string =>
          typeof id === 'string' && (id as string).trim().length > 0,
      )
    : []

  try {
    const context = await retrievePdfContext({
      prompt: prompt.trim(),
      documentIds: ids,
      limit: typeof limit === 'number' ? limit : undefined,
      userId,
    })

    return Response.json({ context })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Gagal mengambil konteks.' },
      { status: 500 }
    )
  }
}
