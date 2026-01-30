// src/app/page.tsx
import Link from "next/link";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV === "development") globalForPrisma.prisma = prisma;

export default async function HomePage() {
  const lists = await prisma.list.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
    include: {
      expert: true,
      sections: true,
    },
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {/* HERO */}
      <section className="rounded-3xl bg-white p-10 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Editoryal liste merkezi
        </p>

        <h1 className="mt-4 text-4xl font-semibold text-ink">
          Kitapları değil, listeleri keşfedin.
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          İyi Kitap, her biri beşer kitaplık bölümlerden oluşan tematik listelerle
          okuma yolculuğuna yön verir. Satış yok; yalnızca editoryal kürasyon ve
          Amazon bağlantıları.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/lists"
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white"
          >
            Listelere git
          </Link>

          <a
            href="#listeler"
            className="rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-800"
          >
            Ana sayfada listeler
          </a>
        </div>
      </section>

      {/* LISTS */}
      <section id="listeler" className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold text-ink">Son listeler</h2>
          <Link href="/lists" className="text-sm font-semibold text-brand">
            Tümünü gör →
          </Link>
        </div>

        {lists.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-slate-600 shadow-card">
            Henüz liste yok. Prisma Studio’dan bir liste ekle, burada görünsün.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {lists.map((l) => (
              <article
                key={l.id}
                className="rounded-2xl bg-white p-6 shadow-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{l.title}</h3>
                    {l.summary ? (
                      <p className="mt-2 text-sm text-slate-600">{l.summary}</p>
                    ) : null}

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      {l.expert?.name ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1">
                          {l.expert.name}
                        </span>
                      ) : null}
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        Bölüm: {l.sections?.length ?? 0}
                      </span>
                    </div>
                  </div>

                  {/* Şimdilik liste detay route’un yoksa /lists’e gönderiyoruz */}
                  <Link
                    href="/lists"
                    className="shrink-0 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                  >
                    Aç
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
