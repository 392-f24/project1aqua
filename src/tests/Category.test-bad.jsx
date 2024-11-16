import { describe, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Category from '../components/Category';
import { storage } from '../components/firebaseConfig';
import { ref, getDownloadURL, listAll } from 'firebase/storage';

vi.mock('firebase/storage', () => ({
    ref: vi.fn(),
    getDownloadURL: vi.fn(),
    listAll: vi.fn(),
}));

vi.mock('../components/firebaseConfig', () => ({
    storage: {},
}));

describe('Category Component', () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.mock('react-router-dom', async () => ({
            ...(await vi.importActual('react-router-dom')),
            useNavigate: () => mockNavigate,
        }));

        // Mock Firebase listAll and getDownloadURL to return predictable data
        listAll.mockResolvedValue({
            prefixes: [
                { name: 'Music_2024_11_01_12_00_00', fullPath: 'Music_2024_11_01_12_00_00' },
            ],
        });

        getDownloadURL.mockResolvedValue('https://example.com/smallsummary.txt');

        global.fetch = vi.fn().mockResolvedValue({
            text: vi.fn().mockResolvedValue('This is a music podcast summary.'),
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('renders the category buttons correctly', () => {
        render(
            <MemoryRouter>
                <Category />
            </MemoryRouter>
        );

        ['Sports', 'Technology', 'Music', 'News'].forEach((category) => {
            const button = screen.getByRole('button', { name: new RegExp(category, 'i') });
            expect(button).toBeInTheDocument();
        });
    });

    it('navigates to the correct podcast page when Music category is clicked', async () => {
        render(
            <MemoryRouter initialEntries={['/category']}>
                <Routes>
                    <Route path="/category" element={<Category />} />
                </Routes>
            </MemoryRouter>
        );

        const musicButton = screen.getByRole('button', { name: /Music/i });
        fireEvent.click(musicButton);

        expect(mockNavigate).toHaveBeenCalledWith('/podcast/Music');
    });

    it('displays only a music podcast summary when Music category is clicked', async () => {
        render(
            <MemoryRouter>
                <Category />
            </MemoryRouter>
        );

        const musicSummary = await screen.findByText('This is a music podcast summary.');
        expect(musicSummary).toBeInTheDocument();
    });
});
