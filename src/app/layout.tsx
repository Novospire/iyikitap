import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İyi Kitap | Listelerle Keşif",
  description: "Editoryal kürasyonla hazırlanmış kitap listeleri ve Amazon bağlantıları.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen antialiased">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
          <header className="flex items-center justify-between py-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
                İYİ KİTAP
              </p>
              <h1 className="text-2xl font-semibold text-ink">
                Listelerle okuma keşfi
              </h1>
            </div>
            <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
              <a href="#listeler" className="hover:text-ink">
                Listeler
              </a>
              <a href="#neden" className="hover:text-ink">
                Neden İyi Kitap?
              </a>
              <a href="#bulten" className="hover:text-ink">
                Bülten
              </a>
            </nav>
            <a
              href="#listeler"
              className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white shadow"
            >
              Amazon’da Gör
            </a>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200 py-8 text-sm text-slate-500">
            <p>
              Editoryal seçkilerimizdeki bağlantılar Amazon’a yönlendirir. Satış
              yok, yalnızca liste keşfi.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
