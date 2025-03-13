// public/registerSW.js
// Use requestIdleCallback for non-critical operations
if ('serviceWorker' in navigator) {
  // Use requestIdleCallback or setTimeout to defer registration
  const registerSW = () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  };
  
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(registerSW, { timeout: 5000 });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(registerSW, 5000); // Delay registration by 5 seconds
  }
}