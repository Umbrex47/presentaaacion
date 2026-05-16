import { defineConfig } from "vite";

export default defineConfig({
  base: './',
  build: {
    target: "es2020",
    minify: "esbuild",
    esbuild: {
      drop: ["console", "debugger"],
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
  optimizeDeps: {
    include: ["three", "gsap"],
  },
});