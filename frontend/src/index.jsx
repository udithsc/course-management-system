import React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import App from './App';
import { ColorModeProvider } from './ColorModeProvider';
import configureStore from './store/configureStore';
import GlobalErrorBoundary from './components/layout/GlobalErrorBoundary';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import '@fontsource/inter';
import '@fontsource/outfit';

const container = document.getElementById('root');
const root = createRoot(container);
const store = configureStore();

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ColorModeProvider>
          <CssBaseline />
          <GlobalErrorBoundary>
            <App />
          </GlobalErrorBoundary>
          <ToastContainer />
        </ColorModeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
