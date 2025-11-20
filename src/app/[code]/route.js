import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const code = params.code;

 
  const link = await prisma.link.findUnique({
    where: { code },
  });

  // If not found → 404
  if (!link) {
    return new Response("Not found", { status: 404 });
  }

  // Update stats  
  prisma.link
    .update({
      where: { code },
      data: { clicks: { increment: 1 }, lastClicked: new Date() },
    })
    .catch(() => {});

  // Redirect
  return new Response(null, {
    status: 302,
    headers: {
      Location: link.url,
    },
  });
}
