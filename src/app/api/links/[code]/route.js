import { prisma } from '@/lib/prisma';

export async function GET(req, { params }) {
  const { code } =await params;
  const link = await prisma.link.findUnique({ where: { code } });
  if (!link) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  return new Response(JSON.stringify({ data: link }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function DELETE(req, { params }) {
  const { code } =await params;
  try {
    await prisma.link.delete({ where: { code } });
    return new Response(null, { status: 204 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }
}
