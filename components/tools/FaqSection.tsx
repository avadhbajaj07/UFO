export function FaqSection({ title, faq }: { title: string; faq: { q: string; a: string }[] }) {
  return (
    <section className="tl-section">
      <h2>{title}</h2>
      {faq.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </section>
  );
}
