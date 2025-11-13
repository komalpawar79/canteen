module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef5e7',
          100: '#fce8c3',
          200: '#f9db9e',
          300: '#f6ce79',
          400: '#f3c154',
          500: '#f0b32f',
          600: '#d99a27',
          700: '#c2821f',
          800: '#ab6a17',
          900: '#94520f',
        },
        secondary: {
          50: '#f0f3f7',
          100: '#dfe6f0',
          200: '#cdd9e8',
          300: '#bbcce0',
          400: '#a9bfd8',
          500: '#97b2d0',
          600: '#7995c7',
          700: '#5b78be',
          800: '#3d5bb5',
          900: '#1f3eac',
        },
        accent: '#d4af37',
        dark: '#2c3e50',
        light: '#ecf0f1',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'medium': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'premium': '0 20px 30px rgba(0, 0, 0, 0.15)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
