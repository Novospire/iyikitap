import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type PatchPayload = {
  asin?: string;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!UUID_PATTERN.test(params.id)) {
    return NextResponse.json({ error: "Invalid list item id." }, { status: 400 });
  }

  const payload = (await request.json()) as PatchPayload;

  if (typeof payload?.asin !== "string") {
    return NextResponse.json({ error: "asin must be a string." }, { status: 400 });
  }

  const asin = payload.asin.trim();

  const existingItem = await prisma.listItem.findUnique({
    where: { id: params.id },
    select: { id: true },
  });

  if (!existingItem) {
    return NextResponse.json({ error: "List item not found." }, { status: 404 });
  }

  await prisma.listItem.update({
    where: { id: params.id },
    data: { asin },
  });

  return NextResponse.json({ ok: true });
}
