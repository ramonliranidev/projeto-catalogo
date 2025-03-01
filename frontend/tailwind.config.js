/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "fontColor-main": "#fff",
        // "background-main": "#1F1F1F",
        "background-custom": "#d6d2c6",
        "gelo-seco": "#ede9e1",
        "background-main": "#F8F8F8",
        "lavender-blush": "#f6e8ea",
        "tea-rose-red": "#f7cbcf",
        "off-red": "#fa0011",
        cardinal: "#b73a42",
        "dim-gray": "#737373",
        jet: "#3a3a3a",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
