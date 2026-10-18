"use client";

import { useSyncExternalStore } from "react";
import { formatBengaliDate } from "@/lib/format";

const subscribe = () => () => {};

/** Renders today's date in Bengali. The server snapshot is empty, so the
 *  server-built HTML never carries a stale date; the client fills it in. */
export default function BengaliDate({ className = "" }) {
  const label = useSyncExternalStore(subscribe, () => formatBengaliDate(), () => "");
  return <time className={className}>{label || "\u00a0"}</time>;
}
