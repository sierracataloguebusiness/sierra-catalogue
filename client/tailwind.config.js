/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        headline: "24px", // main title
        subheadline: "16px", // subtitle
        body: "14px",
        button: "16px",
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
      },
      colors: {
        "primary-gold": "#ffc107",
      },
    },
  },
  plugins: [],
};
