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
        agri: {
          primary: "#24523A",     // Field green
          primaryLight: "#376D4D",
          primaryDark: "#173526",
          emerald: "#6C9A72",     // Verified state, used sparingly
          emeraldLight: "#BFD9B7",
          emeraldDark: "#3D704B",
          bg: "#F4F0E8",          // Warm field paper
          card: "#FFFFFF",
          dark: "#1E2A21",        // Ink
          muted: "#6B7169",       // Field note grey
          amber: "#B9673A",       // Clay / heat
          amberLight: "#EBC9A8",
          border: "#D9D2C4",
          surface: "#E8EFE3",
          clay: "#B9673A",
          paper: "#F4F0E8",
          ink: "#1E2A21",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        display: ["Instrument Serif", "Georgia", "Times New Roman", "serif"],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(22, 101, 52, 0.06), 0 2px 6px -1px rgba(22, 101, 52, 0.04)',
        'elevated': '0 10px 30px -4px rgba(22, 101, 52, 0.1), 0 4px 8px -2px rgba(22, 101, 52, 0.05)',
      }
    },
  },
  plugins: [],
};
export default config;
