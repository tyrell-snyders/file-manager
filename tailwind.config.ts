import defaultTheme from 'tailwindcss/defaultTheme'

export default  {
  theme: {
    extend: {
      fontFamily: {
        sans: ['InterVariable', '...defaultTheme.fontFamily.sans'],
      },
    },
  },
}