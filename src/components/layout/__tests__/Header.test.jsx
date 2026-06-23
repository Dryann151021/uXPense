import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header.jsx';
import { useAuth } from '../../../hooks/useAuth.jsx';
import { useStreakContext } from '../../../hooks/useStreakContext.jsx';
import { useTheme } from '../../../hooks/useTheme.jsx';

vi.mock('../../../hooks/useAuth.jsx', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../../hooks/useStreakContext.jsx', () => ({
  useStreakContext: vi.fn(),
}));

vi.mock('../../../hooks/useTheme.jsx', () => ({
  useTheme: vi.fn(),
}));

describe('Header', () => {
  beforeEach(() => {
    const today = new Date();
    const todayStr = new Date(
      today.getTime() - today.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .split('T')[0];

    useAuth.mockReturnValue({
      logout: vi.fn(),
      user: { fullname: 'John Doe' },
    });

    useStreakContext.mockReturnValue({
      streak: { current: 2, lastExpenseDate: todayStr },
    });

    useTheme.mockReturnValue({ resolvedTheme: 'light' });
  });

  it('renders active navigation link for the current path', () => {
    render(
      <MemoryRouter initialEntries={['/budget']}>
        <Header />
      </MemoryRouter>,
    );

    const activeLink = screen.getByRole('link', { name: /budget/i });
    expect(activeLink.className).toContain('active');
  });

  it('opens profile dropdown and shows notification count when avatar is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <Header />
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByLabelText(/user profile/i));

    expect(screen.getByText(/notifikasi/i)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });
});
