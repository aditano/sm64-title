import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-sky px-6 select-text">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: "url(/textures/castle-backdrop.jpg)" }}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-sm rounded-[22px] border-4 border-gold-deep bg-wood-deep/90 p-6 text-cream shadow-[0_12px_0_#2a1408]">
        <h1 className="font-display text-center text-3xl tracking-wide text-gold">File Select</h1>
        <p className="mt-1 text-center text-sm text-cream/75">Sign in to save your stretched faces.</p>
        <div className="mt-5 space-y-2">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="w-full rounded-xl border-2 border-gold/70 bg-plaque px-4 py-3 font-display text-lg tracking-wide text-cream shadow-[0_3px_0_#3d2110] hover:bg-wood focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                Continue with {p.label}
              </button>
            ))
          ) : (
            <p className="text-center text-sm text-cream/70">Sign-in is disabled.</p>
          )}
        </div>
        <Link
          to="/"
          className="mt-5 block text-center font-display text-sm tracking-wider text-menu hover:text-select focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Back to the courtyard
        </Link>
      </div>
    </main>
  );
}
