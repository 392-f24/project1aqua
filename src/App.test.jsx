import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Category from './components/Category.jsx';
import { useNavigate } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';

// Set the Firebase project ID from the environment variable
process.env.FIREBASE_PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID;

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Category Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('navigates to the Technology page when Technology category is clicked', () => {
    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );

    const technologyButton = screen.getByText(/Technology/i);

    expect(technologyButton).toBeTruthy();

    fireEvent.click(technologyButton);

    expect(mockNavigate).toHaveBeenCalledWith('/podcast/Technology');
  });

  it('renders a summary under the Technology category button', async () => {
    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );

    const technologyButton = screen.getByText(/Technology/i);

    expect(technologyButton).toBeTruthy();

    const buttonElement = technologyButton.closest('button');
    expect(buttonElement).toBeTruthy();
    const summaryParagraph = buttonElement.querySelector('p.small-summary');
    expect(summaryParagraph).toBeTruthy();
    expect(summaryParagraph.textContent).not.toBe('');
  });
});