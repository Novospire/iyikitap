import Link from "next/link";
import { prisma } from "@/lib/prisma";

const SECTION_ITEM_LIMIT = 5;
const ASIN_PATTERN = /^[A-Z0-9]{10}$/;

const hasConfiguredAsin = (asin: string | null | undefined) =>
  Boolean(asin?.trim()) && ASIN_PATTERN.test(asin.trim().toUpperCase());

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
  const highlightedCategories = featuredCategories;

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-slate-900 pb-20">
      {/* 1. Hero / editorial promise */}
      <section className="bg-slate-900 text-white px-6 py-20 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight tracking-tight">
              Listelerle <br className="hidden sm:block" /> okuma keşfi.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-light">
              Uzmanların, yazarların ve tutkulu okurların hazırladığı özenli kitap listeleriyle bir sonraki harika kitabınızı keşfedin. Ne okuyacağınızı düşünmek yerine, okumanın keyfine varın.
            </p>
          </div>

          {heroList && (
            <div className="mt-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-10">
              <div className="flex items-center gap-3 text-sm font-medium text-emerald-400 mb-4 uppercase tracking-wider">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
                Öne Çıkan Liste
              </div>
              <div className="grid md:grid-cols-2 gap-10 items-start">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    <Link href={getListUrl(heroList)} className="hover:text-emerald-300 transition-colors">
                      {heroList.title}
                    </Link>
                  </h2>
                  <p className="mt-4 text-slate-300 leading-relaxed">{heroList.summary}</p>
                  {heroList.expert && (
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 font-semibold">
                        {placeholderFromText(heroList.expert.name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{heroList.expert.name}</p>
                        <p className="text-xs text-slate-400">{heroList.expert.title ?? "Uzman"}</p>
                      </div>
                    </div>
                  )}
                </div>
                {heroItems.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {heroItems.map((item) => (
                      <div key={item.id} className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl bg-slate-800">
                        {item.coverImageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.coverImageUrl}
                            alt={item.titleOverride ?? item.asin}
                            className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity hover:opacity-100"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-xs font-medium text-slate-400 bg-slate-800">
                            {item.titleOverride ?? item.asin}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Category Discovery Strip */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6 overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider mr-2 whitespace-nowrap">Keşfet</span>
            {topCategories.map((category) => (
              <Link
                key={category.id}
                href={`/lists`}
                className="whitespace-nowrap rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-900"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-16 space-y-24">
        
        {/* 2. Category discovery grid */}
        {highlightedCategories.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Kategorilerde Gezin</h2>
                <p className="mt-1 text-slate-500">Farklı türlerdeki en iyi listeleri keşfedin.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {highlightedCategories.map((category, index) => (
                <Link key={category.id} href={`/lists`} className="group block">
                  <article className={`relative flex h-32 items-end overflow-hidden rounded-2xl p-5 transition-transform group-hover:-translate-y-1 ${
                    index % 3 === 0 ? "bg-indigo-100 text-indigo-900" :
                    index % 3 === 1 ? "bg-orange-100 text-orange-900" : "bg-emerald-100 text-emerald-900"
                  }`}>
                    <div className="absolute right-[-10%] top-[-20%] text-8xl font-bold opacity-10 transition-transform group-hover:scale-110">
                      {placeholderFromText(category.name)}
                    </div>
                    <p className="relative z-10 text-xl font-bold">{category.name}</p>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 3. Latest lists/interviews */}
        {latestInterviews.length > 0 && (
          <section>
             <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Özel Röportajlar & Listeler</h2>
                <p className="mt-1 text-slate-500">Uzman konuklarımızın seçkileri.</p>
              </div>
              <Link href="/lists" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Tümünü Gör &rarr;</Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {latestInterviews.map((list) => (
                <article key={list.id} className="group relative flex flex-col items-start justify-between rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
                  <div className="w-full">
                    <div className="flex items-center gap-x-4 text-xs">
                      {list.expert && (
                        <span className="relative z-10 rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-600">
                          {list.expert.name}
                        </span>
                      )}
                    </div>
                    <div className="group relative">
                      <h3 className="mt-4 text-xl font-bold leading-tight text-slate-900 group-hover:text-slate-600">
                        <Link href={getListUrl(list)} className="focus:outline-none">
                          <span className="absolute inset-0" aria-hidden="true" />
                          {list.title}
                        </Link>
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                        {list.summary}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 4. Recommended books / book cards */}
        {(topRecommendedItems.length > 0 || similarBooksItems.length > 0) && (
           <section>
             <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Kütüphaneden Seçmeler</h2>
                <p className="mt-1 text-slate-500">Okurların en çok ilgi gösterdiği kitaplar.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
              {[...topRecommendedItems.slice(0, 5), ...similarBooksItems.slice(0, 5)].slice(0, 10).map((item) => (
                <article key={item.id} className="group relative flex flex-col">
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-slate-100 shadow-sm transition-shadow group-hover:shadow-md">
                    {item.coverImageUrl ? (
                       // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.coverImageUrl}
                        alt={item.titleOverride ?? item.asin}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-4 text-center text-sm font-medium text-slate-400 bg-slate-50 border border-slate-200">
                        Görsel Yok
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex flex-col flex-1">
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                      {item.titleOverride ?? item.asin}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-1">{item.authorOverride ?? "Yazar bilgisi yok"}</p>
                    
                    <div className="mt-auto pt-3 relative z-10">
                       {hasConfiguredAsin(item.asin) ? (
                        <Link href={`/go/${item.id}`} className="inline-flex text-xs font-semibold text-slate-900 border-b border-slate-900 pb-0.5 hover:text-slate-600 hover:border-slate-600 transition-colors">
                          Amazon&apos;da Gör
                        </Link>
                      ) : (
                        <Link href={getListUrl(item.section?.list)} className="inline-flex text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">
                          Liste içinde gör &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
           </section>
        )}

        {/* 5. Experts */}
        {experts.length > 0 && (
          <section className="rounded-3xl bg-slate-900 p-8 sm:p-12 text-white">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Uzman Kadromuz</h2>
                <p className="mt-1 text-slate-400">Alanında yetkin isimlerin hazırladığı listeleri keşfedin.</p>
              </div>
            </div>
            <ul className="grid gap-8 sm:grid-cols-3 lg:grid-cols-5">
              {experts.map((expert) => (
                <li key={expert.id} className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-800 border-4 border-slate-700 text-2xl font-bold text-slate-300 shadow-inner">
                    {placeholderFromText(expert.name)}
                  </div>
                  <h3 className="mt-4 text-base font-bold text-white">{expert.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{expert.title ?? "Uzman"}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 6. Reading lists */}
        {latestReadingLists.length > 0 && (
           <section>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">En Yeni Okuma Listeleri</h2>
                <p className="mt-1 text-slate-500">Editörlerimizin özenle hazırladığı koleksiyonlar.</p>
              </div>
               <Link href="/lists" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Tüm Listeler &rarr;</Link>
            </div>
            <div className="space-y-8">
              {latestReadingLists.map((list) => (
                <article key={list.id} className="flex flex-col md:flex-row gap-6 md:gap-10 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                  <div className="md:w-1/3 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900">{list.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 flex-1">{list.summary}</p>
                    <Link href={getListUrl(list)} className="mt-6 inline-flex w-fit items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                      Listeyi İncele <span className="ml-1">&rarr;</span>
                    </Link>
                  </div>
                  <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-10">
                    <ol className="grid gap-4 sm:grid-cols-3">
                      {(list.sections[0]?.items ?? []).slice(0, 3).map((item, index) => (
                        <li key={item.id} className="relative group">
                          <div className="text-6xl font-black text-slate-50 absolute -top-4 -left-2 -z-10 group-hover:text-slate-100 transition-colors">
                            {index + 1}
                          </div>
                          <div className="pt-2 pl-2">
                            <p className="font-bold text-sm text-slate-900 line-clamp-2">{item.titleOverride ?? item.asin}</p>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.authorOverride ?? "Yazar bilgisi yok"}</p>
                            <div className="mt-3">
                               {hasConfiguredAsin(item.asin) ? (
                                <Link href={`/go/${item.id}`} className="text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors">
                                  Amazon&apos;da Gör
                                </Link>
                              ) : (
                                <Link href={getListUrl(list)} className="text-[10px] uppercase font-bold tracking-wider text-slate-500 hover:text-slate-900 transition-colors">
                                  LİSTE İÇİNDE GÖR
                                </Link>
                              )}
                            </div>
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
      </div>
    </main>
  );
}
