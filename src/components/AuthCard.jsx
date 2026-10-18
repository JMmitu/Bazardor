import Link from "next/link";

export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="text-center text-3xl font-bold leading-10">{title}</h1>
      <p className="mt-1 text-center text-ink/70">{subtitle}</p>
      <div className="mt-6 space-y-5 rounded-2xl border border-line bg-surface p-6 shadow-sm">{children}</div>
      <p className="mt-6 text-center">
        <Link href="/" className="text-sm text-brand hover:text-brand-deep">← হোম পেজে ফিরে যান</Link>
      </p>
    </div>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3 text-sm text-ink/60" role="separator">
      <span className="h-px flex-1 bg-line" />অথবা<span className="h-px flex-1 bg-line" />
    </div>
  );
}
