/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'work': ['Work Sans', 'sans-serif'],
        'dm': ['DM Sans', 'sans-serif'],
        'grotesk': ['Space Grotesk', 'sans-serif'],
        'manrope': ['Manrope', 'sans-serif'],
        'roboto-mono': ['Roboto Mono', 'monospace'],
        'ibm-plex-mono': ['IBM Plex Mono', 'monospace'],
        'courier-prime': ['Courier Prime', 'monospace'],
        'source-code-pro': ['Source Code Pro', 'monospace'],
        'overpass-mono': ['Overpass Mono', 'monospace'],
        'jetbrains-mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
