/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily:{
      poppins: ["Poppins", "sans-serif"]
    },
    extend: {
      colors:{
        default:"#FFFFFF",
        primary:'#67656E',
        secondary:'#464554',
        btnprimary:'#F7F5F7',
        bg:'#F4F4F5',
        company:"#EBEBEB",
        fonts :"#363447",
        form : "#68B6FF",
        lowerLabels:"#B8B7BC",
        companyForm:"#61AC68",
        dark : "#38343c",
    
      }
    },
  },
  plugins: [
  ],
}

