import Link from "next/link";
import { buttonVariants } from "@heroui/react";

/** Friendly empty / error / not-found panel. */
export default function StateMessage({ icon = "🧺", title, message, action, homeLink = false }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-line bg-surface px-6 py-12 text-center shadow-sm">
      <span className="text-6xl" aria-hidden="true">{icon}</span>
      <h2 className="mt-4 text-2xl font-bold leading-8">{title}</h2>
      {message && <p className="mt-2 text-ink/70">{message}</p>}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {action}
        {homeLink && (
          <Link href="/" className={buttonVariants({ variant: "primary", size: "lg" })}>
            হোম পেজে ফিরে যান
          </Link>
        )}
      </div>
    </div>
  );
}
