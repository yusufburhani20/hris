import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
        './resources/js/**/*.ts',
    ],

    safelist: [
        '-translate-x-full',
        'translate-x-0',
        'opacity-0',
        'opacity-100',
        'invisible',
        'visible',
        'pointer-events-none',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: '#2b7a43',
                'primary-hover': '#1e562f',
                // Primary Remapped to Green/Teal from logo
                indigo: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#2b7a43', // Primary Core Brand Green
                    800: '#166534',
                    900: '#14532d',
                },
                violet: {
                    500: '#0d9488', // Primary Accent Teal
                    600: '#0f766e',
                },
                // Background Colors
                slate: {
                    50: '#f8fafc',
                    800: '#1e293b',
                    900: '#0f172a',
                },
                // Semantic Colors
                emerald: {
                    500: '#10b981', // Success
                    600: '#059669',
                },
                amber: {
                    500: '#f59e0b', // Warning
                    600: '#d97706',
                },
                red: {
                    500: '#ef4444', // Danger
                    600: '#dc2626',
                }
            },
        },
    },

    plugins: [forms],
};
