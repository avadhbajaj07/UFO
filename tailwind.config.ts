import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './emails/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // UFO LABZ brand — deep space backgrounds
        space: {
          950: '#06060F',
          900: '#0A0A1A',
          800: '#0E0E24',
          700: '#12122E',
          600: '#1A1A3E',
        },
        // Nebula purple accent scale
        nebula: {
          400: '#C850FF',
          500: '#A64DFF',
          600: '#8B3FE0',
          700: '#7B2FBE',
          800: '#5A1F8E',
          900: '#3A1260',
        },
        // Product accent colors
        'alien-green': '#00FF88',
        'electric-red': '#FF2244',
        'mango-orange': '#FF8C00',
        'neon-blue': '#00CFFF',
        'cosmic-purple': '#9B30FF',
        // UI
        muted: '#8888BB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Bebas Neue', 'cursive'],
        mono: ['Orbitron', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 18s linear infinite',
        'pulse-glow': 'pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'marquee': 'marquee 28s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'scale-up': 'scaleUp 0.3s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'count-up': 'countUp 1s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleUp: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to: { backgroundPosition: '200% 0' },
        },
        countUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'glow-green': '0 0 30px rgba(0,255,136,0.4)',
        'glow-red': '0 0 30px rgba(255,34,68,0.4)',
        'glow-orange': '0 0 30px rgba(255,140,0,0.4)',
        'glow-blue': '0 0 30px rgba(0,207,255,0.4)',
        'glow-purple': '0 0 30px rgba(155,48,255,0.4)',
        'glow-nebula': '0 0 60px rgba(139,63,224,0.3)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
      },
      backgroundImage: {
        'gradient-cosmic': 'linear-gradient(135deg, #7B2FBE 0%, #00FF88 100%)',
        'gradient-nebula': 'linear-gradient(180deg, #0A0A1A 0%, #1A0A2E 50%, #0A0A1A 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(30,15,60,0.6) 0%, rgba(10,10,26,0.8) 100%)',
      },
    },
  },
  plugins: [],
}

export default config
