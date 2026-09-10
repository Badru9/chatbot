import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Setting up ai_settings table in PostgreSQL...");

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS ai_settings (
      id TEXT PRIMARY KEY DEFAULT 'default',
      active_provider TEXT NOT NULL DEFAULT 'gemini',
      gemini_primary TEXT NOT NULL DEFAULT 'gemini-2.5-flash',
      gemini_fallbacks TEXT[] NOT NULL DEFAULT ARRAY['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.0-flash-lite']::TEXT[],
      ollama_base_url TEXT NOT NULL DEFAULT 'http://localhost:11434',
      ollama_model TEXT NOT NULL DEFAULT 'llama3.2',
      enable_auto_fallback BOOLEAN NOT NULL DEFAULT true,
      enable_cross_fallback BOOLEAN NOT NULL DEFAULT true,
      updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Ensure default row exists
  await prisma.$executeRawUnsafe(`
    INSERT INTO ai_settings (
      id,
      active_provider,
      gemini_primary,
      gemini_fallbacks,
      ollama_base_url,
      ollama_model,
      enable_auto_fallback,
      enable_cross_fallback,
      updated_at
    )
    VALUES (
      'default',
      'gemini',
      'gemini-3.8-flash',
      ARRAY['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.0-flash-lite']::TEXT[],
      'http://localhost:11434',
      'llama3.2',
      true,
      true,
      CURRENT_TIMESTAMP
    )
    ON CONFLICT (id) DO NOTHING;
  `);

  console.log("Table 'ai_settings' and default row initialized successfully.");
}

main()
  .catch((e) => {
    console.error("Error setting up ai_settings table:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
