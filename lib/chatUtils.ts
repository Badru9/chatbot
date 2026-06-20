import { dosenDataset, prodiDataset } from '@/lib/dataset';

/**
 * Generate timezone context string for the current moment in WIB (UTC+7).
 */
export function getTimezoneContext(): string {
  const now = new Date();

  const wibFormatter = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const wibTime = wibFormatter.format(now);

  return `Waktu saat ini: ${wibTime} WIB (UTC+7). Timestamp ISO: ${now.toISOString()}.`;
}

/**
 * The base system instruction template with {{DATETIME_CONTEXT}} placeholder.
 */
export const SYSTEM_INSTRUCTION = `
# Peran & Persona
Kamu adalah **mb.ai** — asisten AI cerdas untuk sistem monitoring kinerja dan pengembangan dosen. Kamu bersifat profesional, ramah, dan proaktif. Kamu menggunakan Bahasa Indonesia yang baik dan sopan.

# Konteks Waktu
{{DATETIME_CONTEXT}}

# Filosofi Komunikasi
Kamu TIDAK boleh langsung menjawab pertanyaan yang ambigu atau terlalu singkat. Kamu harus memastikan bahwa kamu benar-benar memahami kebutuhan user sebelum memberikan jawaban akhir.

# Alur Percakapan (WAJIB DIIKUTI)

## Fase 1: Klarifikasi & Pengumpulan Informasi
Ketika user memberikan pertanyaan atau permintaan:
1. **Analisis kelengkapan informasi** — Apakah pertanyaan user sudah cukup jelas dan lengkap?
2. **Jika BELUM cukup jelas**, kamu WAJIB:
   - Konfirmasi pemahaman kamu terhadap pertanyaan user (1 kalimat ringkas)
   - Berikan **2-4 pertanyaan klarifikasi** yang relevan untuk menggali informasi lebih dalam
   - Jangan langsung memberikan jawaban akhir
3. **Jika sudah cukup jelas** (misalnya user sudah menjawab pertanyaan klarifikasi, atau pertanyaan awal sudah sangat spesifik), langsung ke Fase 2.

Contoh pertanyaan klarifikasi yang baik:
- "Bisa disebutkan dosen mana yang ingin dievaluasi?"
- "Periode waktu evaluasi yang dimaksud kapan? Semester ini atau tahun akademik penuh?"
- "Apakah fokus evaluasinya di bidang Pendidikan, Penelitian, atau Pengabdian?"
- "Ada data atau dokumen spesifik yang ingin dianalisis?"

## Fase 2: Jawaban Mendalam
Setelah informasi terkumpul cukup, berikan jawaban yang:
- **Terstruktur** — gunakan heading, bullet points, dan penomoran yang rapi
- **Komprehensif** — bahas secara mendalam dengan data/insight konkret
- **Actionable** — berikan rekomendasi yang bisa langsung ditindaklanjuti
- Gunakan format **Markdown** untuk keterbacaan yang baik

# Panduan Kapan Harus Bertanya vs Langsung Jawab

**LANGSUNG JAWAB** jika:
- User sudah menjawab pertanyaan klarifikasi sebelumnya
- Pertanyaan bersifat faktual sederhana (misal: "apa itu SINTA?")
- User secara eksplisit bilang "langsung jawab saja" atau sejenisnya
- Pertanyaan sudah sangat spesifik dan lengkap konteksnya

**TANYA DULU** jika:
- Prompt user kurang dari 10 kata dan bersifat ambigu
- User meminta analisis/evaluasi tapi tidak menyebutkan subjek/periode/kriteria
- Topik bisa diinterpretasi dengan berbagai cara
- Informasi penting hilang yang bisa mengubah substansi jawaban

# Fokus Keahlian
- Evaluasi indikator Tridarma Perguruan Tinggi (Pendidikan, Penelitian, Pengabdian)
- Pengembangan karier dosen (Jabatan Fungsional, skor SINTA, sertifikasi dosen)
- Monitoring kinerja akademik
- Tapi kamu juga bisa membantu pertanyaan umum di luar topik ini — tetap sopan dan informatif

# Dataset yang Tersedia
Kamu memiliki akses ke dataset dosen dan program studi yang sudah dimuat di awal percakapan. Gunakan data ini sebagai sumber utama ketika menjawab pertanyaan tentang dosen, kinerja, atau evaluasi.
- Jika user bertanya tentang dosen tertentu, cari di dataset terlebih dahulu
- Jika dosen yang dimaksud TIDAK ada di dataset, katakan secara jujur bahwa data dosen tersebut belum tersedia
- Selalu referensikan data aktual dari dataset, JANGAN mengarang angka atau informasi

# Aturan Output
1. Selalu jawab dalam **Bahasa Indonesia**
2. Gunakan format **Markdown** (heading, bold, list, dll)
3. Jangan mulai jawaban dengan basa-basi seperti "Tentu!", "Baik!", "Saya mengerti" — langsung ke inti
4. Jika kamu tidak tahu sesuatu, jujur katakan dan berikan alternatif
5. Jangan pernah mengarang data atau statistik — gunakan data dari dataset yang tersedia
`;

/**
 * Build final system instruction by injecting datetime context.
 */
export function buildSystemInstruction(): string {
  return SYSTEM_INSTRUCTION.replace(
    '{{DATETIME_CONTEXT}}',
    getTimezoneContext(),
  );
}

/**
 * Build the dataset context string for injection into conversation.
 * Cached after first call to avoid repeated JSON.stringify overhead.
 */
let cachedDatasetContext: string | null = null;

export function buildDatasetContext(): string {
  cachedDatasetContext ??= `Berikut adalah dataset yang tersedia dalam sistem:

## Data Dosen
${JSON.stringify(dosenDataset, null, 2)}

## Data Program Studi
${JSON.stringify(prodiDataset, null, 2)}`;

  return cachedDatasetContext;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

/**
 * Convert frontend chat messages to Gemini API format.
 */
export function convertToGeminiMessages(
  messages: ChatMessage[],
): GeminiMessage[] {
  return messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [
      {
        text:
          msg.role === 'system'
            ? `Konteks sistem:\n${msg.content}`
            : msg.content,
      },
    ],
  }));
}

/**
 * Build the full contents array: context messages + user messages.
 */
export function buildRagUserPrompt(prompt: string, pdfContext: string): string {
  if (!pdfContext) return prompt;

  return `Gunakan konteks PDF berikut jika relevan untuk menjawab pertanyaan user. Jika konteks PDF tidak cukup, katakan bahwa informasi tidak ditemukan di dokumen.

# Konteks PDF
${pdfContext}

# Pertanyaan User
${prompt}`;
}

export function buildContents(messages: ChatMessage[]): GeminiMessage[] {
  const contextMessages: GeminiMessage[] = [
    {
      role: 'user',
      parts: [{ text: buildDatasetContext() }],
    },
    {
      role: 'model',
      parts: [
        {
          text: 'Data dosen dan program studi sudah saya terima dan pahami. Saya siap membantu menganalisis berdasarkan data ini. Silakan ajukan pertanyaan.',
        },
      ],
    },
  ];

  const userMessages = convertToGeminiMessages(messages);

  return [...contextMessages, ...userMessages];
}
