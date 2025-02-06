import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-border": {
          "0%, 100%": { 
            boxShadow: "0 0 0 0 rgba(255, 183, 77, 0.4)",
            borderColor: "rgba(255, 183, 77, 0.4)"
          },
          "50%": { 
            boxShadow: "0 0 20px 0px rgba(255, 183, 77, 0.7)",
            borderColor: "rgba(255, 183, 77, 0.7)"
          }
        },
        "pulse-border-cyan": {
          "0%, 100%": { 
            boxShadow: "0 0 0 0 rgba(2, 230, 246, 0.4)",
            borderColor: "rgba(2, 230, 246, 0.4)"
          },
          "50%": { 
            boxShadow: "0 0 20px 0px rgba(2, 230, 246, 0.7)",
            borderColor: "rgba(2, 230, 246, 0.7)"
          }
        },
        "bounce-rotate": {
          "0%, 100%": { 
            transform: "translateY(0) rotate(0deg)",
          },
          "50%": {
            transform: "translateY(-3px) rotate(5deg)",
          }
        },
        float: {
          "0%, 100%": { 
            transform: "translateY(0) scale(1) rotate(0deg)",
          },
          "50%": {
            transform: "translateY(-20px) scale(1.01) rotate(1deg)",
          }
        },
        neon: {
          "0%, 100%": {
            textShadow: "0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #FFB74D, 0 0 82px #FFB74D, 0 0 92px #FFB74D, 0 0 102px #FFB74D, 0 0 151px #FFB74D"
          },
          "50%": {
            textShadow: "0 0 4px #fff, 0 0 7px #fff, 0 0 18px #fff, 0 0 38px #FFB74D, 0 0 73px #FFB74D, 0 0 80px #FFB74D, 0 0 94px #FFB74D, 0 0 140px #FFB74D"
          }
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        "float-1": {
          "0%, 100%": { 
            transform: "translate(0px, 0px)",
          },
          "25%": {
            transform: "translate(15px, -15px)",
          },
          "50%": {
            transform: "translate(0px, -25px)",
          },
          "75%": {
            transform: "translate(-15px, -15px)",
          }
        },
        "float-2": {
          "0%, 100%": { 
            transform: "translate(0px, 0px)",
          },
          "25%": {
            transform: "translate(-15px, 15px)",
          },
          "50%": {
            transform: "translate(0px, 25px)",
          },
          "75%": {
            transform: "translate(15px, 15px)",
          }
        },
        "float-3": {
          "0%, 100%": { 
            transform: "translate(0px, 0px)",
          },
          "25%": {
            transform: "translate(20px, 10px)",
          },
          "50%": {
            transform: "translate(0px, 20px)",
          },
          "75%": {
            transform: "translate(-20px, 10px)",
          }
        },
        "float-4": {
          "0%, 100%": { 
            transform: "translate(0px, 0px)",
          },
          "25%": {
            transform: "translate(-10px, -20px)",
          },
          "50%": {
            transform: "translate(0px, -30px)",
          },
          "75%": {
            transform: "translate(10px, -20px)",
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-border": "pulse-border 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-border-cyan": "pulse-border-cyan 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-rotate": "bounce-rotate 0.5s ease-in-out",
        "float": "float 4s ease-in-out infinite",
        "neon": "neon 2.5s ease-in-out infinite",
        "spin-slow": "spin-slow 10s linear infinite",
        "float-1": "float-1 12s ease-in-out infinite",
        "float-2": "float-2 14s ease-in-out infinite",
        "float-3": "float-3 16s ease-in-out infinite",
        "float-4": "float-4 18s ease-in-out infinite",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: ["tailwindcss-animate"],
} satisfies Config

export default config
