import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type ImportPayload = {
  sectionId: string;
  title: string;
  authors?: string[];
  isbn13?: string | null;
  googleBooksId?: string;
  infoLink?: string;
};

const resolveAsin = (payload: ImportPayload) => {
  if (payload.isbn13) return payload.isbn13;
  if (payload.googleBooksId) return payload.googleBooksId;
  return null;
};

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as ImportPayload;

  if (!payload?.sectionId || !payload?.title) {
    return NextResponse.json(
      { error: "Missing required import fields." },
      { status: 400 },
    );
  }

  const asin = resolveAsin(payload);

  if (!asin) {
    return NextResponse.json(
      { error: "No ISBN13 or Google Books ID provided." },
      { status: 400 },
    );
  }

  const section = await prisma.listSection.findUnique({
    where: { id: payload.sectionId },
  });

  if (!section) {
    return NextResponse.json(
      { error: "Target list section not found." },
      { status: 404 },
    );
  }

  const maxOrder = await prisma.listItem.aggregate({
    where: { sectionId: payload.sectionId },
    _max: { order: true },
  });

  const nextOrder = (maxOrder._max.order ?? 0) + 1;
  const authorOverride = payload.authors?.length
    ? payload.authors.join(", ")
    : undefined;

  const item = await prisma.listItem.create({
    data: {
      asin,
      titleOverride: payload.title,
      authorOverride,
      sectionId: payload.sectionId,
      order: nextOrder,
    },
  });

  return NextResponse.json({ item });
}
