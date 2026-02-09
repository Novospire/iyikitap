"use client";

import { useMemo, useState } from "react";

type GoogleBooksItem = {
  title: string;
  authors: string[];
  publishedDate: string;
  thumbnail: string;
  isbn13: string | null;
  googleBooksId: string;
  infoLink: string;
};

type ImportClientProps = {
  section: {
    id: string;
    title: string;
    listTitle: string;
  } | null;
  requestedSectionId?: string | null;
};

export default function ImportClient({
  section,
  requestedSectionId,
}: ImportClientProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GoogleBooksItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingIds, setAddingIds] = useState<string[]>([]);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const sectionLabel = useMemo(() => {
    if (!section) return "";
    return `${section.listTitle} → ${section.title}`;
  }, [section]);

  const handleSearch = async () => {
    const trimmed = query.trim();

    if (!trimmed) {
      setError("Lütfen bir arama terimi girin.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/google-books?q=${encodeURIComponent(trimmed)}&max=20`,
      );
      const data = (await response.json()) as { items: GoogleBooksItem[] };
      setResults(data.items ?? []);
    } catch (err) {
      console.error(err);
      setError("Google Books sonuçları alınamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (item: GoogleBooksItem) => {
    if (!section) {
      setError("Hedef bölüm bulunamadı.");
      return;
    }

    setAddingIds((prev) => [...prev, item.googleBooksId]);
    setError(null);

    try {
      const response = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId: section.id,
          title: item.title,
          authors: item.authors,
          isbn13: item.isbn13,
          googleBooksId: item.googleBooksId,
          infoLink: item.infoLink,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Import başarısız.");
      }

      setAddedIds((prev) => [...prev, item.googleBooksId]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import başarısız.");
    } finally {
      setAddingIds((prev) => prev.filter((id) => id !== item.googleBooksId));
    }
  };

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Google Books Demo Import</h1>
        <p className="text-sm opacity-70">
          Arama yapıp sonuçları seçili liste bölümüne ekleyin.
        </p>
        {section ? (
          <div className="rounded-lg border px-4 py-3 text-sm">
            <div className="font-medium">Hedef bölüm</div>
            <div className="opacity-80">{sectionLabel}</div>
            {requestedSectionId ? (
              <div className="mt-1 text-xs opacity-60">
                sectionId parametresi kullanılıyor.
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Import için kullanılacak bir liste bölümü bulunamadı.
          </div>
        )}
      </header>

      <section className="rounded-2xl border p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <label className="flex flex-1 flex-col gap-2">
            <span className="text-sm font-medium">Arama sorgusu</span>
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="Örn: kişisel gelişim, teknoloji, roman"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            onClick={handleSearch}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? "Aranıyor..." : "Search"}
          </button>
        </div>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Sonuçlar</h2>
        {results.length === 0 ? (
          <p className="text-sm opacity-70">
            Henüz sonuç yok. Arama yaptıktan sonra listelenecek.
          </p>
        ) : (
          <ul className="space-y-3">
            {results.map((item) => {
              const isAdding = addingIds.includes(item.googleBooksId);
              const isAdded = addedIds.includes(item.googleBooksId);

              return (
                <li
                  key={item.googleBooksId}
                  className="flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center"
                >
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm opacity-70">
                      {item.authors?.length
                        ? item.authors.join(", ")
                        : "Yazar bilinmiyor"}
                    </div>
                    <div className="text-xs opacity-60">
                      {item.publishedDate || "Yayın tarihi yok"}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="h-16 w-12 rounded object-cover"
                      />
                    ) : null}
                    <button
                      className="rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-50"
                      type="button"
                      onClick={() => handleAdd(item)}
                      disabled={!section || isAdding || isAdded}
                    >
                      {isAdded
                        ? "Eklendi"
                        : isAdding
                          ? "Ekleniyor..."
                          : "Add to section"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
