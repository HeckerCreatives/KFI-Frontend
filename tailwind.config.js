module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        desktop: 'url("/img/login-bg-3.svg")',
        modalHeader: 'url("/img/login-bg.png")',
      },
    },
  },
  plugins: [],
};
