import { prisma } from "@/lib/prisma";

import ImportClient from "./import-client";

type ImportPageProps = {
  searchParams?: { sectionId?: string };
};

export default async function ImportPage({ searchParams }: ImportPageProps) {
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
