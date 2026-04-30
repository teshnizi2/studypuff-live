import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#fdfbf7",
          100: "#f8f3ea",
          200: "#efecec",
          300: "#e4dccb"
        },
        ink: {
          900: "#1f1f1f",
          700: "#3a3a3a",
          500: "#6b6b6b"
        },
        brand: {
          pink: "#f3c6c2",
          peach: "#f6d4b7",
          butter: "#fbe9a5",
          mint: "#c7e2c7",
          sky: "#c6dceb",
          lilac: "#d9cdea"
        }
      },
      fontFamily: {
        serif: ["Quattrocento", "Georgia", "serif"],
        display: ["Trirong", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 10px 30px -15px rgba(0,0,0,0.15)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        },
        bobble: {
          "0%, 100%": { transform: "translateY(0) rotate(-1deg)" },
          "50%": { transform: "translateY(-6px) rotate(1deg)" }
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" }
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.04)" }
        }
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        bobble: "bobble 6s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        "fade-up": "fade-up 0.8s ease-out forwards",
        gradient: "gradient 15s ease infinite",
        wiggle: "wiggle 3s ease-in-out infinite",
        breathe: "breathe 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
