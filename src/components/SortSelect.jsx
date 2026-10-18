"use client";

import { SORT_OPTIONS } from "@/lib/api";

export default function SortSelect({ value, onChange, id = "sort" }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm font-medium">সাজান</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="d-select d-select-bordered h-10 min-w-48 rounded-lg border-line bg-base-100"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
