import 'dotenv/config'
import prisma from '../lib/prisma'

async function main() {
  try {
    const user = await prisma.user.findFirst({
      select: { id: true, email: true, role: true }
    })
    console.log(`Found record: ${user ? user.email : 'No users yet (empty table)'}`)
    console.log('✅ Connected')
  } catch (error) {
    console.error('❌ Failed to connect to database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
