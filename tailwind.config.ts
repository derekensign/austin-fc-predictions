import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        verde: {
          50: "#e6fff0",
          100: "#b3ffd1",
          200: "#80ffb3",
          300: "#4dff94",
          400: "#1aff76",
          500: "#00b140", // Primary Austin FC Verde
          600: "#008f34",
          700: "#006d28",
          800: "#004a1b",
          900: "#00280f",
          950: "#001a0a",
        },
        obsidian: {
          50: "#f5f5f5",
          100: "#e0e0e0",
          200: "#bdbdbd",
          300: "#9e9e9e",
          400: "#757575",
          500: "#616161",
          600: "#424242",
          700: "#303030",
          800: "#1a1a1a",
          900: "#0d0d0d",
          950: "#050505",
        },
      },
      backgroundImage: {
        "verde-gradient": "linear-gradient(135deg, #00b140 0%, #008f34 100%)",
        "dark-gradient": "linear-gradient(180deg, #0d0d0d 0%, #1a1a1a 100%)",
        "card-gradient": "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)",
        "glow-verde": "radial-gradient(ellipse at center, rgba(0, 177, 64, 0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "verde": "0 0 20px rgba(0, 177, 64, 0.3)",
        "verde-lg": "0 0 40px rgba(0, 177, 64, 0.4)",
        "card": "0 4px 20px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "pulse-verde": "pulseVerde 2s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
      },
      keyframes: {
        pulseVerde: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 177, 64, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 177, 64, 0.6)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
