// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <section className="rounded-3xl bg-white p-10 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          İyi Kitap
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
          Listelerle okuma keşfi
        </h1>
        <p className="mt-4 max-w-prose text-slate-600">
          Kategorilere göre hazırlanmış listelerden seç, keşfet, satın almaya git.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/lists"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Listeleri keşfet
          </Link>
          <Link
            href="/neden"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900"
          >
            Neden İyi Kitap?
          </Link>
        </div>
      </section>
    </main>
  );
}
