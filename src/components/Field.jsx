import { useId } from "react";

/** Labelled text input with an inline, screen-reader-announced error. */
export default function Field({ label, error, type = "text", ...rest }) {
  const id = useId();
  const errId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
      <input
        id={id}
        type={type}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errId : undefined}
        className={`h-11 w-full rounded-lg border bg-base-100 px-3 outline-none transition focus:border-brand ${
          error ? "border-up" : "border-line"
        }`}
        {...rest}
      />
      {error && <p id={errId} role="alert" className="mt-1 text-sm text-up">{error}</p>}
    </div>
  );
}
