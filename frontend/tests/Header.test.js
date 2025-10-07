import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../src/components/Header';

describe('Header', () => {
  it('affiche le titre principal', () => {
    render(<Header />);
    expect(screen.getByText(/pikkle/i)).toBeInTheDocument();
  });
});
