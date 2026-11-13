"use client";

import { useState, type FormEvent } from "react";
import type { UI } from "@/lib/tools/ui-strings";
import type { Locale, ToolId } from "@/lib/tools/config";
import { track } from "@/lib/tools/track";

type Result = Record<string, string | number>;

export function EmailCapture(p: { locale: Locale; tool: ToolId; ui: UI; result: Result | null }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!consent || !p.result) return;
    setState("sending");
    try {
      const r = await fetch("/api/tools/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tool: p.tool, locale: p.locale, consent, hp, result: p.result }),
      });
      if (!r.ok) throw new Error("bad status");
      setState("sent");
      track("tool_lead", { tool: p.tool, locale: p.locale });
    } catch {
      setState("error");
    }
  }

  return (
    <div className="tl-capture">
      <p><strong>{p.ui.emailTitle}</strong> {p.ui.emailText}</p>
      <form onSubmit={submit}>
        <div className="fr">
          <input
            type="email" required placeholder={p.ui.emailPlaceholder} aria-label={p.ui.emailPlaceholder}
            value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
          />
          <button type="submit" disabled={!consent || !p.result || state === "sending" || state === "sent"}>
            {state === "sending" ? p.ui.sending : p.ui.emailCta}
          </button>
        </div>
        <label>
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
          <span>{p.ui.consent}</span>
        </label>
        <input
          className="tl-hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
          value={hp} onChange={(e) => setHp(e.target.value)}
        />
        <div role="status" aria-live="polite" className="tl-note">
          {state === "sent" && p.ui.sent}
          {state === "error" && p.ui.emailError}
        </div>
      </form>
    </div>
  );
}
