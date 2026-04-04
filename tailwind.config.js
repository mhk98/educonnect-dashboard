const defaultTheme = require("tailwindcss/defaultTheme");
const windmill = require("@windmill/react-ui/config");

module.exports = windmill({
  purge: ["src/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        bottom:
          "0 5px 6px -7px rgba(0, 0, 0, 0.6), 0 2px 4px -5px rgba(0, 0, 0, 0.06)",
        soft: "0 18px 45px rgba(15, 23, 42, 0.08)",
        card: "0 14px 35px rgba(15, 23, 42, 0.06)",
        glow: "0 18px 30px rgba(199, 19, 32, 0.14)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      colors: {
        brandRed: "#C71320", // ✅ custom color alias
        brandRedSoft: "#FFF1F2",
        surfaceSoft: "#F8FAFC",
        inkDark: "#0F172A",
        brandLight: "rgb(228, 203, 206)",
        brandDisable: "#b9656a",
        brandHover: "#A80F1A",
      },
      backgroundImage: {
        "app-shell":
          "radial-gradient(circle at top right, rgba(199,19,32,0.08), transparent 28%), linear-gradient(180deg, #FFF7F8 0%, #F8FAFC 35%, #F8FAFC 100%)",
        "brand-red": "linear-gradient(135deg, #C71320 0%, #EF4444 100%)",
      },
    },
  },
});
