/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#121212',       
          card: '#1a1a1a',       
          gold: '#D4AF37',       
          goldDim: '#B8860B',    
          text: '#E5E5E5',       
          muted: '#A3A3A3',      
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'], 
        sans: ['"Inter"', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}