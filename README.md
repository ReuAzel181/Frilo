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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) and Tailwind CSS. Fonts have been adjusted to compatible Google fonts for local development.

## App Overview

- API: `/api/upload` to save images and metadata, `/api/sections` for list/create, `/api/sections/[id]` for get/update/delete.
- Pages: `/upload` for drag-and-drop, paste, preview, label/tags; `/gallery` for filter, search, and modal preview.
- Data: Prisma + SQLite (`DATABASE_URL="file:./dev.db"`). Client generated to `src/generated/prisma`.
- UI: [shadcn/ui](https://ui.shadcn.com) components and subtle [Framer Motion](https://www.framer.com/motion/) transitions.

## Storage Migration: Local → Vercel Blob or Supabase

Local development writes uploaded files to `public/uploads`. This is not persistent on serverless platforms. Choose one of these production options:

### Option A — Vercel Blob
1. Enable Blob Storage in your Vercel project.
2. Add env vars locally and on Vercel:
   - `BLOB_READ_WRITE_TOKEN` (Project → Storage → Blob → Tokens)
3. Replace local file writes in `src/app/api/upload/route.ts` with Blob client usage:
   ```ts
   import { put } from "@vercel/blob";
   const { url } = await put(`sections/${Date.now()}-${file.name}`, file, { access: "public" });
   // store `url` in Prisma instead of local path
   ```
4. Remove filesystem directory checks for `public/uploads` when running in production.

### Option B — Supabase Storage
1. Create a Supabase project and a public bucket (e.g., `sections`).
2. Add env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
3. In `route.ts`, upload via Supabase client:
   ```ts
   import { createClient } from "@supabase/supabase-js";
   const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
   const { data, error } = await supabase.storage.from("sections").upload(`/${Date.now()}-${file.name}`, file, { upsert: true });
   const { data: pub } = supabase.storage.from("sections").getPublicUrl(data.path);
   const url = pub.publicUrl;
   ```
4. Store the returned `url` in Prisma instead of local paths.

### Switching by Environment

Add a simple runtime check in `route.ts` to switch providers:
```ts
const useLocal = process.env.NODE_ENV !== "production" && !process.env.BLOB_READ_WRITE_TOKEN && !process.env.SUPABASE_SERVICE_ROLE_KEY;
// if useLocal: write to public/uploads; else choose Blob or Supabase based on which env is present
```

This keeps local DX while enabling production-grade storage.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
