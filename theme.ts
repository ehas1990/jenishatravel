export const theme = {
  colors: {
    primary: '#0F766E',
    primaryHover: '#115E59',
    secondary: '#F59E0B',
    background: '#FFFFFF',
    darkBg: '#08141B',
    lightGray: '#F8FAFC',
    border: '#E5E7EB',
    heading: '#111827',
    paragraph: '#6B7280',
    success: '#16A34A',
    danger: '#DC2626',
  },
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
  },
  spacing: {
    sectionPaddingDesktop: '120px',
    sectionPaddingTablet: '90px',
    sectionPaddingMobile: '70px',
    containerWidth: '1320px',
    containerPadding: '24px',
    gap: '32px',
  },
  radii: {
    card: '24px',
    button: '14px',
  },
  shadows: {
    soft: '0 4px 20px -2px rgba(8, 20, 27, 0.04), 0 2px 8px -1px rgba(8, 20, 27, 0.02)',
    medium: '0 12px 30px -4px rgba(8, 20, 27, 0.08), 0 4px 12px -2px rgba(8, 20, 27, 0.03)',
    glass: '0 8px 32px 0 rgba(8, 20, 27, 0.08)',
    hover: '0 20px 40px -6px rgba(8, 20, 27, 0.12), 0 8px 16px -3px rgba(8, 20, 27, 0.04)',
  }
} as const;

export type Theme = typeof theme;
