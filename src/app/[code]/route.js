import { prisma } from '@/lib/prisma';

export async function GET(req, { params }) {
  const { code } =await params;
  try {
    const updated = await prisma.link.update({
      where: { code },
      data: { clicks: { increment: 1 }, lastClicked: new Date() }
    });
    if (!updated) return new Response('Not found', { status: 404 });
    const headers = new Headers({ Location: updated.url });
    return new Response(null, { status: 302, headers });
  } catch (err) {
    // If not found, Prisma throws an error for update; return 404
    return new Response('Not found', { status: 404 });
  }
}
