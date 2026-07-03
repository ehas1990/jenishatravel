import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F766E',
        'primary-hover': '#115E59',
        secondary: '#F59E0B',
        'dark-bg': '#08141B',
        'light-gray': '#F8FAFC',
        heading: '#111827',
        paragraph: '#6B7280',
        success: '#16A34A',
        danger: '#DC2626',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Poppins', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '24px',
        btn: '14px',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        medium: 'var(--shadow-medium)',
        glass: 'var(--shadow-glass)',
        hover: 'var(--shadow-hover)',
      },
    },
  },
  plugins: [],
};

export default config;
