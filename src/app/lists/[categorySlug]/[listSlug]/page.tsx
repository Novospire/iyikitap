import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

const GOOGLE_BOOKS_ENDPOINT = "https://www.googleapis.com/books/v1/volumes";
const ISBN_13_REGEX = /^\\d{13}$/;

export default async function Page({
  params,
}: {
  params: { categorySlug: string; listSlug: string };
}) {
  const list = await prisma.list.findFirst({
    where: {
      slug: params.listSlug,
      categories: {
        some: { category: { slug: params.categorySlug } },
      },
    },
    include: {
      expert: true,
      categories: { include: { category: true } },
      sections: { include: { items: { orderBy: { order: "asc" } } } },
    },
  });

  if (!list) return notFound();

  const itemsForLookup = Array.from(
    new Set(
      list.sections
        .flatMap((section) => section.items)
        .map((item) => item.asin.trim())
        .filter(
          (asin) => asin && (ISBN_13_REGEX.test(asin) || asin.length !== 10),
        ),
    ),
  );

  const googleInfoEntries = await Promise.all(
    itemsForLookup.map(async (asin) => {
      try {
        const url = new URL(GOOGLE_BOOKS_ENDPOINT);

        if (ISBN_13_REGEX.test(asin)) {
          url.searchParams.set("q", `isbn:${asin}`);
        } else {
          url.pathname = `${url.pathname}/${asin}`;
        }

        const response = await fetch(url.toString(), { next: { revalidate: 60 } });

        if (!response.ok) return [asin, null] as const;

        const data = (await response.json()) as {
          items?: Array<{ volumeInfo?: { infoLink?: string } }>;
          volumeInfo?: { infoLink?: string };
        };

        const infoLink =
          data.volumeInfo?.infoLink ?? data.items?.[0]?.volumeInfo?.infoLink ?? null;

        return [asin, infoLink] as const;
      } catch (error) {
        console.error("Failed to fetch Google Books info link", error);
        return [asin, null] as const;
      }
    }),
  );

  const googleInfoLinks = new Map(
    googleInfoEntries.filter(([, infoLink]) => Boolean(infoLink)),
  );

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold">{list.title}</h1>
      <p className="mt-2 opacity-80">{list.summary}</p>

      <div className="mt-4 text-sm opacity-70">
        Kategori: {list.categories[0]?.category?.name ?? "-"}
        {list.expert ? <> • Uzman: {list.expert.name}</> : null}
      </div>

      <div className="mt-8 space-y-10">
        {list.sections.map((sec) => (
          <section key={sec.id}>
            <h2 className="text-xl font-semibold">{sec.title}</h2>
            <ul className="mt-3 space-y-2">
              {sec.items.map((it) => (
                <li key={it.id} className="rounded-xl border p-4">
                  <div className="font-medium">{it.titleOverride ?? it.asin}</div>
                  <a
                    className="mt-2 inline-block underline"
                    href={
                      (it as { infoLink?: string | null }).infoLink ??
                      googleInfoLinks.get(it.asin) ??
                      `https://www.amazon.com.tr/dp/${it.asin}`
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    Detay
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
