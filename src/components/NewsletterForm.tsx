"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Arrow } from "./ui";

export default function NewsletterForm() {
  const uid = useId();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const email = String(data.email ?? "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, email, source: "newsletter" }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        setStatus("error");
        setMessage(result.error ?? "Something went wrong. Please try again.");
        return;
      }
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <p className="flex items-center gap-3 text-[0.9375rem] text-white/80" role="status" aria-live="polite">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--color-signal)" }}
          aria-hidden="true"
        />
        You&rsquo;re subscribed. Thank you.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor={`${uid}-email`} className="label mb-3 block text-white/40">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-sm border border-white/15 bg-white/[0.04] px-4 py-3.5 text-[0.9375rem] text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-bright"
        />
        <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="group/btn inline-flex shrink-0 items-center justify-center gap-2.5 rounded-sm bg-white px-6 py-3.5 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-white/90 disabled:opacity-55"
        >
          {status === "sending" ? "Subscribing…" : "Subscribe"}
          {status !== "sending" && <Arrow />}
        </button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-white/40">
        One email now and then, and you can unsubscribe from any of them. We handle your
        address as set out in our{" "}
        <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-white/70">
          privacy notice
        </Link>
        .
      </p>

      {status === "error" && (
        <p className="mt-3 text-sm text-white/70" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
