import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { buildSmartDocument, type SmartDocument } from '@/lib/smartSummary';
import type { SmartReaderPage } from '@/lib/smartSummary';

// GET /api/documents — lista todos los documentos (público)
export async function GET() {
  const docs = await prisma.document.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      fileName: true,
      overview: true,
      keyPoints: true,
      sections: true,
      highlights: true,
      pages: true,
      createdAt: true,
    },
  });
  return NextResponse.json(docs);
}

// POST /api/documents — sube y procesa un PDF (solo ADMIN)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Acceso denegado. Solo administradores pueden subir documentos.' }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file || file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Solo se admiten archivos PDF.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Extract text with pdf-parse
  let pageTexts: string[];
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string; numpages: number }>;
    const pdfData = await pdfParse(buffer);
    // Split by form feed (page separator used by pdf-parse)
    pageTexts = pdfData.text
      .split(/\f/)
      .map((p) => p.replace(/\s+/g, ' ').trim())
      .filter((p) => p.length > 0);

    if (pageTexts.length === 0) {
      return NextResponse.json({ error: 'No se detectó texto legible en el PDF.' }, { status: 422 });
    }
  } catch {
    return NextResponse.json({ error: 'Error al procesar el PDF.' }, { status: 500 });
  }

  // Try OpenAI summarize, fall back to heuristic
  let smartDoc: SmartDocument;
  try {
    const { getOpenAIClient } = await import('@/lib/openai');
    const openai = getOpenAIClient();
    smartDoc = await summarizeWithOpenAI(openai, pageTexts, file.name);
  } catch {
    smartDoc = buildSmartDocument(pageTexts, file.name);
  }

  const doc = await prisma.document.create({
    data: {
      title: smartDoc.title,
      fileName: file.name,
      overview: smartDoc.overview,
      keyPoints: smartDoc.keyPoints as unknown as Parameters<typeof prisma.document.create>[0]['data']['keyPoints'],
      sections: smartDoc.sections as unknown as Parameters<typeof prisma.document.create>[0]['data']['sections'],
      highlights: smartDoc.highlights as unknown as Parameters<typeof prisma.document.create>[0]['data']['highlights'],
      pages: smartDoc.pages as unknown as Parameters<typeof prisma.document.create>[0]['data']['pages'],
      uploadedBy: session.user.email ?? undefined,
    },
  });

  return NextResponse.json({ ...smartDoc, id: doc.id }, { status: 201 });
}

// ── OpenAI summarize ──────────────────────────────────────────────────────────

import type OpenAI from 'openai';

async function summarizeWithOpenAI(
  openai: OpenAI,
  pageTexts: string[],
  fileName: string,
): Promise<SmartDocument> {
  const title = fileName.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' ').trim();
  const fullText = pageTexts.slice(0, 12).join('\n\n---\n\n').slice(0, 10000);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content:
          'Eres un resumidor académico. Responde ÚNICAMENTE con JSON válido, sin bloques de código markdown ni texto extra.',
      },
      {
        role: 'user',
        content: `Analiza este documento titulado "${title}" y devuelve exactamente este JSON:
{
  "overview": "resumen de 2-3 oraciones en español",
  "keyPoints": ["punto 1", "punto 2", "punto 3", "punto 4", "punto 5"],
  "sections": [{"title": "nombre sección", "text": "descripción breve"}, ...],
  "highlights": [{"no": "1", "text": "cita textual destacada"}, {"no": "2", "text": "otra cita"}]
}

Texto del documento:
${fullText}`,
      },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? '{}';
  const parsed = JSON.parse(raw) as Partial<{
    overview: string;
    keyPoints: string[];
    sections: Array<{ title: string; text: string }>;
    highlights: Array<{ no: string; text: string }>;
  }>;

  // Build pages from heuristic (OpenAI doesn't paginate for us)
  const base = buildSmartDocument(pageTexts, fileName);

  return {
    ...base,
    title,
    overview: typeof parsed.overview === 'string' ? parsed.overview : base.overview,
    keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : base.keyPoints,
    sections: Array.isArray(parsed.sections) ? parsed.sections : base.sections,
    highlights: Array.isArray(parsed.highlights) ? parsed.highlights : base.highlights,
    pages: base.pages as SmartReaderPage[],
  };
}
