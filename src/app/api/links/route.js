import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createSchema = z.object({
  url: z.string().url(),
  code: z.string().regex(/^[A-Za-z0-9]{6,8}$/).optional()
});

function generateCode(len = 7) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = createSchema.parse(body);

    let code = parsed.code;
    if (code) {
      const existing = await prisma.link.findUnique({ where: { code } });
      if (existing) return new Response(JSON.stringify({ error: 'Code already exists' }), { status: 409 });
    } else {
      let tries = 0;
      while (!code && tries < 10) {
        const candidate = generateCode(7);
        const existing = await prisma.link.findUnique({ where: { code: candidate } });
        if (!existing) code = candidate;
        tries++;
      }
      if (!code) return new Response(JSON.stringify({ error: 'Unable to generate unique code' }), { status: 500 });
    }

    const created = await prisma.link.create({ data: { code, url: parsed.url } });

    return new Response(JSON.stringify({ data: created }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    if (err?.name === 'ZodError') {
      return new Response(JSON.stringify({ error: err.errors }), { status: 400 });
    }
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q =searchParams.get('q');
  if (q) {
    const links = await prisma.link.findMany({
      where: {
        OR: [
          { code: { contains: q } },
          { url: { contains: q } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
    return new Response(JSON.stringify({ data: links }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  const links = await prisma.link.findMany({ orderBy: { createdAt: 'desc' } });
  return new Response(JSON.stringify({ data: links }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
