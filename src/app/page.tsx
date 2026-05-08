import Link from "next/link";
import { prisma } from "@/lib/prisma";

const SECTION_ITEM_LIMIT = 5;
const ASIN_PATTERN = /^[A-Z0-9]{10}$/;

const hasConfiguredAsin = (asin: string | null | undefined) => {
  const normalizedAsin = asin?.trim().toUpperCase();

  if (!normalizedAsin) {
    return false;
  }

  return ASIN_PATTERN.test(normalizedAsin);
};

const placeholderFromText = (value: string) =>
  value
    .split(" ")
    .slice(0, 2)
    .map((token) => token[0] ?? "")
    .join("")
    .toUpperCase();

type ListWithCategories = {
  slug: string;
  categories?: { category: { slug: string } }[];
};

const getListUrl = (list?: ListWithCategories | null) => {
  if (!list) return "/lists";
  const categorySlug = list.categories?.[0]?.category?.slug;
  if (categorySlug) {
    return `/lists/${categorySlug}/${list.slug}`;
  }
  return `/lists`;
};

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
      include: { 
        expert: true, 
        categories: { include: { category: true } }, 
        sections: { include: { items: true } } 
      },
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
      include: { section: { include: { list: { include: { categories: { include: { category: true } } } } } } }
    }),
    prisma.listItem.findMany({
      where: { section: { list: { theme: "similar_books" } } },
      orderBy: [{ createdAt: "desc" }],
      take: SECTION_ITEM_LIMIT,
      include: { section: { include: { list: { include: { categories: { include: { category: true } } } } } } }
    }),
    prisma.list.findMany({
      where: { theme: "reading_list" },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        categories: { include: { category: true } },
        sections: {
          orderBy: { order: "asc" },
          include: { items: { orderBy: { order: "asc" }, take: SECTION_ITEM_LIMIT } },
        },
      },
    }),
  ]);

  const heroList = latestInterviews[0] || latestReadingLists[0];
  const heroItems = heroList?.sections?.[0]?.items?.slice(0, 3) || [];
  const secondaryList = latestInterviews[1] || latestReadingLists[1];
  const secondaryItems = secondaryList?.sections?.[0]?.items?.slice(0, 2) || [];
  const highlightedCategories = featuredCategories;

  return (
    <main className="bg-white text-ink">

      {/* ═══ 3. Primary category nav ═══ */}
      <section className="border-b border-zinc-gray bg-white">
        <nav className="flex items-center justify-center divide-x divide-zinc-gray overflow-x-auto no-scrollbar">
          {topCategories.map((category) => (
            <Link
              key={category.id}
              href={`/lists`}
              className="px-5 py-3 text-[11px] font-bold text-ink transition-colors hover:bg-cloud uppercase tracking-widest whitespace-nowrap"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </section>

      {/* ═══ 4. Main editorial grid ═══ */}
      <section className="border-b border-zinc-gray">
        <div className="px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">

            {/* Left: Large featured block */}
            <div className="md:col-span-5 md:border-r md:border-zinc-gray md:pr-6 pb-6 md:pb-0">
              {heroList ? (
                <article>
                  {heroItems.length > 0 && heroItems[0].coverImageUrl && (
                    <Link href={getListUrl(heroList)} className="block mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={heroItems[0].coverImageUrl}
                        alt={heroItems[0].titleOverride ?? heroList.title}
                        className="w-full aspect-[4/3] object-cover"
                        style={{ borderRadius: "8px" }}
                      />
                    </Link>
                  )}
                  {heroList.expert && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-sterling mb-2">
                      {heroList.expert.name}
                      {heroList.expert.title ? ` — ${heroList.expert.title}` : ""}
                    </p>
                  )}
                  <h2 className="text-2xl sm:text-[28px] font-serif font-bold leading-tight tracking-editorial-tight text-ink">
                    <Link
                      href={getListUrl(heroList)}
                      className="hover:text-sterling transition-colors"
                    >
                      {heroList.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-sterling line-clamp-4">
                    {heroList.summary}
                  </p>
                  <Link
                    href={getListUrl(heroList)}
                    className="inline-block mt-4 text-[11px] font-bold uppercase tracking-widest text-ink border-b border-ink pb-0.5 hover:text-sterling hover:border-sterling transition-colors"
                  >
                    Listeyi İncele
                  </Link>
                </article>
              ) : (
                <div className="py-12 text-center text-sterling text-sm">
                  Henüz öne çıkan liste yok.
                </div>
              )}
            </div>

            {/* Middle: Stacked editorial cards */}
            <div className="md:col-span-4 md:border-r md:border-zinc-gray md:px-6 py-6 md:py-0">
              {secondaryList && (
                <article className="pb-6 mb-6 border-b border-zinc-gray">
                  {secondaryList.expert && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-sterling mb-2">
                      {secondaryList.expert.name}
                    </p>
                  )}
                  <h3 className="text-lg font-serif font-bold leading-tight tracking-editorial-tight text-ink">
                    <Link
                      href={getListUrl(secondaryList)}
                      className="hover:text-sterling transition-colors"
                    >
                      {secondaryList.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-sterling line-clamp-3 leading-relaxed">
                    {secondaryList.summary}
                  </p>
                </article>
              )}
              {/* Stacked book items from hero */}
              {heroItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 py-3 border-b border-zinc-gray last:border-b-0"
                >
                  {item.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.coverImageUrl}
                      alt={item.titleOverride ?? item.asin}
                      className="w-12 h-16 object-cover shrink-0"
                      style={{ borderRadius: "2px" }}
                    />
                  ) : (
                    <div className="w-12 h-16 bg-cloud border border-zinc-gray flex items-center justify-center shrink-0 text-[9px] font-bold text-sterling">
                      {placeholderFromText(item.titleOverride ?? item.asin)}
                    </div>
                  )}
                  <div className="flex flex-col justify-center min-w-0">
                    <p className="text-sm font-serif font-bold text-ink line-clamp-2 leading-tight">
                      {item.titleOverride ?? item.asin}
                    </p>
                    <p className="text-[11px] text-sterling mt-0.5 line-clamp-1">
                      {item.authorOverride ?? ""}
                    </p>
                    {hasConfiguredAsin(item.asin) && (
                      <Link
                        href={`/go/${item.id}`}
                        className="text-[10px] font-bold uppercase tracking-widest text-ink mt-1 hover:text-sterling transition-colors"
                      >
                        Amazon&apos;da Gör
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Sidebar modules */}
            <div className="md:col-span-3 md:pl-6 pt-6 md:pt-0">
              {/* Kitaplardan Kitaplar */}
              <div className="mb-6 pb-6 border-b border-zinc-gray">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-ink mb-3 pb-2 border-b border-ink">
                  Kitaplardan Kitaplar
                </h4>
                {similarBooksItems.length > 0 ? (
                  <ul className="space-y-3">
                    {similarBooksItems.slice(0, 3).map((item) => (
                      <li key={item.id}>
                        <p className="text-sm font-serif font-bold text-ink line-clamp-2 leading-tight">
                          {item.titleOverride ?? item.asin}
                        </p>
                        <p className="text-[11px] text-sterling line-clamp-1 mt-0.5">
                          {item.authorOverride ?? ""}
                        </p>
                        {hasConfiguredAsin(item.asin) ? (
                          <Link
                            href={`/go/${item.id}`}
                            className="text-[10px] font-bold uppercase tracking-widest text-ink mt-1 inline-block hover:text-sterling transition-colors"
                          >
                            Amazon&apos;da Gör
                          </Link>
                        ) : (
                          <Link
                            href={getListUrl(item.section?.list)}
                            className="text-[10px] font-bold uppercase tracking-widest text-sterling mt-1 inline-block hover:text-ink transition-colors"
                          >
                            Liste içinde gör →
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-sterling">Yakında eklenecek.</p>
                )}
              </div>

              {/* Editörün Seçimi */}
              <div className="mb-6 pb-6 border-b border-zinc-gray">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-ink mb-3 pb-2 border-b border-ink">
                  Editörün Seçimi
                </h4>
                {topRecommendedItems.length > 0 ? (
                  <ul className="space-y-3">
                    {topRecommendedItems.slice(0, 3).map((item) => (
                      <li key={item.id}>
                        <p className="text-sm font-serif font-bold text-ink line-clamp-2 leading-tight">
                          {item.titleOverride ?? item.asin}
                        </p>
                        <p className="text-[11px] text-sterling line-clamp-1 mt-0.5">
                          {item.authorOverride ?? ""}
                        </p>
                        {hasConfiguredAsin(item.asin) ? (
                          <Link
                            href={`/go/${item.id}`}
                            className="text-[10px] font-bold uppercase tracking-widest text-ink mt-1 inline-block hover:text-sterling transition-colors"
                          >
                            Amazon&apos;da Gör
                          </Link>
                        ) : (
                          <Link
                            href={getListUrl(item.section?.list)}
                            className="text-[10px] font-bold uppercase tracking-widest text-sterling mt-1 inline-block hover:text-ink transition-colors"
                          >
                            Liste içinde gör →
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-sterling">Yakında eklenecek.</p>
                )}
              </div>

              {/* Affiliate CTA block */}
              <div className="bg-ink p-4" style={{ borderRadius: "8px" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-editorial-yellow mb-2">
                  Kitap Al
                </p>
                <p className="text-sm text-white leading-relaxed font-serif">
                  En sevdiğiniz kitapları Amazon üzerinden keşfedin.
                </p>
                <Link
                  href="/lists"
                  className="inline-block mt-3 bg-editorial-yellow text-ink text-[11px] font-bold uppercase tracking-widest px-4 py-2 hover:opacity-80 transition-opacity"
                  style={{ borderRadius: 0 }}
                >
                  Listelere Göz At
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5. Son Listeler / Interviews ═══ */}
      {latestInterviews.length > 0 && (
        <section className="border-b border-zinc-gray px-6 py-10">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-xl font-serif font-bold tracking-editorial-tight text-ink">
              Son Listeler
            </h2>
            <Link
              href="/lists"
              className="text-[11px] font-bold uppercase tracking-widest text-sterling hover:text-ink transition-colors"
            >
              Tümünü Gör →
            </Link>
          </div>
          <div className="grid gap-0 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-gray">
            {latestInterviews.map((list) => (
              <article
                key={list.id}
                className="py-5 md:py-0 md:px-6 first:md:pl-0 last:md:pr-0"
              >
                {list.expert && (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-sterling mb-2">
                    {list.expert.name}
                  </p>
                )}
                <h3 className="text-lg font-serif font-bold leading-tight tracking-editorial-tight text-ink">
                  <Link
                    href={getListUrl(list)}
                    className="hover:text-sterling transition-colors"
                  >
                    {list.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-sterling line-clamp-3">
                  {list.summary}
                </p>
                <Link
                  href={getListUrl(list)}
                  className="inline-block mt-3 text-[10px] font-bold uppercase tracking-widest text-ink border-b border-ink pb-0.5 hover:text-sterling hover:border-sterling transition-colors"
                >
                  Devamını Oku
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ═══ 6. Uzmanlar ═══ */}
      {experts.length > 0 && (
        <section className="border-b border-zinc-gray px-6 py-10">
          <h2 className="text-xl font-serif font-bold tracking-editorial-tight text-ink mb-6 pb-2 border-b border-ink inline-block">
            Uzmanlar
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {experts.map((expert) => (
              <div key={expert.id} className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center border border-zinc-gray bg-white text-xl font-serif font-bold text-sterling">
                  {placeholderFromText(expert.name)}
                </div>
                <h3 className="mt-3 text-sm font-bold text-ink">
                  {expert.name}
                </h3>
                <p className="mt-0.5 text-[11px] text-sterling">
                  {expert.title ?? "Uzman"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ 7. Kategoriler ═══ */}
      {highlightedCategories.length > 0 && (
        <section className="border-b border-zinc-gray px-6 py-10">
          <h2 className="text-xl font-serif font-bold tracking-editorial-tight text-ink mb-6 pb-2 border-b border-ink inline-block">
            Kategoriler
          </h2>
          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-zinc-gray">
            {highlightedCategories.map((category) => (
              <Link key={category.id} href={`/lists`} className="group block">
                <div className="border-r border-b border-zinc-gray p-5 transition-colors hover:bg-cloud">
                  <p className="text-sm font-serif font-bold text-ink group-hover:text-sterling transition-colors">
                    {category.name}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-sterling mt-1">
                    Keşfet →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ 8. Kütüphaneden Seçmeler ═══ */}
      {(topRecommendedItems.length > 0 || similarBooksItems.length > 0) && (
        <section className="border-b border-zinc-gray px-6 py-10">
          <h2 className="text-xl font-serif font-bold tracking-editorial-tight text-ink mb-6 pb-2 border-b border-ink inline-block">
            Kütüphaneden Seçmeler
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {[...topRecommendedItems.slice(0, 5), ...similarBooksItems.slice(0, 5)]
              .slice(0, 10)
              .map((item) => (
                <article key={item.id} className="group flex flex-col">
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-cloud border border-zinc-gray" style={{ borderRadius: "4px" }}>
                    {item.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.coverImageUrl}
                        alt={item.titleOverride ?? item.asin}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-4 text-center text-xs font-bold text-sterling">
                        {placeholderFromText(item.titleOverride ?? item.asin)}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex flex-col flex-1">
                    <h3 className="text-sm font-serif font-bold text-ink line-clamp-2 leading-tight">
                      {item.titleOverride ?? item.asin}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-sterling line-clamp-1">
                      {item.authorOverride ?? ""}
                    </p>
                    <div className="mt-auto pt-2">
                      {hasConfiguredAsin(item.asin) ? (
                        <Link
                          href={`/go/${item.id}`}
                          className="text-[10px] font-bold uppercase tracking-widest text-ink border-b border-ink pb-0.5 hover:text-sterling hover:border-sterling transition-colors"
                        >
                          Amazon&apos;da Gör
                        </Link>
                      ) : (
                        <Link
                          href={getListUrl(item.section?.list)}
                          className="text-[10px] font-bold uppercase tracking-widest text-sterling hover:text-ink transition-colors"
                        >
                          Liste içinde gör →
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </section>
      )}

      {/* ═══ 9. En Yeni Okuma Listeleri ═══ */}
      {latestReadingLists.length > 0 && (
        <section className="px-6 py-10">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-xl font-serif font-bold tracking-editorial-tight text-ink">
              En Yeni Okuma Listeleri
            </h2>
            <Link
              href="/lists"
              className="text-[11px] font-bold uppercase tracking-widest text-sterling hover:text-ink transition-colors"
            >
              Tüm Listeler →
            </Link>
          </div>
          <div className="space-y-0 divide-y divide-zinc-gray border-t border-zinc-gray">
            {latestReadingLists.map((list) => (
              <article
                key={list.id}
                className="flex flex-col md:flex-row gap-6 md:gap-10 py-6"
              >
                <div className="md:w-1/3 flex flex-col">
                  <h3 className="text-lg font-serif font-bold text-ink leading-tight tracking-editorial-tight">
                    <Link href={getListUrl(list)} className="hover:text-sterling transition-colors">
                      {list.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-sterling flex-1 line-clamp-3">
                    {list.summary}
                  </p>
                  <Link
                    href={getListUrl(list)}
                    className="mt-4 inline-flex w-fit items-center text-[10px] font-bold uppercase tracking-widest text-ink border-b border-ink pb-0.5 hover:text-sterling hover:border-sterling transition-colors"
                  >
                    Listeyi İncele →
                  </Link>
                </div>
                <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-zinc-gray pt-4 md:pt-0 md:pl-10">
                  <ol className="grid gap-4 sm:grid-cols-3">
                    {(list.sections[0]?.items ?? [])
                      .slice(0, 3)
                      .map((item, index) => (
                        <li key={item.id} className="relative">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-sterling">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <p className="font-serif font-bold text-sm text-ink line-clamp-2 mt-1 leading-tight">
                            {item.titleOverride ?? item.asin}
                          </p>
                          <p className="text-[11px] text-sterling mt-0.5 line-clamp-1">
                            {item.authorOverride ?? ""}
                          </p>
                          <div className="mt-2">
                            {hasConfiguredAsin(item.asin) ? (
                              <Link
                                href={`/go/${item.id}`}
                                className="text-[10px] font-bold uppercase tracking-widest text-ink hover:text-sterling transition-colors"
                              >
                                Amazon&apos;da Gör
                              </Link>
                            ) : (
                              <Link
                                href={getListUrl(list)}
                                className="text-[10px] font-bold uppercase tracking-widest text-sterling hover:text-ink transition-colors"
                              >
                                Liste İçinde Gör
                              </Link>
                            )}
                          </div>
                        </li>
                      ))}
                  </ol>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
