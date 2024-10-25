/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: "Roboto Mono, monospace", //we overrided the fontfamily sans in the tailwind. or we can give any name else like pizza for example and use it in certain places.
    },
    // fontSize: {
    //   huge: ["80rem", { lineHeight: "1" }],
    // }, // this will make all the fontsizes we are using from Tailwind never exists as we in here we overrode it with this.

    extend: {
      colors: {
        pizza: "#123456",
      },
      // we added a new color to the tailwind colors, can use it as className="bg-pizza"
      // extend => keep the original things of Tailwind but add our own ones, theme => overrides everything in that category.
      height: {
        screen: "100dvh", // dvh(dynamic viewport height) instead of vh, as it solve the problem of 100vh on mobile screens as vh on mobile sometimes it's not really 100%.
      }, // we override the existing tailwing screen. to give 100dvh instead of 100vh.
    },
  },
  plugins: [],
};
