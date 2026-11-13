import Link from "next/link";
import { CONTENT } from "@/lib/tools/content";
import { TOOLS, toolPath, type Locale, type ToolId } from "@/lib/tools/config";
import { UI_STRINGS } from "@/lib/tools/ui-strings";

export function RelatedTools({ locale, id }: { locale: Locale; id: ToolId }) {
  const t = CONTENT[locale].tools;
  return (
    <section className="tl-section">
      <h2>{UI_STRINGS[locale].related}</h2>
      <div className="tl-cards">
        {TOOLS[id].related.map((r) => (
          <Link key={r} href={toolPath(locale, r)}>
            {t[r].cardTitle}
            <small>{t[r].cardBlurb}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}
