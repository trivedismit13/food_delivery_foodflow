/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      colors: {
        background: {
          base: '#FAF8F5',
          surface: '#FFFFFF',
          muted: '#F5F1EB',
          subtle: '#EDE8E0',
        },
        brand: {
          50: '#FFF8F0',
          100: '#FFEEDD',
          200: '#FFD4A8',
          300: '#FFB673',
          400: '#FF9040',
          500: '#F97316', // Primary
          600: '#EA6610',
          700: '#C4500A',
          800: '#9C3F08',
        },
        accent: {
          400: '#86EFAC',
          500: '#7BAF7A',
          600: '#5A8F59',
        },
        neutral: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
        status: {
          success: '#22C55E',
          error: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
        }
      },
      boxShadow: {
        'warm-sm': '0 1px 4px rgba(180, 120, 60, 0.04)',
        'warm': '0 2px 12px rgba(180, 120, 60, 0.08)',
        'warm-md': '0 4px 16px rgba(180, 120, 60, 0.1)',
        'warm-lg': '0 8px 24px rgba(249, 115, 22, 0.12)',
      }
    },
  },
  plugins: [],
}
