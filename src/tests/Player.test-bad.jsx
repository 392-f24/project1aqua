import { describe, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Podcast from '../components/Podcast';
import SignOutNav from '../components/SignOutNav';
import Player from '../components/Player';
import { useParams } from 'react-router-dom';

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useParams: vi.fn(),
  useNavigate: vi.fn(() => vi.fn()), // Mock useNavigate
}));

describe('Podcast Navigation and Audio Playback', () => {
  const mockAudio = {
    play: vi.fn(),
    pause: vi.fn(),
    src: '',
  };

  beforeEach(() => {
    global.Audio = vi.fn(() => mockAudio);
    // Mock useParams to provide category data
    //useParams.mockReturnValue({ category: 'Technology' });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('pauses audio when navigating back via the SignOutNav logo', async () => {
    render(
      <MemoryRouter initialEntries={['/podcast/Technology']}>
        <Routes>
          <Route path="/podcast/technology" element={<Podcast />} />
        </Routes>
      </MemoryRouter>
    );

    // Ensure play button exists and simulate click
    const playButton = await screen.findByRole('button', { name: /play/i });
    fireEvent.click(playButton);
    expect(mockAudio.play).toHaveBeenCalled();

    // Ensure logo exists and simulate click
    const logoButton = screen.getByRole('button', { name: /click to go to category/i });
    fireEvent.click(logoButton);

    // Verify audio paused when navigating
    expect(mockAudio.pause).toHaveBeenCalled();
  });

  it('toggles play/pause state when the play button is clicked', async () => {
    render(
      <MemoryRouter>
        <Player />
      </MemoryRouter>
    );

    const playButton = await screen.findByRole('button', { name: /play/i });

    // Simulate play
    fireEvent.click(playButton);
    expect(mockAudio.play).toHaveBeenCalled();

    // Simulate pause
    fireEvent.click(playButton);
    expect(mockAudio.pause).toHaveBeenCalled();
  });
});

