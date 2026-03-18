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

type SectionItem = {
  id: string;
  asin: string;
  titleOverride: string | null;
  authorOverride: string | null;
};

type ImportClientProps = {
  section: {
    id: string;
    title: string;
    listTitle: string;
  } | null;
  sectionItems: SectionItem[];
  requestedSectionId?: string | null;
};

type SaveStatus = {
  type: "saved" | "error";
  message: string;
};

export default function ImportClient({
  section,
  sectionItems,
  requestedSectionId,
}: ImportClientProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GoogleBooksItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingIds, setAddingIds] = useState<string[]>([]);
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [saveStatusById, setSaveStatusById] = useState<Record<string, SaveStatus>>({});
  const [asinById, setAsinById] = useState<Record<string, string>>(() => {
    return Object.fromEntries(sectionItems.map((item) => [item.id, item.asin ?? ""]));
  });
  const [currentAsinById, setCurrentAsinById] = useState<Record<string, string>>(() => {
    return Object.fromEntries(sectionItems.map((item) => [item.id, item.asin ?? ""]));
  });

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
          coverImageUrl: item.thumbnail || null,
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

  const handleAsinChange = (itemId: string, value: string) => {
    setAsinById((prev) => ({ ...prev, [itemId]: value }));
    setSaveStatusById((prev) => {
      if (!prev[itemId]) return prev;
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const handleAsinSave = async (itemId: string) => {
    const asin = (asinById[itemId] ?? "").trim();

    setSavingIds((prev) => [...prev, itemId]);
    setSaveStatusById((prev) => {
      if (!prev[itemId]) return prev;
      const next = { ...prev };
      delete next[itemId];
      return next;
    });

    try {
      const response = await fetch(`/api/admin/list-items/${itemId}/asin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asin }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "ASIN güncellenemedi.");
      }

      setCurrentAsinById((prev) => ({ ...prev, [itemId]: asin }));
      setAsinById((prev) => ({ ...prev, [itemId]: asin }));
      setSaveStatusById((prev) => ({
        ...prev,
        [itemId]: { type: "saved", message: "Saved" },
      }));
    } catch (err) {
      setSaveStatusById((prev) => ({
        ...prev,
        [itemId]: {
          type: "error",
          message: err instanceof Error ? err.message : "ASIN güncellenemedi.",
        },
      }));
    } finally {
      setSavingIds((prev) => prev.filter((id) => id !== itemId));
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

      <section className="space-y-4 rounded-2xl border p-4">
        <h2 className="text-lg font-semibold">Bölümdeki kitaplar</h2>
        {!section ? (
          <p className="text-sm text-red-700">
            Seçili bölüm bulunamadı, bu yüzden ASIN düzenlenemiyor.
          </p>
        ) : sectionItems.length === 0 ? (
          <p className="text-sm opacity-70">Bu bölümde henüz öğe yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-2 py-2">Title</th>
                  <th className="px-2 py-2">Author</th>
                  <th className="px-2 py-2">Current ASIN</th>
                  <th className="px-2 py-2">Edit ASIN</th>
                  <th className="px-2 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {sectionItems.map((item) => {
                  const isSaving = savingIds.includes(item.id);
                  const status = saveStatusById[item.id];

                  return (
                    <tr key={item.id} className="border-b align-top">
                      <td className="px-2 py-3">{item.titleOverride?.trim() || "—"}</td>
                      <td className="px-2 py-3">{item.authorOverride?.trim() || "—"}</td>
                      <td className="px-2 py-3">{currentAsinById[item.id]?.trim() || "—"}</td>
                      <td className="px-2 py-3">
                        <input
                          className="w-52 rounded border px-2 py-1"
                          value={asinById[item.id] ?? ""}
                          onChange={(event) => handleAsinChange(item.id, event.target.value)}
                          placeholder="ASIN"
                        />
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex flex-col items-start gap-1">
                          <button
                            className="rounded-lg border px-3 py-1.5 text-sm font-medium disabled:opacity-50"
                            type="button"
                            disabled={isSaving}
                            onClick={() => handleAsinSave(item.id)}
                          >
                            {isSaving ? "Saving..." : "Save"}
                          </button>
                          {status ? (
                            <span
                              className={
                                status.type === "saved"
                                  ? "text-xs text-green-700"
                                  : "text-xs text-red-600"
                              }
                            >
                              {status.message}
                            </span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
