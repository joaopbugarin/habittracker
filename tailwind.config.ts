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
      'bounce-in': {
        '0%': { 
          transform: 'scale(0.95)',
          opacity: '0'
        },
        '50%': {
          transform: 'scale(1.05)',
          opacity: '0.8'
        },
        '100%': { 
          transform: 'scale(1)',
          opacity: '1'
        },
      },
      float: {
        '0%': { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(100vw)' },
      },
    },
    animation: {
      fadeIn: 'fadeIn 0.1s ease-out',
      slideIn: 'slideIn 0.1s ease-out',
      'bounce-in': 'bounce-in 0.3s ease-out',
      'float-slow': 'float 25s linear infinite',
      'float-slower': 'float 30s linear infinite',
      'float-medium': 'float 20s linear infinite',
      'float-fast': 'float 15s linear infinite',
    },
  },
},
plugins: [],
}

export default config