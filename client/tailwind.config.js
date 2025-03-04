// export default {
//   darkMode: 'class',
//   content: [
//     flowbite.content(),
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [
//     flowbite.plugin(),
//   ],
// }


/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Ensure it's set to 'class'
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure all your source files are included
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
