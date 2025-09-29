import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 1s ease-out',
        'text-slide-up': 'textSlideUp 0.8s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'filament-flow': 'filamentFlow 2s ease-in-out infinite',
        'layer-build': 'layerBuild 0.5s ease-out',
        'figure-glow': 'figureGlow 2s ease-in-out infinite',
        'figure-rotate': 'figureRotate 4s linear infinite',
        'particle-float': 'particleFloat 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        textSlideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(3deg)' },
          '50%': { transform: 'translateY(-20px) rotate(-3deg)' },
        },
        filamentFlow: {
          '0%': { height: '0px', opacity: '0' },
          '50%': { height: '32px', opacity: '1' },
          '100%': { height: '32px', opacity: '0' },
        },
        layerBuild: {
          '0%': { height: '0px', opacity: '0' },
          '100%': { height: '8px', opacity: '1' },
        },
        figureGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(147, 51, 234, 0.3)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(147, 51, 234, 0.5)',
            transform: 'scale(1.05)'
          },
        },
        figureRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        particleFloat: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-10px) translateX(5px)' },
          '50%': { transform: 'translateY(-5px) translateX(-5px)' },
          '75%': { transform: 'translateY(-15px) translateX(3px)' },
        },
      },
    },
  },
  plugins: [],
}
export default config