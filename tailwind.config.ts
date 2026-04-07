// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // Custom styling untuk artikel agar tidak terlalu besar di HP
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100ch", // Menjaga lebar baris agar mata tidak capek
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
