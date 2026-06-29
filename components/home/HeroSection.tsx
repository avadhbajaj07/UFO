'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* ─── Background Video ─── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-80"
      >
        <source
          src="https://res.cloudinary.com/dm4jfxbcs/video/upload/v1782755301/hero-spaceship_brchkj.mp4"
          type="video/mp4"
        />
      </video>

      {/* ─── Very Dark Overlay with Radial Vignette ─── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.85) 100%)',
        }}
      />
      <div className="absolute inset-0 z-0 bg-black/40 pointer-events-none" />

      {/* ─── Centered Content ─── */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center flex flex-col items-center">
        {/* Animated Saucer Logo */}
        <div 
          className="mb-6 animate-fade-in-up"
          style={{ animationDelay: '0s' }}
        >
          <img
            src="https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782711478/ufo_logo_sqaure_h2yvkk.jpg"
            alt="UFO LABZ"
            className="h-28 w-28 object-contain rounded-full border border-white/10 shadow-[0_0_50px_rgba(0,255,136,0.15)] hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Subtitle Badge */}
        <div
          className="animate-fade-in-up mb-4"
          style={{ animationDelay: '0.15s' }}
        >
          <span className="font-mono text-xs md:text-sm tracking-[0.3em] text-alien-green uppercase font-semibold">
            FUEL FROM SPACE
          </span>
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-in-up font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-white leading-none uppercase mb-6"
          style={{ animationDelay: '0.3s' }}
        >
          UNLEASH YOUR
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-alien-green via-[#00CFFF] to-[#9B30FF] shadow-sm">
            COSMIC POWER
          </span>
        </h1>

        {/* Description */}
        <p
          className="animate-fade-in-up max-w-xl text-xs sm:text-sm md:text-base leading-relaxed text-gray-300 mb-8 font-sans"
          style={{ animationDelay: '0.45s' }}
        >
          Next-generation supplements engineered for peak performance. Formulated with
          extraterrestrial precision.
        </p>

        {/* Action Buttons */}
        <div
          className="animate-fade-in-up flex flex-col sm:flex-row items-center gap-4 justify-center"
          style={{ animationDelay: '0.6s' }}
        >
          <Link
            href="/products"
            className="w-full sm:w-auto text-center bg-gradient-to-r from-[#00FF88] to-[#9B30FF] text-space-950 font-bold font-mono text-xs uppercase tracking-wider px-8 py-4 rounded-xl hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] transition-all duration-300 transform hover:scale-[1.02]"
          >
            Explore the Universe
          </Link>
          <Link
            href="/affiliate"
            className="w-full sm:w-auto text-center border border-[#00FF88]/40 hover:border-[#00FF88] bg-black/60 hover:bg-black/80 text-white font-bold font-mono text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            Join Our Team
          </Link>
        </div>
      </div>

      {/* ─── Bottom Scroll Indicator ─── */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 opacity-60">
        <span className="font-mono text-[9px] tracking-[0.3em] text-gray-400 uppercase">
          SCROLL
        </span>
        <div className="h-8 w-px bg-gradient-to-b from-[#00FF88]/60 to-transparent" />
      </div>
    </section>
  );
}
