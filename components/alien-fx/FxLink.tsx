"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, type ComponentProps, type MouseEvent } from "react";
import {
  isLiteLayout,
  playAlienFx,
  prefersReducedMotion,
  type AlienFxMode,
} from "./alien-fx";

type FxLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  /**
   * "auto" = full effect on desktop, lite effect on mobile (default).
   * "none" = plain link with no effect (use for Cart / checkout).
   */
  fx?: AlienFxMode | "auto" | "none";
  /** Full mode only: wait this long before navigating so the cracks are visible. */
  delayMs?: number;
};

export default function FxLink({
  href,
  fx = "auto",
  delayMs = 800,
  onClick,
  children,
  ...rest
}: FxLinkProps) {
  const router = useRouter();
  const pending = useRef(false);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || fx === "none") return;
    // Let the browser handle new-tab / download style clicks normally.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target && rest.target !== "_self") return;
    if (prefersReducedMotion()) return;

    const mode: AlienFxMode = fx === "auto" ? (isLiteLayout() ? "lite" : "full") : fx;
    const rect = e.currentTarget.getBoundingClientRect();

    if (mode === "lite") {
      // Navigation is never delayed on mobile: the Link navigates immediately.
      const icon = e.currentTarget.querySelector<HTMLElement>("[data-afx-icon]") ?? e.currentTarget;
      const r = icon.getBoundingClientRect();
      playAlienFx(r.left + r.width / 2, r.top + r.height / 2, "lite", icon);
      return;
    }

    e.preventDefault();
    if (pending.current) return;
    pending.current = true;

    // Keyboard "Enter" gives clientX/Y = 0, so fall back to the link's centre.
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;
    playAlienFx(x, y, "full");

    window.setTimeout(() => {
      pending.current = false;
      router.push(href);
    }, delayMs);
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
