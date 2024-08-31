module.exports = {
  important: true, 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      fontFamily: {
        'Inter': ['Inter', 'sans-serif'],
      },
      fontWeights: {
        lean:300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      fontSize: {
        // Custom font sizes from 12px to 30px (even numbers)
        '12': '12px',
        '14': '14px',
        '16': '16px',
        '18': '18px',
        '20': '20px',
        '22': '22px',
        '24': '24px',
        '26': '26px',
        '28': '28px',
        '30': '30px',
      },
      backgroundColor: {
        'exablack': '#434343',
        'exablue': '#0071BC',
       'exagrey': '#F5F5F5',
       'offwhite':'#F1F1F1'
        

        
      },
      textColor: {
        'exagrey': '#696969',
       'exaBluetxt': '#0071BC' // Add this line
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}