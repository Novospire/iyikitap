import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İYİKİTAP | Editoryal Kitap Keşfi",
  description:
    "Uzmanların ve editörlerin hazırladığı özenli kitap listeleriyle okuma keşfi. Amazon bağlantılı editoryal kürasyon.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen antialiased bg-white text-ink">
        {/* ─── 1. Top utility bar ─── */}
        <div className="w-full border-b border-zinc-gray bg-white">
          <div className="mx-auto flex max-w-editorial items-center justify-between px-6 py-2">
            {/* Left: hamburger + nav links */}
            <div className="flex items-center gap-5 text-[11px] font-bold uppercase tracking-widest text-ink">
              <button
                className="flex items-center hover:text-sterling transition-colors focus:outline-none"
                aria-label="Menü"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <a
                href="#"
                className="hidden sm:inline-block hover:text-sterling transition-colors"
              >
                Dergi
              </a>
              <a
                href="#"
                className="hidden sm:inline-block hover:text-sterling transition-colors"
              >
                Radyo
              </a>
              <a
                href="#"
                className="hidden sm:inline-block hover:text-sterling transition-colors"
              >
                Mağaza
              </a>
            </div>
            {/* Right: search, login, subscribe, cart */}
            <div className="flex items-center gap-5 text-[11px] font-bold uppercase tracking-widest text-ink">
              <button
                className="flex items-center hover:text-sterling transition-colors focus:outline-none"
                aria-label="Arama"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
              <a
                href="/signin"
                className="hidden sm:inline-block hover:text-sterling transition-colors"
              >
                Giriş
              </a>
              <a
                href="#"
                className="inline-block bg-editorial-yellow text-ink px-4 py-1 font-bold hover:opacity-80 transition-opacity"
                style={{ borderRadius: 0 }}
              >
                Abone Ol
              </a>
              <button
                className="flex items-center hover:text-sterling transition-colors focus:outline-none"
                aria-label="Sepet"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                >
                  <path d="M6 2 3 6v14h18V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ─── 2. Masthead ─── */}
        <header className="w-full bg-white">
          <div className="mx-auto max-w-editorial px-6 py-8 md:py-12">
            <div className="flex flex-col md:flex-row items-center justify-between">
              {/* Left: Editorial note */}
              <div className="w-full md:w-48 mb-6 md:mb-0 flex justify-center md:justify-start text-center md:text-left">
                <div className="flex flex-col items-center md:items-start w-full max-w-[160px]">
                  <svg
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    className="mb-2 text-ink"
                  >
                    <path d="M4 19.5v-15h12.5v15H4z" />
                    <path d="M16.5 4.5 20 8v11.5" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink mb-0.5">
                    Mayıs 2026
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-sterling">
                    Editoryal
                    <br />
                    Seçkiler
                  </span>
                </div>
              </div>

              {/* Center: Logo image + tagline */}
              <div className="flex flex-col items-center text-center px-4">
                <a href="/" className="inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/brand/iyikitap-logo.png"
                    alt="İYİKİTAP"
                    className="h-14 sm:h-20 md:h-24 w-auto"
                  />
                </a>
                <p className="mt-3 text-[11px] font-serif text-sterling tracking-widest uppercase leading-relaxed">
                  &ldquo;Hayat kötü bir kitabı
                  <br />
                  okumak için çok kısa&rdquo;
                </p>
              </div>

              {/* Right: Author of the month */}
              <div className="w-full md:w-48 mt-6 md:mt-0 flex justify-center md:justify-end">
                <div className="flex items-center gap-3 w-full max-w-[170px]">
                  <div className="h-[56px] w-[56px] bg-white border border-zinc-gray flex items-center justify-center shrink-0">
                    <span className="text-lg font-serif font-bold text-zinc-gray">
                      JJ
                    </span>
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-sterling mb-0.5 border-b border-zinc-gray pb-0.5 w-full">
                      Ayın Yazarı
                    </span>
                    <span className="text-sm font-serif font-bold text-ink">
                      James Joyce
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Thin divider under masthead */}
          <div className="border-b border-zinc-gray" />
        </header>

        {/* ─── Content ─── */}
        <div className="mx-auto min-h-screen w-full max-w-editorial">
          <main>{children}</main>

          <footer className="border-t border-zinc-gray py-10 mt-12 text-center text-[10px] uppercase tracking-widest font-bold text-sterling px-6">
            <p className="text-ink">İYİKİTAP © {new Date().getFullYear()}</p>
            <p className="mt-2">Bağımsız Editoryal Keşifler</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
