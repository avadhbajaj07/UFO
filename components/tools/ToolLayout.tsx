import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import "./tools.css";
import { site } from "@/lib/site";
import { homePath, hubPath, type Locale, type ToolId } from "@/lib/tools/config";
import { CONTENT } from "@/lib/tools/content";
import { tableFor } from "@/lib/tools/tables";
import { UI_STRINGS } from "@/lib/tools/ui-strings";
import { ToolIcon } from "./ToolIcon";
import { AuthorBox } from "./AuthorBox";
import { FaqSection } from "./FaqSection";
import { ReferenceTable } from "./ReferenceTable";
import { RelatedTools } from "./RelatedTools";

/** Shared page template. Everything here is server-rendered; only `children` (the calculator) is a client component. */
export function ToolLayout({ locale, id, children }: { locale: Locale; id: ToolId; children: ReactNode }) {
  const c = CONTENT[locale].tools[id];
  const ui = UI_STRINGS[locale];
  return (
    <div className="tl-root" style={{ "--tl-accent": site.accent } as CSSProperties}>
      <main className="tl-wrap">
        <nav className="tl-crumbs" aria-label="Breadcrumb">
          <Link href={homePath(locale)}>{ui.home}</Link> › <Link href={hubPath(locale)}>{ui.tools}</Link> › {c.cardTitle}
        </nav>
        <div className="tl-header-badge">
          <ToolIcon id={id} size={24} />
        </div>
        <h1 className="tl-h1">{c.h1}</h1>
        <p className="tl-answer">{c.answer}</p>

        {children}

        <section className="tl-section">
          <h2>{ui.howCalc}</h2>
          <div className="tl-formula">{c.formula.map((p) => <p key={p}>{p}</p>)}</div>
        </section>

        <ReferenceTable title={c.tableTitle} table={tableFor(id, locale)} />
        <FaqSection title={ui.faq} faq={c.faq} />
        <RelatedTools locale={locale} id={id} />
        <AuthorBox locale={locale} updated={c.updated} sources={c.sources} />
      </main>
    </div>
  );
}
