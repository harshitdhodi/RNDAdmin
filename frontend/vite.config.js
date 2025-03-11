/* eslint-disable no-undef */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';
import compression from 'vite-plugin-compression';
import babel from '@rollup/plugin-babel';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    compression({
      algorithm: "gzip",
      threshold: 1024,
    }),
    babel({
      babelHelpers: 'bundled',
      compact: true,
      plugins: [
        ["import", { libraryName: "antd", libraryDirectory: "es", style: "css" }, "antd"]
      ]
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      react: path.resolve(__dirname, "node_modules/react"),
      "react-is": path.resolve(__dirname, "node_modules/react-is"),
      "react-hook-form": "react-hook-form",
      // Explicitly resolve classnames to ensure compatibility
      classnames: path.resolve(__dirname, "node_modules/classnames"),
    },
  },
  optimizeDeps: {
    include: ["react-is", "rc-util", "classnames"], // Include classnames for pre-bundling
    exclude: ["antd"], // Keep antd excluded if needed
  },
  server: {
    mimeTypes: {
      "application/javascript": ["js"],
    },
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:3028",
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("lucide-react")) return "lucide";
            if (id.includes("@ant-design/icons")) return "ant-design-icons";
            return id.split("node_modules/")[1].split("/")[0];
          }
        }
      }
    }
  }
}); 