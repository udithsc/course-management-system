import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from '../store/configureStore';

// Custom render function to wrap components with Redux and Router
export function renderWithProviders(ui, { preloadedState = {}, store = null, route = '/' } = {}) {
  const finalStore = store || configureStore();
  
  if (!store && Object.keys(preloadedState).length > 0) {
    // Basic preloaded state simulation
    // Since configureStore in this app creates an empty store without initial state param readily exposed
    // In a real app we'd pass preloadedState to configureStore directly
  }

  window.history.pushState({}, 'Test page', route);

  return {
    ...render(
      <Provider store={finalStore}>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </Provider>
    ),
    store: finalStore,
  };
}
