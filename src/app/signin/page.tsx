import SignInForm from "./signin-form";

type SignInPageProps = {
  searchParams?: { callbackUrl?: string };
};

export default function SignInPage({ searchParams }: SignInPageProps) {
  let callbackUrl = "/admin/import";
  const requestedUrl = searchParams?.callbackUrl;
  
  if (requestedUrl?.startsWith("/") && !requestedUrl.startsWith("//")) {
    callbackUrl = requestedUrl;
  }

  return (
    <div className="mx-auto mt-20 max-w-xl rounded-3xl bg-white p-8 shadow-card">
      <h2 className="text-2xl font-semibold text-ink">Editoryal giriş</h2>
      <p className="mt-2 text-sm text-slate-600">
        Yönetim paneli için kimlik doğrulama.
      </p>
      <SignInForm callbackUrl={callbackUrl} />
    </div>
  );
}
