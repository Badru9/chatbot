'use server'

import { prisma } from '@/lib/server/db'
import { requireAuth } from '@/lib/server/middleware/auth'

export async function fetchSchedulesAction() {
  const { user } = await requireAuth()
  const userId = user.id

  try {
    const schedules = await prisma.schedule.findMany({
      where: { userId },
      orderBy: [
        { day: 'asc' },
        { startTime: 'asc' },
      ],
    })
    return schedules
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Gagal memuat jadwal.')
  }
}

export async function deleteSchedulesAction() {
  const { user } = await requireAuth()
  const userId = user.id

  try {
    await prisma.schedule.deleteMany({
      where: { userId },
    })
    return { success: true, message: 'Seluruh jadwal berhasil dikosongkan.' }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Gagal menghapus jadwal.')
  }
}
