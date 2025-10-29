export default defineConfig({
  base: "/vue/",
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@shared": fileURLToPath(new URL("../shared-assets", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
});
