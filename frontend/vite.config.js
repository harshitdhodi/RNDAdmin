import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import viteCompression from "vite-plugin-compression";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    
    // SVGR Configuration
    svgr({
      svgrOptions: {
        icon: true, // This will optimize SVG files for icon usage
        ref: true,
      },
    }),
    
    // Compression - both Brotli and gzip
    viteCompression({ algorithm: "brotliCompress" }), // Brotli compression
    viteCompression({ algorithm: "gzip" }), // Also add gzip for broader compatibility
    
    // PWA Configuration
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Vite PWA Project",
        short_name: "Vite PWA",
        theme_color: "#ffffff",
        icons: [
          { src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        runtimeCaching: [
          {
            urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif|pdf)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "large-assets",
              expiration: { maxEntries: 10, maxAgeSeconds: 7 * 24 * 60 * 60 },
            },
          },
          {
            urlPattern: /.*\.(?:js|css)/,
            handler: "NetworkFirst",
            options: {
              cacheName: "static-resources",
            },
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        "service-worker": "./public/service-worker.js",
      },
      output: {
        manualChunks: {
          // Splitting Vendor JS to optimize loading
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
    chunkSizeWarningLimit: 800, // Reduce chunk size warning to keep JS lightweight
    target: "esnext", // Optimize JS for modern browsers
    minify: "esbuild", // Fast and efficient minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs for smaller JS files
      },
    },
  },

  server: {
    port: 3000,
    headers: {
      "Service-Worker-Allowed": "/",
    },
    proxy: {
      "/api": {
        target: "http://localhost:3028",
        changeOrigin: false,
        secure: false,
      },
    },
  },

  base: "/",
});