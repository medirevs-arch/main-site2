import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Every form on the site posts here. The route validates, screens for bots,
 * then forwards server-side to the existing Medirevs Google Apps Script sheet.
 *
 * The previous site posted to the script directly from the browser with
 * `mode: "no-cors"`, which always resolves — so a failed submission still
 * showed the user a success message. Forwarding from the server lets us read
 * the real response and tell the user the truth.
 */

const ENDPOINT = process.env.MEDIREVS_FORMS_ENDPOINT;

/**
 * Optional second sink, tried only when the sheet has already failed every
 * attempt. Any URL that accepts a JSON POST works: a second Apps Script, a
 * Zapier or Make hook, a Slack incoming webhook. Set it and a Google outage
 * stops costing us signups.
 */
const BACKUP_ENDPOINT = process.env.MEDIREVS_FORMS_BACKUP_ENDPOINT;

/**
 * The sheet is a single point of failure, and since the waitlist became the
 * site's primary call to action a dropped submission is a lost signup rather
 * than a lost enquiry. Most failures are transient — an Apps Script cold
 * start, a timeout, a brief Google blip — so retry before giving up.
 *
 * Two attempts, ~600ms apart. Deliberately short: the visitor is watching a
 * spinner, and a signup form that hangs for ten seconds loses more people
 * than the retry saves.
 */
const MAX_ATTEMPTS = 2;
const RETRY_DELAY_MS = 600;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function forward(url: string, payload: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10_000),
    redirect: "follow",
  });

  if (!response.ok) throw new Error(`Upstream responded ${response.status}`);
}

const schema = z.object({
  source: z.enum(["contact", "demo", "beta", "waitlist", "newsletter", "labs"]),
  email: z.string().trim().email("Enter a valid email address").max(180),
  name: z.string().trim().max(120).optional(),
  organisation: z.string().trim().max(160).optional(),
  role: z.string().trim().max(120).optional(),
  country: z.string().trim().max(80).optional(),
  phone: z.string().trim().max(40).optional(),
  product: z.string().trim().max(80).optional(),
  message: z.string().trim().max(4000).optional(),
  // Honeypot: a real user never fills this, it is hidden from view and from
  // assistive tech. Anything non-empty is dropped as spam.
  company_website: z.string().max(200).optional(),
});

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    if (hits.size > 5000) {
      for (const [key, value] of hits) if (now > value.resetAt) hits.delete(key);
    }
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "That is a lot of submissions. Please try again in a minute." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: first?.message ?? "Please check the form and try again.", field: first?.path[0] },
      { status: 422 },
    );
  }

  const { company_website, ...data } = parsed.data;

  // Silently accept and discard bot submissions.
  if (company_website) return NextResponse.json({ ok: true });

  if (!ENDPOINT) {
    console.error("MEDIREVS_FORMS_ENDPOINT is not configured; submission dropped.");
    return NextResponse.json(
      { ok: false, error: "We cannot take submissions right now. Please email info@medirevs.com." },
      { status: 503 },
    );
  }

  const submission = { ...data, timestamp: new Date().toISOString() };
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      await forward(ENDPOINT, submission);
      return NextResponse.json({ ok: true });
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) await sleep(RETRY_DELAY_MS);
    }
  }

  console.error(`Form forwarding failed after ${MAX_ATTEMPTS} attempts:`, lastError);

  // The sheet is unreachable. Try the backup sink before telling anyone bad news.
  if (BACKUP_ENDPOINT) {
    try {
      await forward(BACKUP_ENDPOINT, { ...submission, viaBackup: true });
      console.warn("Form captured by backup endpoint after sheet failure.");
      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("Backup endpoint also failed:", error);
    }
  }

  // Last resort: emit the submission as one structured line so it survives in
  // the platform logs and can be replayed by hand. This is recovery, not
  // storage — it is not a substitute for a real durable sink, and it is why
  // the visitor is still told the truth rather than shown a success screen.
  console.error(
    "FORM_SUBMISSION_UNSAVED",
    JSON.stringify({ ...submission, recoveredFrom: "logs" }),
  );

  return NextResponse.json(
    { ok: false, error: "We could not send that. Please try again, or email info@medirevs.com." },
    { status: 502 },
  );
}
