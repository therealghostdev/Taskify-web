/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "custom-1": "-1px 0px 5px 4px #bdbdbd",
      },
    },
  },
  plugins: [],
};
