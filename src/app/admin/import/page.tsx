import ImportClient from "./import-client";

type ImportPageProps = {
  searchParams?: { sectionId?: string };
};

function SetupRequired() {
  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Setup required</h1>
      <p className="mt-3 text-sm text-neutral-600">
        DATABASE_URL is not configured. This page needs a database connection.
      </p>
      <p className="mt-2 text-sm text-neutral-600">
        Add <code className="rounded bg-neutral-100 px-1">DATABASE_URL</code> to your environment
        variables (local .env, Vercel Preview/Production) and reload.
      </p>
    </div>
  );
}

export default async function ImportPage({ searchParams }: ImportPageProps) {
  // GUARD: env yoksa Prisma'ya dokunma
  if (!process.env.DATABASE_URL) {
    return <SetupRequired />;
  }

  // Env varsa Prisma'yı dinamik import et
  const { prisma } = await import("@/lib/prisma");

  const requestedSectionId = searchParams?.sectionId;

  const requestedSection = requestedSectionId
    ? await prisma.listSection.findUnique({
        where: { id: requestedSectionId },
        include: { list: true },
      })
    : null;

  const fallbackSection = !requestedSection
    ? await prisma.listSection.findFirst({
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        include: { list: true },
      })
    : null;

  const section = requestedSection ?? fallbackSection;

  const sectionPayload = section
    ? {
        id: section.id,
        title: section.title,
        listTitle: section.list.title,
      }
    : null;

  return (
    <ImportClient
      section={sectionPayload}
      requestedSectionId={requestedSectionId ?? null}
    />
  );
}
