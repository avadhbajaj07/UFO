import { useRef } from "react";

type W = { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };

/** Sends an event to Google (gtag) and Meta (fbq) when those scripts exist. Safe no-op otherwise. */
export function track(name: string, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as W;
  try {
    w.gtag?.("event", name, params);
    w.fbq?.("trackCustom", name, params);
  } catch {
    /* ignore */
  }
}

/** Returns a function that fires "tool_used" once, on first interaction. */
export function useFirstUse(tool: string) {
  const done = useRef(false);
  return () => {
    if (done.current) return;
    done.current = true;
    track("tool_used", { tool });
  };
}
