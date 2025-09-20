/** @type {import('tailwindcss').Config} */
import tailwindcssAnimatePlugin from 'tailwindcss-animate';

export default {
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'light-secondary-color': 'rgba(170, 170, 170, 0.08)',
                'menu-background-color': 'rgba(33, 33, 33, 0.75)',
                'primary-dark': '#212121',
                'primary-white': '#F9F9F9',
                'primary-blue': '#5181B8',
                'primary-purple': '#8774e1',
                'secondary-blue': '#E5EBF1',
                'primary-gray': '#9e9e9e',
                'primary-commerce': '#4BB34B',
                'primary-destructive': '#E64646',
                'primary-dark-50': '#424242',
                'primary-dark-100': '#222222',
                'primary-dark-150': '#1B1B1B',
                'primary-dark-200': '#141414',
                'dark-side-panel': '#161718',
                'dark-conversation-panel': '#18191B',
                'ripple-color': 'rgba(255, 255, 255, .08)',
                modal: 'rgba(0, 0, 0, .5)'
            },
            boxShadow: {
                'menu': '0px 0px 10px rgba(0, 0, 0, .15)',
            },
            keyframes: {
                shimmer: {
                    '100%': {
                        transform: 'translateX(100%)'
                    }
                },
                'out-to-right': {
                    '0%': {
                        transform: 'translate3d(0, 0, 0)'
                    },
                    '100%': {
                        transform: 'translate3d(100%, 0, 0)'
                    }
                },
                'in-from-right': {
                    '0%': {
                        transform: 'translate3d(100%, 0, 0)'
                    },
                    '100%': {
                        transform: 'translate3d(0, 0, 0)'
                    }
                },
                'caret-blink': {
                    '0%,70%,100%': { opacity: '1' },
                    '20%,50%': { opacity: '0' }
                },
                loading: {
                    '0%': { transform: 'rotate(0)' },
                    '100%': { transform: 'rotate(360deg)' }
                },
                ripple: {
                    '0%': {
                        transform: 'scale(0)',
                        opacity: '1'
                    },
                    '100%': {
                        transform: 'scale(2.5)',
                        opacity: '0'
                    }
                }
            },
            transitionProperty: {
                height: 'height',
                width: 'width'
            },
            animation: {
                'in-from-right': 'in-from-right 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                'out-to-right': 'out-to-right 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                ripple: 'ripple 1.25s cubic-bezier(0.5, 1, 0.89, 1) forwards',
                loading: 'loading .5s linear infinite',
                'caret-blink': 'caret-blink 1.25s ease-out infinite'
            },
            backgroundImage: {
                'chat-pattern': "url('/src/shared/lib/assets/pattern.svg')",
            }
        }
    },
    plugins: [tailwindcssAnimatePlugin]
};