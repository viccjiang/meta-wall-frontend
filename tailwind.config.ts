import type { Config } from 'tailwindcss'

export default <Config>{
  theme: {
    extend: {
      colors: {
        primary: '#03438D',
        dark: '#1B3E4F',
        warning: '#EEC32A',
        accent: '#E2EDFA',
        'gray-bg': '#EFECE7',
        'gray-border': '#9B9893',
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', 'sans-serif'],
        logo: ['Paytone One', 'sans-serif'],
      },
    },
  },
}
