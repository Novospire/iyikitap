export default function SignInPage() {
  return (
    <div className="mx-auto mt-20 max-w-xl rounded-3xl bg-white p-8 shadow-card">
      <h2 className="text-2xl font-semibold text-ink">Editoryal giriş</h2>
      <p className="mt-2 text-sm text-slate-600">
        Yönetim paneli için kimlik doğrulama.
      </p>
      <form className="mt-6 space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            E-posta
          </label>
          <input
            type="email"
            placeholder="editor@iyikitap.com"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Şifre
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>
        <button
          type="button"
          className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white"
        >
          Amazon’da Gör
        </button>
      </form>
    </div>
  );
}
