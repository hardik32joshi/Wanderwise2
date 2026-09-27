import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1a6b5c', light: '#24937f', dark: '#0e4338' },
        accent: { DEFAULT: '#f5a623', light: '#ffbe55' },
        sky: '#2d9cdb',
        coral: '#e8614a',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '14px',
        'card-lg': '22px',
      },
    },
  },
  plugins: [],
};

export default config;
