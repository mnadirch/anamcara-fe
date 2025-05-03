/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        mowaq: ["Mowaq", "sans-serif"],

      },
      backgroundImage: {
        auth: 'linear-gradient(to top, #00000090, #00000090), url("/bg_auth.png")',
      },
      boxShadow:{
        'btn-shadow':"0px 0px 15px #3FA604",
      },
      keyframes: {
        typeLeft: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        typeRight: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        fontFamily: {
          mowaq: ["Mowaq", "sans-serif"],
          calibri: ['"Calibri"', "sans-serif"],
        },
        blinkShine: {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        blinkDull: {
          "0%, 50%": { opacity: "0" },
          "51%, 100%": { opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeOutIn: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        fadeLeftRight: {
          "0%": { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
          "50%": { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" },
          "100%": { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" },
        },
        "tail-spin": {
          "0%": { transform: "translate(-50%, -50%) rotate(0deg)" },
          "100%": { transform: "translate(-50%, -50%) rotate(360deg)" },
        },
      },
      animation: {
        "type-left": "typeLeft 2s steps(10, end) forwards", // For "WELCOME"
        "type-right": "typeRight 2s steps(5, end) forwards 3s", // For "HUMAN", delayed by 3 seconds
        "blink-shine": "blinkShine 3s infinite",
        "blink-dull": "blinkDull 3s infinite",
        "slide-in-left": "slideInLeft 0.5s ease-out",
        // "fadeOutIn": "fadeOutIn 1s ease-in-out",
        fadeLeftRight: "fadeLeftRight 1s ease-in-out",
        "tail-spin": "tail-spin 1.8s ease-in-out infinite",
      },
      animationDelay: {
        0: "0s",
        500: "0.5s",
      },
    },
  },
  plugins: [],
};
