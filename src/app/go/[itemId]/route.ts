import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const ASIN_PATTERN = /^[A-Z0-9]{10}$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const buildAmazonUrl = (asin: string, associateTag: string) => {
  const url = new URL(`https://www.amazon.com.tr/dp/${asin}`);
  url.searchParams.set("tag", associateTag);
  return url;
};

export async function GET(
  _request: Request,
  { params }: { params: { itemId: string } },
) {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  const associateTag = process.env.AMAZON_ASSOCIATE_TAG?.trim();

  if (!databaseUrl) {
    return new NextResponse("Setup required: DATABASE_URL is not configured.", {
      status: 503,
    });
  }

  if (!associateTag) {
    return new NextResponse("Setup required: AMAZON_ASSOCIATE_TAG is not configured.", {
      status: 503,
    });
  }

  if (!UUID_PATTERN.test(params.itemId)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const item = await prisma.listItem.findUnique({
    where: { id: params.itemId },
    select: { asin: true },
  });

  if (!item) {
    return new NextResponse("Not found", { status: 404 });
  }

  const asin = item.asin?.trim().toUpperCase();

  if (!asin || !ASIN_PATTERN.test(asin)) {
    return new NextResponse("Link not configured.", { status: 400 });
  }

  return NextResponse.redirect(buildAmazonUrl(asin, associateTag), 302);
}
