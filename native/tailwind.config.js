/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#0b1120",
        "bg-secondary": "#111827",
        "bg-card": "#162033",
        "bg-card-hover": "#1c2940",
        "bg-input": "#1e293b",
        "border-primary": "#1e3a5f",
        "border-secondary": "#334155",
        "accent-green": "#22c55e",
        "accent-green-dark": "#16a34a",
        "accent-blue": "#3b82f6",
        "accent-purple": "#a855f7",
        "accent-orange": "#f97316",
        "accent-yellow": "#eab308",
        "accent-teal": "#14b8a6",
        "accent-red": "#ef4444",
        "text-primary": "#f1f5f9",
        "text-secondary": "#94a3b8",
        "text-muted": "#64748b",
        "text-green": "#4ade80",
      },
    },
  },
  plugins: [],
};
