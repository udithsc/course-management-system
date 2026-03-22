import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '../test-utils';
import NotFound from '../../components/layout/NotFound';

describe('NotFound component', () => {
  it('renders a 404 message by default', () => {
    // 1. Render the component wrapped with store/router
    renderWithProviders(<NotFound />);

    // 2. Query the DOM
    const title = screen.getByText('404');
    const subtitle = screen.getByText('Page Not Found');
    
    // 3. Assert
    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
  });
});

