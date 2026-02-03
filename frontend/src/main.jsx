import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';  // Import Provider
import store from './store/store';             // Import your Redux store
import './index.css';
import App from './App.jsx';
import { ConfigProvider } from "antd";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
   <ConfigProvider
  theme={{
    token: {
      colorPrimary: "#ebb207",
    },
    components: {
      Pagination: {
        itemActiveBg: "#ffffff",
      },
    },
  }}
>
  <App />
</ConfigProvider>

    </Provider>
  </StrictMode>
);
