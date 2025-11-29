<<<<<<< HEAD
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
=======
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
>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
  // The service worker registration won't block the first paint