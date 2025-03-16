

// @plugin 'tailwind-scrollbar';



/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Ensure it's set to 'class'
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure all your source files are included
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbite.plugin(),
    require("tailwind-scrollbar"),

  ],
};
