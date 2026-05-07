/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1A1816',
        graphite: '#3C3833',
        taupe: '#7A6F5E',
        mute: '#9A8E7A',
        bone: '#F2EDE4',
        parchment: '#E9DFCC',
        linen: '#D9CFB8',
        accent: '#B8541F',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'serif'],
        sans: ['"Inter Tight"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 6px 18px rgba(20,18,14,0.06)',
        cardHover: '0 22px 50px rgba(20,18,14,0.18)',
        cta: '0 10px 28px rgba(20,18,14,0.14)',
      },
    },
  },
  plugins: [],
};
