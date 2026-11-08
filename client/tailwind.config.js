/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // ─── Brand Colours ────────────────────────────────────────────
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',   // primary
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        accent: {
          400: '#f472b6',
          500: '#ec4899',   // pink accent
          600: '#db2777',
        },
        surface: {
          DEFAULT: '#0f172a',  // deep navy bg
          card:    '#1e293b',
          border:  '#334155',
        },
      },

      // ─── Typography ───────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },

      // ─── Spacing ─────────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // ─── Border Radius ────────────────────────────────────────────
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },

      // ─── Box Shadows ──────────────────────────────────────────────
      boxShadow: {
        glow: '0 0 20px rgba(34, 197, 94, 0.35)',
        'glow-accent': '0 0 20px rgba(236, 72, 153, 0.35)',
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
      },

      // ─── Backdrop Blur ────────────────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },

      // ─── Animation ────────────────────────────────────────────────
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.5' },
        },
      },
      animation: {
        'fade-in':        'fade-in 0.3s ease-out both',
        'slide-in-right': 'slide-in-right 0.3s ease-out both',
        shimmer:          'shimmer 1.5s infinite linear',
      },

      // ─── Screen Breakpoints ───────────────────────────────────────
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};
