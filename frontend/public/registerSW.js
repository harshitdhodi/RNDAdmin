// Instead of importing and registering SW directly in your main.jsx
// Create a separate file that will be loaded with defer

// public/registerSW.js
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    });
  }
  
  // This script will be loaded after the initial page render
  // The service worker registration won't block the first paint