/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      colors: {
        primary: {
          50: '#FFF3EC',
          100: '#FFE4D6',
          200: '#FFCCB0',
          300: '#FFAD80',
          400: '#FF8C4D',
          500: '#FF6B35',
          600: '#F2521E',
          700: '#D94010',
          800: '#B0330D',
          900: '#8A280A',
        },
        secondary: {
          50: '#E8F0F1',
          100: '#C5D7DA',
          200: '#9BBCC1',
          300: '#6FA1A8',
          400: '#4D8991',
          500: '#1A535C',
          600: '#174A52',
          700: '#123E45',
          800: '#0E3338',
          900: '#092528',
        },
        accent: {
          50: '#FFF8E1',
          100: '#FFECB3',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#FFD166',
          600: '#FBC02D',
          700: '#F9A825',
          800: '#F57F17',
          900: '#E65100',
        },
        warm: {
          50: '#FDFCFB',
          100: '#FAF8F5',
          200: '#F5F1EB',
          300: '#EDE7DE',
          400: '#E0D7C9',
          500: '#D4C7B5',
        },
      },
      fontFamily: {
        display: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
        body: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 8px 24px -8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 16px 48px -16px rgba(0, 0, 0, 0.12)',
        'soft': '0 1px 3px rgba(0, 0, 0, 0.06), 0 2px 12px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
