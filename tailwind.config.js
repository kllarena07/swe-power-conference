/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'light-beige': '#ebcac6',
        'pastel-purple': '#c3a0d7',
        'cream': '#ece5d7',
        'deep-plum': '#9a598a',
        'rich-plum': '#82599a',
        'light-gray': '#e8e8e8',
      },
      fontFamily: {
        kurale: 'Kurale',
      },
      spacing: {
        '-60': '-60px',
      },
    },
  },
  plugins: [],
}