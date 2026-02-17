import Link from "next/link";

import { prisma } from "@/lib/prisma";

const SECTION_ITEM_LIMIT = 5;

const placeholderFromText = (value: string) =>
  value
    .split(" ")
    .slice(0, 2)
    .map((token) => token[0] ?? "")
    .join("")
    .toUpperCase();

export default async function HomePage() {
  const [
    topCategories,
    featuredCategories,
    latestInterviews,
    latestRecommendedItems,
    experts,
    topRecommendedItems,
    similarBooksItems,
    latestReadingLists,
  ] = await Promise.all([
    prisma.listCategory.findMany({
      where: { parent: { slug: "top-nav" } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.listCategory.findMany({
      where: { parent: { slug: "featured-grid" } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.list.findMany({
      where: { expertId: { not: null } },
      orderBy: { createdAt: "desc" },
      take: 2,
      include: { expert: true, sections: { include: { items: true } } },
    }),
    prisma.listItem.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.expert.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.listItem.findMany({
      where: { section: { list: { theme: "top_recommended" } } },
      orderBy: [{ createdAt: "desc" }],
      take: 10,
    }),
    prisma.listItem.findMany({
      where: { section: { list: { theme: "similar_books" } } },
      orderBy: [{ createdAt: "desc" }],
      take: SECTION_ITEM_LIMIT,
    }),
    prisma.list.findMany({
      where: { theme: "reading_list" },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        sections: {
          orderBy: { order: "asc" },
          include: { items: { orderBy: { order: "asc" }, take: SECTION_ITEM_LIMIT } },
        },
      },
    }),
  ]);

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
      <nav className="flex flex-wrap gap-2">
        {topCategories.map((category) => (
          <Link
            key={category.id}
            href="/lists"
            className="rounded-full border border-slate-300 px-3 py-1 text-sm"
          >
            {category.name}
          </Link>
        ))}
      </nav>

      <section>
        <h2 className="text-lg font-semibold">SON LİSTELER VE RÖPORTAJLAR</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {latestInterviews.map((list) => (
            <article key={list.id} className="rounded-xl border bg-white p-4">
              <h3 className="text-xl font-semibold">{list.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{list.summary}</p>
              <p className="mt-3 text-sm font-medium">{list.expert?.name}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">GÖRSEL KATEGORİLER</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCategories.map((category) => (
            <article
              key={category.id}
              className="relative flex min-h-24 items-end overflow-hidden rounded-xl border border-slate-300 bg-slate-800 p-4 text-white"
            >
              <div className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-white/40">
                {placeholderFromText(category.name)}
              </div>
              <p className="relative z-10 text-xl font-semibold">{category.name}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">SON ÖNERİLEN KİTAPLAR</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {latestRecommendedItems.map((item) => (
            <li key={item.id} className="rounded-lg border bg-white p-3">
              <p className="font-semibold">{item.titleOverride ?? item.asin}</p>
              <p className="text-sm text-slate-600">{item.authorOverride ?? "Yazar bilgisi yok"}</p>
              <p className="mt-1 text-sm text-slate-500">{item.noteShort ?? "Not bulunamadı."}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">UZMANLAR</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {experts.map((expert) => (
            <li key={expert.id} className="rounded-xl border bg-white p-3 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-xl font-semibold text-slate-700">
                {placeholderFromText(expert.name)}
              </div>
              <p className="mt-2 text-sm font-semibold">{expert.name}</p>
              <p className="text-xs text-slate-500">{expert.title ?? "Uzman"}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">EN ÇOK TAVSİYE EDİLEN İYİ KİTAPLAR</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {topRecommendedItems.slice(0, SECTION_ITEM_LIMIT).map((item) => (
            <li key={item.id} className="rounded-xl border bg-white p-3">
              <div className="mb-2 flex h-24 items-center justify-center rounded bg-slate-100 text-xs text-slate-500">
                Görsel yok
              </div>
              <p className="text-sm font-semibold">{item.titleOverride ?? item.asin}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">GİBİ KİTAPLAR</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {similarBooksItems.slice(0, SECTION_ITEM_LIMIT).map((item) => (
            <li key={item.id} className="rounded-xl border bg-white p-3">
              <div className="mb-2 flex h-24 items-center justify-center rounded bg-slate-100 text-xs text-slate-500">
                Görsel yok
              </div>
              <p className="text-sm font-semibold">{item.titleOverride ?? item.asin}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">SON OKUMA LİSTELERİ</h2>
        <div className="mt-4 space-y-6">
          {latestReadingLists.map((list) => (
            <article key={list.id} className="rounded-xl border bg-white p-4">
              <h3 className="text-xl font-semibold">{list.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{list.summary}</p>
              <ol className="mt-4 grid gap-3 sm:grid-cols-5">
                {(list.sections[0]?.items ?? []).slice(0, SECTION_ITEM_LIMIT).map((item, index) => (
                  <li key={item.id} className="rounded-lg border p-2 text-sm">
                    <p className="font-semibold">{index + 1}. {item.titleOverride ?? item.asin}</p>
                    <p className="text-xs text-slate-500">{item.authorOverride ?? "Yazar bilgisi yok"}</p>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
