import type { Config } from 'tailwindcss'

const config: Config = {
content: [
  './src/**/*.{js,ts,jsx,tsx,mdx}',
],
theme: {
  extend: {
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      slideIn: {
        '0%': { transform: 'translateY(-10px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
    },
    animation: {
      fadeIn: 'fadeIn 0.1s ease-out',
      slideIn: 'slideIn 0.1s ease-out',
    },
  },
},
plugins: [],
}

export default config