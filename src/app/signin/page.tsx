import SignInForm from "./signin-form";

export default function SignInPage() {
  return (
    <div className="mx-auto mt-20 max-w-xl rounded-3xl bg-white p-8 shadow-card">
      <h2 className="text-2xl font-semibold text-ink">Editoryal giriş</h2>
      <p className="mt-2 text-sm text-slate-600">
        Yönetim paneli için kimlik doğrulama.
      </p>
      <SignInForm />
    </div>
  );
}
