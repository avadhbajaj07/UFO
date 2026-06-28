// components/home/TestimonialsSection.tsx
import { Star } from 'lucide-react'

const reviews = [
  {
    name: 'Marco B.',
    location: 'Zurich',
    rating: 5,
    text: 'Astro Creatine has genuinely changed my training. I\'ve tried 6 different brands and this is the cleanest, most effective one by far. The micronisation is perfect — zero gritty texture.',
    product: 'Astro Creatine',
    color: '#00FF88',
    verified: true,
  },
  {
    name: 'Lena K.',
    location: 'Geneva',
    rating: 5,
    text: 'I was sceptical about the Blast Pre Workout but it delivers exactly what it promises. Clean energy, no crash, and I can feel it working within 20 minutes. No heart palpitations like cheap brands.',
    product: 'Blast Pre Workout',
    color: '#FF2244',
    verified: true,
  },
  {
    name: 'Fabio R.',
    location: 'Bern',
    rating: 5,
    text: 'The Special Edition formula is insane. I feel sharper in the gym AND during work after. The cognitive effect is real. Shipping was fast and packaging is premium.',
    product: 'Special Edition',
    color: '#9B30FF',
    verified: true,
  },
  {
    name: 'Sophie M.',
    location: 'Basel',
    rating: 5,
    text: 'Love the Amino Fuel Mango flavour — actually tastes like mango, not like artificial candy. Recovery is noticeably faster. Also appreciate that the label shows every ingredient.',
    product: 'Amino Fuel Mango',
    color: '#FF8C00',
    verified: true,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="section max-w-7xl mx-auto container-px">
      <div className="text-center mb-14">
        <h2 className="font-display text-5xl md:text-6xl tracking-wider mb-4">
          <span className="text-white">FROM THE</span>
          <br />
          <span className="text-gradient-cosmic">CREW</span>
        </h2>
        <p className="text-muted">Real athletes. Real results. No filters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reviews.map((review) => (
          <div
            key={review.name}
            className="card-glass p-6 overflow-hidden group hover:border-nebula-600/20 transition-all duration-300"
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: `linear-gradient(90deg, ${review.color}80, transparent)` }}
            />

            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Review text */}
            <p className="text-sm text-muted/90 leading-relaxed italic mb-4">
              &ldquo;{review.text}&rdquo;
            </p>

            {/* Bottom row */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-white">{review.name}</span>
                <span className="text-xs text-muted ml-2">{review.location}</span>
              </div>
              <div className="flex items-center gap-2">
                {review.verified && (
                  <span className="text-[10px] font-mono text-alien-green/70">✓ Verified</span>
                )}
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                  style={{
                    color: review.color,
                    background: `${review.color}15`,
                    border: `1px solid ${review.color}30`,
                  }}
                >
                  {review.product}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
