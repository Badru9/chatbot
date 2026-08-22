import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Creating datasets table in PostgreSQL if it doesn't exist...");

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS datasets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      content TEXT NOT NULL,
      source TEXT,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_by TEXT NOT NULL,
      created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS datasets_is_active_idx ON datasets(is_active);
  `);

  console.log("Table 'datasets' created / verified successfully.");
}

main()
  .catch((e) => {
    console.error("Error creating datasets table:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
