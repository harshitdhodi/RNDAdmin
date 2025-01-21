/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    mimeTypes: {
      "application/javascript": ["js"],
    },
    proxy: {
      "/api": {
        target: "http://localhost:3028",
        changeOrigin: true, // Ensures proper handling of CORS
        secure:false
          },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Shortcut for src directory
      // Optional alias if replacing next/image (remove if unnecessary)
      "next/image": "path-to-image-replacement",
      react: "react", // Ensures correct react resolution
      "react-hook-form": "react-hook-form", // Ensures correct react-hook-form resolution
    },
  },
  optimizeDeps: {
    include: ["@tinymce/tinymce-react"], // Pre-bundle for faster builds
  },
})
