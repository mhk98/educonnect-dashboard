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
        glow: "0 18px 30px rgba(27, 46, 107, 0.14)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      colors: {
        brandBlue: "#1B2E6B",
        brandBlueSoft: "#EFF6FF",
        surfaceSoft: "#F8FAFC",
        inkDark: "#0F172A",
        brandLight: "rgb(203, 219, 245)",
        brandDisable: "#6B8FD6",
        brandHover: "#142558",
      },
      backgroundImage: {
        "app-shell":
          "radial-gradient(circle at top right, rgba(33,150,243,0.08), transparent 28%), linear-gradient(180deg, #F0F7FF 0%, #F8FAFC 35%, #F8FAFC 100%)",
        "brand-blue": "linear-gradient(135deg, #1B2E6B 0%, #2196F3 100%)",
      },
    },
  },
});
