import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      sections: { include: { items: true } },
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
                  <a
                    className="mt-2 inline-block underline"
                    href={`https://www.amazon.com.tr/dp/${it.asin}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Amazon&apos;da gör
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
