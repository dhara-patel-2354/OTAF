/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        that: {
          page: '#F6F5F7',
          card: '#FFFDFB',
          text: '#3F2C45',
          muted: '#76657A',
          accent: '#8D668A',
          accentDark: '#6E4C70',
          border: '#DED5E2',
          soft: '#F0ECF1',
          red: '#D66B73',
          green: '#79B58A',
          gray: '#8B8791'
        }
      },
      boxShadow: {
        card: '0 10px 28px rgba(63, 44, 69, 0.07)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [],
};
