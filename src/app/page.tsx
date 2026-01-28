import { lists } from "@/lib/data";

export default function HomePage() {
  return (
    <div className="space-y-20 pb-20">
      <section className="grid gap-10 rounded-3xl bg-white p-10 shadow-card md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
            Editoryal liste merkezi
          </p>
          <h2 className="text-4xl font-semibold text-ink">
            Kitapları değil, listeleri keşfedin.
          </h2>
          <p className="text-lg text-slate-600">
            İyi Kitap, her biri beşer kitaplık bölümlerden oluşan tematik
            listelerle okuma yolculuğunuza yön verir. Satış yok, yalnızca editoryal
            kürasyon ve Amazon bağlantıları.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#listeler"
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white"
            >
              Amazon’da Gör
            </a>
            <a
              href="#neden"
              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700"
            >
              Neden liste odaklı?
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
            Haftanın özeti
          </p>
          <ul className="mt-6 space-y-4 text-slate-700">
            <li className="rounded-xl bg-white p-4 shadow-sm">
              2 ana liste, 4 bölüm, toplam 20 kitap.
            </li>
            <li className="rounded-xl bg-white p-4 shadow-sm">
              Her bölümde tam 5 kitap; hızlı karşılaştırma için ideal.
            </li>
            <li className="rounded-xl bg-white p-4 shadow-sm">
              Tüm çağrılar Amazon’a yönlendiren “Amazon’da Gör”.
            </li>
          </ul>
        </div>
      </section>

      <section id="listeler" className="space-y-10">
        <div className="space-y-3">
          <h3 className="text-3xl font-semibold text-ink">Öne çıkan listeler</h3>
          <p className="text-slate-600">
            Her liste, içerideki bölümlerle bir yol haritası sunar. Bölümlerin
            hepsi beş kitapla sınırlı, böylece hızlıca karar verebilirsiniz.
          </p>
        </div>
        <div className="space-y-12">
          {lists.map((list) => (
            <article
              key={list.title}
              className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
            >
              <header className="flex flex-col gap-6 border-b border-slate-100 pb-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
                    {list.theme}
                  </p>
                  <h4 className="mt-2 text-2xl font-semibold text-ink">
                    {list.title}
                  </h4>
                  <p className="mt-3 text-slate-600">{list.summary}</p>
                </div>
                <a
                  href="#listeler"
                  className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white"
                >
                  Amazon’da Gör
                </a>
              </header>
              <div className="mt-8 grid gap-8 lg:grid-cols-2">
                {list.sections.map((section) => (
                  <section
                    key={section.title}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h5 className="text-lg font-semibold text-ink">
                          {section.title}
                        </h5>
                        <p className="mt-2 text-sm text-slate-600">
                          {section.description}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
                        5 kitap
                      </span>
                    </div>
                    <ul className="mt-6 space-y-4">
                      {section.books.map((book) => (
                        <li
                          key={book.title}
                          className="rounded-xl border border-slate-100 bg-white p-4"
                        >
                          <div className="flex flex-col gap-3">
                            <div>
                              <p className="text-sm font-semibold text-ink">
                                {book.title}
                              </p>
                              <p className="text-xs text-slate-500">
                                {book.author}
                              </p>
                              <p className="mt-2 text-sm text-slate-600">
                                {book.description}
                              </p>
                            </div>
                            <a
                              href={book.amazonUrl}
                              className="inline-flex w-fit rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white"
                            >
                              Amazon’da Gör
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="neden" className="grid gap-8 rounded-3xl bg-white p-10 shadow-card md:grid-cols-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
            Neden listeler?
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-ink">
            Keşif odaklı editoryal yaklaşım
          </h3>
        </div>
        <div className="space-y-4 text-slate-600 md:col-span-2">
          <p>
            Listelerimiz kitapları tek tek satmak için değil, ihtiyaçlarınıza uygun
            kombinasyonları hızlıca görmeniz için hazırlanır. Her bölüm beş kitapla
            sınırlıdır.
          </p>
          <p>
            Her karttaki “Amazon’da Gör” çağrısı, detaylara hızlıca geçmenizi
            sağlar. Böylece karar süreciniz kısalır, odak artar.
          </p>
        </div>
      </section>

      <section id="bulten" className="rounded-3xl bg-ink p-10 text-white">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Yeni listelerden haberdar olun</h3>
            <p className="text-sm text-slate-200">
              Haftalık listeler, bölüm notları ve seçili Amazon bağlantıları için
              bültene katılın.
            </p>
          </div>
          <form className="flex flex-col gap-3 rounded-2xl bg-white/10 p-4">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-slate-200"
            />
            <button
              type="button"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink"
            >
              Amazon’da Gör
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
