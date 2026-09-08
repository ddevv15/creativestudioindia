import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			display: ['var(--font-display)', 'serif'],
  			sans: ['var(--font-sans)', 'sans-serif']
  		},
  		spacing: {
  			'4': '4px',
  			'8': '8px',
  			'16': '16px',
  			'24': '24px',
  			'32': '32px',
  			'48': '48px',
  			'64': '64px',
  			'96': '96px',
  			'128': '128px',
  			/*
  			 * Fixed-nav clearance. `--nav-h` is defined once in globals.css and is
  			 * responsive (64px → 96px at md), so these tokens are correct at both
  			 * breakpoints without a `md:` variant.
  			 *
  			 *   nav      — the bar's own height (h-nav on Nav / MobileNav)
  			 *   nav-80   — nav clearance + the 80px page-hero rhythm (specs 18, 20)
  			 *   nav-96   — nav clearance + the 96px section rhythm (specs 16, 19, 21)
  			 *
  			 * Any page whose first section sits under the nav needs pt-nav-80 or
  			 * pt-nav-96. Pages with a full-viewport dark hero (/, /projects/[slug])
  			 * deliberately sit under it and need neither.
  			 */
  			nav: 'var(--nav-h)',
  			'nav-80': 'calc(var(--nav-h) + 80px)',
  			'nav-96': 'calc(var(--nav-h) + 96px)'
  		},
  		colors: {
  			ink: '#1A1A17',
  			charcoal: '#2C2C2A',
  			stone: '#5F5E5A',
  			linen: '#F1EFE8',
  			offwhite: '#FAFAF8',
  			red: '#C0391B',
  			deepred: '#8C2812',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: 'hsl(var(--destructive))',
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
};

export default config;
