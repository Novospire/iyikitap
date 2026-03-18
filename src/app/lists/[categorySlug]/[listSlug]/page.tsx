import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

const ASIN_PATTERN = /^[A-Z0-9]{10}$/;

const hasConfiguredAsin = (asin: string | null | undefined) =>
  Boolean(asin?.trim()) && ASIN_PATTERN.test(asin.trim().toUpperCase());

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
                  {hasConfiguredAsin(it.asin) ? (
                    <Link href={`/go/${it.id}`} className="mt-2 inline-block underline">
                      Amazon&apos;da Gör
                    </Link>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">Link not configured</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
