This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

Copy `.env.example` to `.env` (or `.env.local`) and configure the following variables:

```env
# Database
DATABASE_URL="postgresql://postgres:123456@localhost:5432/rag_chatbot"

# Gemini AI (Dipisah antara Chat Model dan Embedding Model)
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_CHAT_MODEL="gemini-2.5-flash"       # Model untuk Chat & Generate Text (generateContent / streamGenerateContent)
GEMINI_EMBED_MODEL="gemini-embedding-001"   # Model untuk Vector Embedding (embedContent)

# S3-compatible Object Storage (MinIO lokal / Cloudflare R2 production)
S3_ENDPOINT=localhost
S3_PORT=9000
S3_USE_SSL=false
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET_NAME=pdf-documents
```

> **Catatan Penting Gemini Model:**
> Model text generation (seperti `gemini-2.5-flash`, `gemini-2.5-pro`) dan model embedding (seperti `gemini-embedding-001`, `gemini-embedding-2`) memiliki fungsi API yang berbeda. Model embedding tidak mendukung `generateContent`/`streamGenerateContent`, sehingga konfigurasi model keduanya dipisahkan (`GEMINI_CHAT_MODEL` & `GEMINI_EMBED_MODEL`).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

