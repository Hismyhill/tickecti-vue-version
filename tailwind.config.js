import sharedConfig from "../shared-assets/tailwind.config.js";

/** @type {import('@tailwindcss/vite').Config} */
export default {
  ...sharedConfig,
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
  theme: {
    extend: {
      ...sharedConfig.theme.extend,
      // Vue-specific customizations can go here
    },
  },
};
