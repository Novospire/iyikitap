import { NextRequest, NextResponse } from "next/server";

const GOOGLE_BOOKS_ENDPOINT = "https://www.googleapis.com/books/v1/volumes";
const MAX_RESULTS_DEFAULT = 20;
const MAX_RESULTS_LIMIT = 20;

type GoogleBooksVolume = {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    publishedDate?: string;
    infoLink?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    industryIdentifiers?: Array<{
      type?: string;
      identifier?: string;
    }>;
  };
};

const normalizeVolume = (volume: GoogleBooksVolume) => {
  const info = volume.volumeInfo ?? {};
  const identifiers = info.industryIdentifiers ?? [];
  const isbn13 = identifiers.find((id) => id.type === "ISBN_13")?.identifier;

  return {
    title: info.title ?? "",
    authors: info.authors ?? [],
    publishedDate: info.publishedDate ?? "",
    thumbnail: info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail ?? "",
    isbn13: isbn13 ?? null,
    googleBooksId: volume.id,
    infoLink: info.infoLink ?? "",
  };
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  const rawMax = Number(searchParams.get("max"));
  const maxResults = Number.isFinite(rawMax)
    ? Math.min(Math.max(rawMax, 1), MAX_RESULTS_LIMIT)
    : MAX_RESULTS_DEFAULT;

  if (!query) {
    return NextResponse.json({ items: [] });
  }

  const endpoint = new URL(GOOGLE_BOOKS_ENDPOINT);
  endpoint.searchParams.set("q", query);
  endpoint.searchParams.set("maxResults", String(maxResults));
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY?.trim();

  if (apiKey) {
    endpoint.searchParams.set("key", apiKey);
  }

  const response = await fetch(endpoint.toString(), {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    let upstreamMessage = "Google Books request failed.";

    try {
      const upstreamPayload = (await response.json()) as {
        error?: {
          message?: string;
        };
      };

      if (upstreamPayload.error?.message) {
        upstreamMessage = upstreamPayload.error.message;
      }
    } catch {
      // Ignore JSON parsing failures and keep fallback message.
    }

    return NextResponse.json(
      {
        error: upstreamMessage,
        status: response.status,
        source: "google-books",
      },
      { status: response.status },
    );
  }

  const data = (await response.json()) as { items?: GoogleBooksVolume[] };
  const items = (data.items ?? []).map(normalizeVolume);

  return NextResponse.json({ items });
}
