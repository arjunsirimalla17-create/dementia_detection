/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        deep: '#050714',
        surface: 'rgba(10, 22, 40, 0.7)',
        elevated: 'rgba(15, 32, 64, 0.8)',
        'bg-deep': '#050714',
        'bg-surface': 'rgba(10, 22, 40, 0.7)',
        'bg-elevated': 'rgba(15, 32, 64, 0.8)',
        primary: '#00D4AA',
        accent: {
          teal: '#00D4AA',
          blue: '#3B82F6',
          purple: '#8B5CF6',
        },
        risk: {
          low: '#10B981',
          moderate: '#F59E0B',
          high: '#EF4444',
        },
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
        textMuted: '#64748B',
        border: 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-teal': '0 0 40px rgba(0,212,170,0.15)',
        'glow-blue': '0 0 40px rgba(59,130,246,0.15)',
        'liquid': '0 20px 40px -10px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
        'hero-mesh': 'radial-gradient(at 0% 0%, rgba(0,212,170,0.1) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(139,92,246,0.1) 0, transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}