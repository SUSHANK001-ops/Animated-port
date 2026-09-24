"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Github, ShieldCheck, Loader2 } from "lucide-react";

const GoogleGlyph = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M21.35 11.1H12v3.83h5.35c-.23 1.4-1.62 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 7.1 12 7.1c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.7 4.5 14.6 3.6 12 3.6 6.98 3.6 2.9 7.68 2.9 12.7s4.08 9.1 9.1 9.1c5.25 0 8.72-3.69 8.72-8.88 0-.6-.07-1.05-.15-1.5Z"
    />
  </svg>
);

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAdmin = Boolean(session?.user?.isAdmin);

  // Admins go straight in; signed-in non-admins get a clear "no access" note.
  useEffect(() => {
    if (isAdmin) router.replace("/admin/dashboard");
  }, [isAdmin, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1A1A1A] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <div className="mb-2 flex items-center justify-center gap-2 text-[#00ff88]">
          <ShieldCheck size={22} />
        </div>
        <h1 className="mb-2 text-center text-2xl font-bold text-white">Admin Access</h1>
        <p className="mb-8 text-center text-sm text-white/50">
          Sign in with an authorized account to manage the site.
        </p>

        {status === "loading" ? (
          <div className="flex items-center justify-center gap-2 text-white/50">
            <Loader2 size={16} className="animate-spin" /> Checking session…
          </div>
        ) : session?.user && !isAdmin ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-300">
            You&apos;re signed in as {session.user.email}, which doesn&apos;t have admin access.
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => signIn("google", { callbackUrl: "/admin/dashboard" })}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm text-white transition-colors hover:border-[#00ff88]/50"
            >
              <GoogleGlyph /> Continue with Google
            </button>
            <button
              onClick={() => signIn("github", { callbackUrl: "/admin/dashboard" })}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm text-white transition-colors hover:border-[#00ff88]/50"
            >
              <Github size={16} /> Continue with GitHub
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
