import type { RefTable } from "@/lib/tools/tables";

/** Plain server-rendered HTML table, so crawlers and AI read it without running JavaScript. */
export function ReferenceTable({ title, table }: { title: string; table: RefTable }) {
  return (
    <section className="tl-section">
      <h2>{title}</h2>
      <div className="tl-scroll">
        <table>
          <thead>
            <tr>{table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
          </thead>
          <tbody>
            {table.rows.map((r) => (
              <tr key={r[0]}>
                {r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
