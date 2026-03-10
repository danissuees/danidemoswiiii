/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wii-gray': '#eeeeee',  // El gris de fondo clásico
        'wii-blue': '#64dcf0',  // El azul brillante del borde
        'wii-text': '#8c8c8c',  // El gris de las letras
      },
      boxShadow: {
        'wii': '0 0 15px rgba(100, 220, 240, 0.8)', // El brillo azul (glow)
      },
      gridTemplateColumns: {
        'wii': 'repeat(4, minmax(0, 1fr))', // Cuadrícula de 4 columnas
      }
    },
  },
  plugins: [],
}