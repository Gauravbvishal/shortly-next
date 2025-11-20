# Shortly - Link Shortener (Next.js + Prisma)

## Setup (local)
1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Install dependencies: `npm install`
3. Generate prisma client: `npm run prisma:generate`
4. Run migrations: `npm run prisma:migrate`
5. Start dev server: `npm run dev`

## Endpoints
- GET /healthz
- POST /api/links { url, code? }
- GET /api/links
- GET /api/links/:code
- DELETE /api/links/:code
- GET /:code -> redirect (302)
