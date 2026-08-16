"use client";

import { useId, useState } from "react";
import { Arrow } from "./ui";

export type FieldSpec = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  options?: string[];
  autoComplete?: string;
  half?: boolean;
};

type Props = {
  source: "contact" | "demo" | "beta" | "waitlist" | "newsletter" | "labs";
  fields: FieldSpec[];
  submitLabel: string;
  successTitle: string;
  successBody: string;
  dark?: boolean;
  className?: string;
};

type State = { status: "idle" | "sending" | "sent" | "error"; message?: string };

export default function Form({
  source,
  fields,
  submitLabel,
  successTitle,
  successBody,
  dark = false,
  className = "",
}: Props) {
  const uid = useId();
  const [state, setState] = useState<State>({ status: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const entries = Object.fromEntries(new FormData(form).entries());

    // Client-side validation first, so the common mistakes never round-trip.
    const missing = fields.find((f) => f.required && !String(entries[f.name] ?? "").trim());
    if (missing) {
      setState({ status: "error", message: `${missing.label} is required.` });
      form.querySelector<HTMLElement>(`[name="${missing.name}"]`)?.focus();
      return;
    }
    const email = String(entries.email ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setState({ status: "error", message: "Enter a valid email address." });
      form.querySelector<HTMLElement>('[name="email"]')?.focus();
      return;
    }

    setState({ status: "sending" });

    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...entries, source }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        setState({ status: "error", message: result.error ?? "Something went wrong. Please try again." });
        return;
      }
      form.reset();
      setState({ status: "sent" });
    } catch {
      setState({
        status: "error",
        message: "Something went wrong with the connection. Please try again, or email info@medirevs.com.",
      });
    }
  }

  const labelCls = `label mb-2 block ${dark ? "text-white/50" : "text-slate"}`;
  const fieldCls = `w-full rounded-sm border px-4 py-3.5 text-[0.9375rem] outline-none transition-colors ${
    dark
      ? "border-white/15 bg-white/[0.04] text-white placeholder:text-white/30 focus:border-brand-bright"
      : "border-line bg-white text-ink placeholder:text-mist focus:border-brand"
  }`;

  if (state.status === "sent") {
    return (
      <div
        className={`rounded-sm border p-10 ${dark ? "border-white/15 bg-white/[0.03]" : "border-line bg-paper"} ${className}`}
        role="status"
        aria-live="polite"
      >
        <div
          className="mb-6 flex h-11 w-11 items-center justify-center rounded-full border"
          style={{ borderColor: "var(--color-signal)", color: "var(--color-signal)" }}
          aria-hidden="true"
        >
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M1 6L6 11L15 1" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </div>
        <h3 className={`h3 mb-3 ${dark ? "text-white" : "text-ink"}`}>{successTitle}</h3>
        <p className={dark ? "text-white/60" : "text-charcoal"}>{successBody}</p>
        <button
          type="button"
          onClick={() => setState({ status: "idle" })}
          className={`label mt-8 underline underline-offset-4 ${dark ? "text-white/50" : "text-slate"}`}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={className}>
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const id = `${uid}-${field.name}`;
          return (
            <div key={field.name} className={field.half ? "sm:col-span-1" : "sm:col-span-2"}>
              <label htmlFor={id} className={labelCls}>
                {field.label}
                {!field.required && (
                  <span className={dark ? "text-white/25" : "text-mist"}> (optional)</span>
                )}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  id={id}
                  name={field.name}
                  rows={5}
                  required={field.required}
                  placeholder={field.placeholder}
                  className={`${fieldCls} resize-y`}
                />
              ) : field.type === "select" ? (
                <select id={id} name={field.name} required={field.required} className={fieldCls} defaultValue="">
                  <option value="" disabled>
                    Select…
                  </option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={id}
                  name={field.name}
                  type={field.type ?? "text"}
                  required={field.required}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  className={fieldCls}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Honeypot — hidden from users and from screen readers. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor={`${uid}-company_website`}>Company website</label>
        <input id={`${uid}-company_website`} name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && (
        <p className="mt-5 text-sm" role="alert" style={{ color: "#c0392b" }}>
          {state.message}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={state.status === "sending"}
          className={`group/btn inline-flex items-center gap-2.5 rounded-sm px-6 py-3.5 text-[0.9375rem] font-medium transition-colors disabled:opacity-55 ${
            dark ? "bg-white text-ink hover:bg-white/90" : "bg-brand text-white hover:bg-brand-dark"
          }`}
        >
          {state.status === "sending" ? "Sending…" : submitLabel}
          {state.status !== "sending" && <Arrow />}
        </button>
        <p className={`text-xs leading-relaxed ${dark ? "text-white/40" : "text-slate"}`}>
          We only use your details to reply to you.
        </p>
      </div>
    </form>
  );
}
