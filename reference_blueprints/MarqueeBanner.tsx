// components/home/MarqueeBanner.tsx
const items = [
  'ALIEN GRADE QUALITY',
  'THIRD-PARTY TESTED',
  'MADE IN SWITZERLAND',
  'FREE SHIPPING CHF 99+',
  'EARN ALIEN POINTS',
  'VAT INCLUDED',
  'SCIENCE-BACKED FORMULAS',
  'NO PROPRIETARY BLENDS',
]

export default function MarqueeBanner() {
  const doubled = [...items, ...items]

  return (
    <div className="relative overflow-hidden py-4 bg-alien-green/10 border-y border-alien-green/20">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 mx-4">
            <span className="text-xs font-mono font-bold tracking-widest text-alien-green uppercase">
              {item}
            </span>
            <span className="text-alien-green/40 text-xs">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
