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

const schema = z.object({
  source: z.enum(["contact", "demo", "beta", "waitlist", "newsletter", "labs"]),
  email: z.string().trim().email("Enter a valid email address").max(180),
  name: z.string().trim().max(120).optional(),
  organisation: z.string().trim().max(160).optional(),
  role: z.string().trim().max(120).optional(),
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

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, timestamp: new Date().toISOString() }),
      signal: AbortSignal.timeout(10_000),
      redirect: "follow",
    });

    if (!response.ok) throw new Error(`Upstream responded ${response.status}`);
  } catch (error) {
    console.error("Form forwarding failed:", error);
    return NextResponse.json(
      { ok: false, error: "We could not send that. Please try again, or email info@medirevs.com." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
