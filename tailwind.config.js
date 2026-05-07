/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#1B4332",
        "on-primary": "#ffffff",
        "secondary": "#2c694e",
        "accent": "#56B685",
        "surface": "#f9faf6",
        "surface-container": "#eeeeeb",
        "surface-container-low": "#f3f4f1",
        "on-surface": "#1a1c1a",
        "outline": "#717973",
        "outline-variant": "#c1c8c2",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
        "6xl": "3rem",
        full: "9999px",
      },
      fontFamily: {
        lexend: ["Lexend", "sans-serif"],
      },
      fontSize: {
        "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-bold": ["14px", { lineHeight: "1.0", fontWeight: "600" }],
        "stat-number": ["28px", { lineHeight: "1.0", fontWeight: "700" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "display-hero": ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
      },
      maxWidth: {
        container: "1280px",
      },
    },
  },
  plugins: [],
};
