"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  name?: string;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
  autoComplete?: string;
  label?: string;
};

/**
 * Password input with a show / hide eye toggle. Client component so the toggle
 * can flip the input type without a round trip. Keeps the cream / serif styling
 * of the other auth inputs and stays keyboard and screen reader friendly.
 */
export function PasswordField({
  name = "password",
  required,
  minLength,
  placeholder = "At least 12 characters",
  autoComplete = "current-password",
  label = "Password",
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <label className="block text-sm font-semibold text-ink-900">
      {label}
      <div className="relative mt-2">
        <input
          required={required}
          minLength={minLength}
          type={show ? "text" : "password"}
          name={name}
          autoComplete={autoComplete}
          className="w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3 pr-12 font-serif"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          title={show ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex items-center rounded-r-2xl px-4 text-ink-700 transition hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/40"
        >
          {show ? (
            <EyeOff className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          ) : (
            <Eye className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          )}
        </button>
      </div>
    </label>
  );
}
