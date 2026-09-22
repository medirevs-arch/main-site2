"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { Arrow } from "./ui";

/**
 * The waitlist, everywhere.
 *
 * One email field and a button. Nothing else, because the ask has to cost the
 * visitor almost nothing — the EHR waitlist this replaces opened with five
 * fields including a "How do you keep records today?" textarea, which is an
 * interview rather than a signup.
 *
 * The optional questions come *after* the address is captured, on the success
 * panel, where answering them is a favour rather than a toll. That second
 * submission posts the same email again with the extra fields attached, so the
 * sheet should dedupe on email and keep the richer row.
 *
 * Posts to the same `/api/forms` route as every other form on the site, which
 * validates with Zod, screens the honeypot, rate-limits per IP and reports
 * upstream failure honestly.
 */

const ROLES = [
  "Patient or carer",
  "Doctor or clinician",
  "Clinic or hospital",
  "Pharmacy",
  "Laboratory",
  "Researcher",
  "Student",
  "Something else",
];

type Props = {
  /** For dark surfaces: bg-lab, bg-navy, the footer. */
  dark?: boolean;
  /** Drops the heading and sits tight under an article. */
  compact?: boolean;
  /** Sent through so we can tell later which placement actually converts. */
  placement?: string;
  className?: string;
};

type Status = "idle" | "sending" | "joined" | "complete" | "error";

export default function WaitlistInline({
  dark = false,
  compact = false,
  placement,
  className = "",
}: Props) {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const email = useRef("");

  const inputCls = `w-full rounded-sm border px-4 py-3.5 text-[0.9375rem] outline-none transition-colors ${
    dark
      ? "border-white/15 bg-white/[0.04] text-white placeholder:text-white/30 focus:border-brand-bright"
      : "border-line bg-white text-ink placeholder:text-mist focus:border-brand"
  }`;

  const buttonCls = `group/btn inline-flex shrink-0 items-center justify-center gap-2.5 rounded-sm px-6 py-3.5 text-[0.9375rem] font-medium transition-colors disabled:opacity-55 ${
    dark ? "bg-white text-ink hover:bg-white/90" : "bg-brand text-white hover:bg-brand-dark"
  }`;

  async function post(payload: Record<string, string>) {
    const response = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, source: "waitlist" }),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error ?? "Something went wrong. Please try again.");
    }
  }

  async function onJoin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const value = String(data.email ?? "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      form.querySelector<HTMLElement>('[name="email"]')?.focus();
      return;
    }

    setStatus("sending");
    try {
      await post({
        email: value,
        company_website: String(data.company_website ?? ""),
        ...(placement ? { product: placement } : {}),
      });
      email.current = value;
      setStatus("joined");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Please try again.");
    }
  }

  async function onDetails(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());

    setStatus("sending");
    try {
      await post({
        email: email.current,
        role: String(data.role ?? ""),
        country: String(data.country ?? ""),
        organisation: String(data.organisation ?? ""),
        ...(placement ? { product: placement } : {}),
      });
      setStatus("complete");
    } catch {
      // The address is already on the list, so a failure here is not worth
      // showing as an error. Close the panel and let them get on with it.
      setStatus("complete");
    }
  }

  /* ---------- Step two: you are in, tell us who you are ---------- */

  if (status === "joined" || status === "complete" || (status === "sending" && email.current)) {
    const done = status === "complete";

    return (
      <div
        className={`rounded-sm border p-7 sm:p-8 ${
          dark ? "border-white/15 bg-white/[0.03]" : "border-line bg-paper"
        } ${className}`}
        role="status"
        aria-live="polite"
      >
        <p className="label mb-4 flex items-center gap-3" style={{ color: "var(--color-signal)" }}>
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--color-signal)" }}
            aria-hidden="true"
          />
          You are on the list
        </p>

        <h3 className={`h3 mb-3 ${dark ? "text-white" : "text-ink"}`}>
          {done ? "Thank you. That helps." : "One optional question."}
        </h3>

        <p className={`text-[0.9375rem] leading-relaxed ${dark ? "text-white/60" : "text-charcoal"}`}>
          {done
            ? "We will email you before we open access, and no more than once a month in between."
            : "Telling us who you are means we open access to the right people first. Skip it if you would rather not."}
        </p>

        {!done && (
          <form onSubmit={onDetails} className="mt-7 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${uid}-role`} className={`label mb-2 block ${dark ? "text-white/50" : "text-slate"}`}>
                  You are a
                </label>
                <select id={`${uid}-role`} name="role" defaultValue="" className={inputCls}>
                  <option value="" disabled>
                    Select&hellip;
                  </option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor={`${uid}-country`}
                  className={`label mb-2 block ${dark ? "text-white/50" : "text-slate"}`}
                >
                  Country
                </label>
                <input
                  id={`${uid}-country`}
                  name="country"
                  autoComplete="country-name"
                  placeholder="Where you are"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor={`${uid}-organisation`}
                className={`label mb-2 block ${dark ? "text-white/50" : "text-slate"}`}
              >
                Where you work
                <span className={dark ? "text-white/25" : "text-mist"}> (optional)</span>
              </label>
              <input id={`${uid}-organisation`} name="organisation" className={inputCls} />
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-5">
              <button type="submit" disabled={status === "sending"} className={buttonCls}>
                {status === "sending" ? "Saving…" : "Save"}
                {status !== "sending" && <Arrow />}
              </button>
              <button
                type="button"
                onClick={() => setStatus("complete")}
                className={`label underline underline-offset-4 ${dark ? "text-white/50" : "text-slate"}`}
              >
                No thanks
              </button>
            </div>
          </form>
        )}

        {done && (
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              "Medirevs is building healthcare software for the way care actually works in Africa. I just joined their waitlist: https://www.medirevs.com/waitlist",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`group/link mt-7 inline-flex items-center gap-2.5 text-[0.9375rem] font-medium ${
              dark ? "text-white" : "text-brand-dark"
            }`}
          >
            <span className="relative">
              Send it to someone who needs it
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover/link:scale-x-100" />
            </span>
            <Arrow />
          </a>
        )}
      </div>
    );
  }

  /* ---------- Step one: the address, and nothing else ---------- */

  return (
    <div className={className}>
      {!compact && (
        <label htmlFor={`${uid}-email`} className={`label mb-3 block ${dark ? "text-white/50" : "text-slate"}`}>
          Email address
        </label>
      )}

      <form onSubmit={onJoin} noValidate>
        {compact && (
          <label htmlFor={`${uid}-email`} className="sr-only">
            Email address
          </label>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputCls}
          />

          {/* Honeypot — hidden from users and from assistive tech. */}
          <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
            <input name="company_website" tabIndex={-1} autoComplete="off" />
          </div>

          <button type="submit" disabled={status === "sending"} className={buttonCls}>
            {status === "sending" ? "Joining…" : "Join the waitlist"}
            {status !== "sending" && <Arrow />}
          </button>
        </div>

        {status === "error" && (
          <p className={`mt-3 text-sm ${dark ? "text-white/70" : ""}`} role="alert" style={dark ? undefined : { color: "#c0392b" }}>
            {message}
          </p>
        )}

        <p className={`mt-3 text-xs leading-relaxed ${dark ? "text-white/40" : "text-slate"}`}>
          Early access before we launch publicly, and at most one email a month. Nothing
          else. We handle your address as set out in our{" "}
          <Link
            href="/legal/privacy"
            className={`underline underline-offset-2 ${dark ? "hover:text-white/70" : "hover:text-ink"}`}
          >
            privacy notice
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
