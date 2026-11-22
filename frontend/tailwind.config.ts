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
          primary: "#166534",     // Forest Green
          primaryLight: "#15803d",
          primaryDark: "#14532d",
          emerald: "#10B981",     // Vibrant Emerald
          emeraldLight: "#34D399",
          emeraldDark: "#059669",
          bg: "#F8FAF8",          // Soft Natural Off-White
          card: "#FFFFFF",
          dark: "#14251B",        // Deep earthy text
          muted: "#64748B",       // Slate muted text
          amber: "#F59E0B",       // Energy/Warning accent
          amberLight: "#FDE68A",
          border: "#E2E8F0",
          surface: "#F0FDF4"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
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
