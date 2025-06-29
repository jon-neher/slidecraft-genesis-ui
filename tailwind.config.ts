
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
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
                                border: 'rgb(var(--border))',
                                input: 'rgb(var(--input))',
                                ring: 'rgb(var(--ring))',
                                background: 'rgb(var(--background))',
                                foreground: 'rgb(var(--foreground))',
                                primary: {
                                        DEFAULT: 'rgb(var(--primary))',
                                        foreground: 'rgb(var(--primary-foreground))'
                                },
                                secondary: {
                                        DEFAULT: 'rgb(var(--secondary))',
                                        foreground: 'rgb(var(--secondary-foreground))'
                                },
                                destructive: {
                                        DEFAULT: 'rgb(var(--destructive))',
                                        foreground: 'rgb(var(--destructive-foreground))'
                                },
                                muted: {
                                        DEFAULT: 'rgb(var(--muted))',
                                        foreground: 'rgb(var(--muted-foreground))'
                                },
                                accent: {
                                        DEFAULT: 'rgb(var(--accent))',
                                        foreground: 'rgb(var(--accent-foreground))'
                                },
                                popover: {
                                        DEFAULT: 'rgb(var(--popover))',
                                        foreground: 'rgb(var(--popover-foreground))'
                                },
                                card: {
                                        DEFAULT: 'rgb(var(--card))',
                                        foreground: 'rgb(var(--card-foreground))'
                                },
                                sidebar: {
                                        DEFAULT: 'rgb(var(--sidebar-background))',
                                        foreground: 'rgb(var(--sidebar-foreground))',
                                        primary: 'rgb(var(--sidebar-primary))',
                                        'primary-foreground': 'rgb(var(--sidebar-primary-foreground))',
                                        accent: 'rgb(var(--sidebar-accent))',
                                        'accent-foreground': 'rgb(var(--sidebar-accent-foreground))',
                                        border: 'rgb(var(--sidebar-border))',
                                        ring: 'rgb(var(--sidebar-ring))'
                                },
				// Brand colors
				'electric-indigo': '#5A2EFF',
				'slate-gray': '#3A3D4D',
				'ice-white': '#FAFAFB',
				'neon-mint': '#30F2B3',
				'soft-coral': '#FF6B6B',
			},
			backgroundImage: {
				'electric-gradient': 'linear-gradient(135deg, #5A2EFF 0%, #30F2B3 100%)',
				'subtle-gradient': 'linear-gradient(135deg, #FAFAFB 0%, #F8F9FA 100%)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(100px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'slide-up': 'slide-up 0.8s ease-out'
			}
		}
	},
        plugins: [animate],
} satisfies Config;
