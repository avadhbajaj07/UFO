'use client'

import { useState, useEffect } from 'react'
import { Rocket } from 'lucide-react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(target: Date): TimeLeft {
  const now = new Date().getTime()
  const diff = Math.max(target.getTime() - now, 0)

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function MarqueeBanner() {
  const [targetDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d
  })

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTimeLeft(getTimeLeft(targetDate))
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  const timerBlocks: { value: number; label: string }[] = [
    { value: timeLeft?.days ?? 0, label: 'Days' },
    { value: timeLeft?.hours ?? 0, label: 'Hrs' },
    { value: timeLeft?.minutes ?? 0, label: 'Mins' },
    { value: timeLeft?.seconds ?? 0, label: 'Secs' },
  ]

  return (
    <div className="relative w-full overflow-hidden py-5 bg-gradient-to-r from-space-800 via-nebula-900/40 to-space-800 border-y border-nebula-700/20">
      {/* Animated shimmer overlay */}
      <div
        className="pointer-events-none absolute inset-0 animate-shimmer"
        style={{
          backgroundImage:
            'linear-gradient(110deg, transparent 25%, rgba(200,80,255,0.06) 37%, rgba(255,255,255,0.04) 50%, rgba(200,80,255,0.06) 63%, transparent 75%)',
          backgroundSize: '200% 100%',
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-center gap-6 px-4 sm:flex-row sm:gap-10">
        {/* Left side – Promo text */}
        <div className="flex items-center gap-3">
          <Rocket className="h-6 w-6 shrink-0 text-nebula-400" />
          <p className="font-display text-xl tracking-wider text-white sm:text-2xl">
            BUY 2, GET{' '}
            <span className="text-alien-green text-glow-green">25% OFF</span>{' '}
            ON YOUR 3RD ITEM!
          </p>
        </div>

        {/* Right side – Countdown timer */}
        <div className="flex items-center gap-2 sm:gap-3">
          {timerBlocks.map((block) => (
            <div
              key={block.label}
              className="group flex flex-col items-center bg-nebula-800/60 border border-nebula-600/30 rounded-xl px-4 py-3 transition-shadow duration-300 hover:shadow-glow-purple"
            >
              <span className="font-mono text-2xl font-bold text-white">
                {timeLeft ? String(block.value).padStart(2, '0') : '00'}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-nebula-400">
                {block.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
