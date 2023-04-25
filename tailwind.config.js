/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}", 
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js"
    ],
    theme: {
        
        extend: {
            colors: {
                violeta: '#3B336A',
                newvioleta: '#1f1b33',
                'newvioleta-claro': '#4E4585',
                newbox: '#181525',
                menu: '#292548',
                naranja: '#FF3B2F',
                'fondo': '#100F14',
                blanco: '#F1F1F1',
                'fondo-blanco': '#E5E5E5',
                gris: '#c0c0c0',
                'gris-admin': '#b2b2c9',
                'negro-texto': '#181525',
                'box-naranja' : '#2b161f'
            },
            fontFamily: {
                Helvetica: ['var(--helvetica)'],
                'din-display': ['var(--din-display)'],
                'Fixture-ultra': ['var(--fixture-ultra)'],
                'Fixture': ['var(--fixture-black)'],
                'latin': ['var(--latin)'],
            },
        },
    },
    plugins: [],
};

