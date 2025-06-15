
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: "hsl(var(--card))",
				"card-foreground": "hsl(var(--card-foreground))",
				popover: "hsl(var(--popover))",
				"popover-foreground": "hsl(var(--popover-foreground))",
				primary: "hsl(var(--primary))",
				"primary-foreground": "hsl(var(--primary-foreground))",
				secondary: "hsl(var(--secondary))",
				"secondary-foreground": "hsl(var(--secondary-foreground))",
				muted: "hsl(var(--muted))",
				"muted-foreground": "hsl(var(--muted-foreground))",
				accent: "hsl(var(--accent))",
				"accent-foreground": "hsl(var(--accent-foreground))",
				destructive: "hsl(var(--destructive))",
				"destructive-foreground": "hsl(var(--destructive-foreground))",
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				"echurch": {
					50:  "#f0f4f8",
					100: "#d9e5f2",
					200: "#b3cbe5",
					300: "#8cadd4",
					400: "#5a8ac4",
					500: "#1e3a5f", // azul marinho principal
					600: "#1a334f",
					700: "#162b42",
					800: "#122336",
					900: "#0e1b29"
				},
        // Optionally you can add sidebar colors if you want to use as utilities:
        "sidebar-background": "hsl(var(--sidebar-background))",
        "sidebar-foreground": "hsl(var(--sidebar-foreground))",
        "sidebar-primary": "hsl(var(--sidebar-primary))",
        "sidebar-primary-foreground": "hsl(var(--sidebar-primary-foreground))",
        "sidebar-accent": "hsl(var(--sidebar-accent))",
        "sidebar-accent-foreground": "hsl(var(--sidebar-accent-foreground))",
        "sidebar-border": "hsl(var(--sidebar-border))",
        "sidebar-ring": "hsl(var(--sidebar-ring))",
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			borderRadius: {
				'lg': '0.75rem',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
