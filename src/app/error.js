"use client";

import { Button } from "@heroui/react";
import StateMessage from "@/components/StateMessage";

export default function Error({ error, reset }) {
  return (
    <StateMessage
      icon="⚠️"
      title="কিছু একটা ভুল হয়েছে"
      message="পেজটি লোড করা যায়নি। আবার চেষ্টা করুন।"
      action={<Button variant="primary" size="lg" onPress={reset}>আবার চেষ্টা করুন</Button>}
      homeLink
    />
  );
}
