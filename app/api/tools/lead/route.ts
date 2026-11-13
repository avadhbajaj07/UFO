import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { CONTENT } from "@/lib/tools/content";
import { TOOL_IDS, isLocale, type Locale, type ToolId } from "@/lib/tools/config";
import { site } from "@/lib/site";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

const COPY: Record<Locale, { subject: (t: string) => string; hi: string; foot: string; disc: string }> = {
  en: { subject: (t) => `Your result: ${t}`, hi: "Here is your result:", foot: "You received this because you requested it on our website.", disc: "General information only, not medical advice." },
  fr: { subject: (t) => `Votre résultat : ${t}`, hi: "Voici votre résultat :", foot: "Vous recevez cet e-mail car vous l’avez demandé sur notre site.", disc: "Informations générales, elles ne remplacent pas un avis médical." },
  de: { subject: (t) => `Dein Ergebnis: ${t}`, hi: "Hier ist dein Ergebnis:", foot: "Du erhältst diese E-Mail, weil du sie auf unserer Website angefordert hast.", disc: "Allgemeine Informationen, kein Ersatz für medizinischen Rat." },
};

// Best-effort, in-memory rate limit (per server instance). Use Upstash/Vercel KV if you need a hard limit.
const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 10 * 60_000) { hits.set(ip, { n: 1, t: now }); return false; }
  h.n += 1;
  return h.n > 5;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad_json" }, { status: 400 }); }
  const b = (body ?? {}) as Record<string, unknown>;

  if (typeof b.hp === "string" && b.hp.length > 0) return NextResponse.json({ ok: true }); // honeypot: pretend success
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  const tool = typeof b.tool === "string" ? b.tool : "";
  const locale = typeof b.locale === "string" ? b.locale : "";
  if (!EMAIL_RE.test(email) || email.length > 200) return NextResponse.json({ error: "email" }, { status: 400 });
  if (!(TOOL_IDS as readonly string[]).includes(tool)) return NextResponse.json({ error: "tool" }, { status: 400 });
  if (!isLocale(locale)) return NextResponse.json({ error: "locale" }, { status: 400 });
  if (b.consent !== true) return NextResponse.json({ error: "consent" }, { status: 400 });

  const result: Record<string, string> = {};
  if (b.result && typeof b.result === "object") {
    for (const [k, v] of Object.entries(b.result as Record<string, unknown>).slice(0, 12)) {
      result[String(k).slice(0, 60)] = String(v).slice(0, 80);
    }
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.TOOLS_FROM_EMAIL || 'support@ufolabz.com';

  if (supabaseUrl && serviceKey) {
    try {
      const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
      const { error: dbErr } = await supabase.from("tool_leads").insert({
        email, tool, locale, consent: true, result, source_site: site.preset,
      });
      if (dbErr) {
        console.warn("[TOOLS LEAD API] Note inserting lead to db:", dbErr.message);
      }
    } catch (e: any) {
      console.warn("[TOOLS LEAD API] DB insert error:", e?.message);
    }
  }

  const t = COPY[locale];
  const title = CONTENT[locale].tools[tool as ToolId].cardTitle;
  const rows = Object.entries(result)
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#586272">${esc(k)}</td><td style="padding:6px 0"><strong>${esc(v)}</strong></td></tr>`)
    .join("");
  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#121821">
<h2 style="margin:0 0 12px">${esc(title)}</h2><p>${t.hi}</p>
<table style="border-collapse:collapse">${rows}</table>
<p style="font-size:12px;color:#586272;margin-top:24px">${t.disc}<br>${t.foot}<br>${esc(site.name)} · ${esc(site.url)}</p></div>`;

  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const { error: mailErr } = await resend.emails.send({ from: fromEmail, to: email, subject: t.subject(title), html });
      if (mailErr) console.warn("[TOOLS LEAD API] Email send warning:", mailErr.message);
    } catch (mailErr: any) {
      console.warn("[TOOLS LEAD API] Resend email send failed:", mailErr?.message);
    }
  }

  return NextResponse.json({ ok: true });
}
