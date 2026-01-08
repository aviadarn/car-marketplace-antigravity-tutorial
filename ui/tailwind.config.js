/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                'elite-gold': '#d4af37',
                'elite-dark': '#0f172a',
                'elite-darker': '#020617',
                'elite-card': '#1e293b',
            }
        },
    },
    plugins: [],
}
