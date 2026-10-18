"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const PROVIDERS = [
  { id: "google", label: "Google" },
  { id: "github", label: "GitHub" },
];

/** `enabled` lists providers that have credentials configured on the server. */
export default function SocialButtons({ callbackUrl, enabled = [] }) {
  const [busy, setBusy] = useState(null);

  async function go(provider) {
    setBusy(provider);
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: callbackUrl,
      errorCallbackURL: "/signin",
    });
    // On success the browser is redirected to the provider, so we only get here on failure.
    if (error) {
      toast.error("সোশ্যাল লগইন শুরু করা যায়নি। আবার চেষ্টা করুন।");
      setBusy(null);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {PROVIDERS.map((p) => {
        const ready = enabled.includes(p.id);
        return (
          <Button
            key={p.id}
            variant="outline"
            size="lg"
            isDisabled={!ready || busy !== null}
            onPress={() => go(p.id)}
          >
            {busy === p.id ? "অপেক্ষা করুন…" : p.label}
          </Button>
        );
      })}
      {enabled.length < PROVIDERS.length && (
        <p className="col-span-2 text-center text-xs text-ink/60">
          যে সোশ্যাল লগইন সেট করা হয়নি তা বন্ধ দেখানো হচ্ছে।
        </p>
      )}
    </div>
  );
}
