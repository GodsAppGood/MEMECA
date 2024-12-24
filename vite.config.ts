import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    historyApiFallback: {
      disableDotRule: true
    },
    https: {
      cert: undefined,
      key: undefined,
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    port: 8080,
    host: true,
    strictPort: true,
    https: {
      cert: undefined,
      key: undefined,
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
}));