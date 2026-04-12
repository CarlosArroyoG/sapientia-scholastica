import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/progress — retorna el progreso del usuario autenticado
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ base: 0, uploaded: {} });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { progress: true },
  });

  if (!user) return NextResponse.json({ base: 0, uploaded: {} });

  const uploaded: Record<string, number> = {};
  user.progress.forEach((p) => {
    uploaded[p.documentId] = p.page;
  });

  return NextResponse.json({ base: user.baseProgress, uploaded });
}

// PUT /api/progress — actualiza el progreso de lectura
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
  }

  const body = (await request.json()) as { type: string; page: number; documentId?: string };
  const { type, page, documentId } = body;

  if (typeof page !== 'number' || page < 0) {
    return NextResponse.json({ error: 'Página inválida.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 });

  if (type === 'base') {
    await prisma.user.update({ where: { id: user.id }, data: { baseProgress: page } });
  } else if (type === 'document' && documentId) {
    // Verify the document exists before upserting
    const docExists = await prisma.document.findUnique({ where: { id: documentId } });
    if (!docExists) return NextResponse.json({ error: 'Documento no encontrado.' }, { status: 404 });

    await prisma.readingProgress.upsert({
      where: { userId_documentId: { userId: user.id, documentId } },
      update: { page },
      create: { userId: user.id, documentId, page },
    });
  } else {
    return NextResponse.json({ error: 'Tipo o documentId inválido.' }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
