import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/documents/[id]
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const doc = await prisma.document.findUnique({ where: { id: params.id } });
  if (!doc) return NextResponse.json({ error: 'Documento no encontrado.' }, { status: 404 });
  return NextResponse.json(doc);
}

// DELETE /api/documents/[id] — solo ADMIN
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Acceso denegado.' }, { status: 403 });
  }

  await prisma.document.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
