import { site } from "@/lib/site";
import type { Locale } from "@/lib/tools/config";
import { UI_STRINGS } from "@/lib/tools/ui-strings";

export function AuthorBox(p: { locale: Locale; updated: string; sources: { label: string; url: string }[] }) {
  const ui = UI_STRINGS[p.locale];
  return (
    <section className="tl-section">
      <div className="tl-author">
        <strong>{ui.sources}</strong>
        <ul>
          {p.sources.map((s) => (
            <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>
          ))}
        </ul>
        <div>
          <strong>{ui.reviewedBy}:</strong> {site.reviewer.name}, {site.reviewer.role} ·{" "}
          <strong>{ui.lastUpdated}:</strong> <time dateTime={p.updated}>{p.updated}</time>
        </div>
        <p style={{ marginTop: 10 }}>{ui.disclaimer}</p>
      </div>
    </section>
  );
}
