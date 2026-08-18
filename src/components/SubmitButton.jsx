"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children, className = "", variant = "primary" }) {
  const { pending } = useFormStatus();

  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700",
    outline: "border border-ink-200 text-ink-700 hover:bg-ink-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button type="submit" disabled={pending} className={`${base} ${variants[variant]} ${className}`}>
      {pending ? "Menyimpan..." : children}
    </button>
  );
}
