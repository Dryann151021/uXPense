import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../AuthProvider.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import { authApi } from '../../api/auth.js';

vi.mock('../../api/auth.js', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    refreshToken: vi.fn(),
    logout: vi.fn(),
  },
}));

afterEach(() => {
  localStorage.clear();
  document.cookie = '';
  vi.clearAllMocks();
});

describe('AuthProvider', () => {
  function TestComponent() {
    const { isAuthenticated, login } = useAuth();

    return (
      <div>
        <span data-testid="auth-status">
          {isAuthenticated ? 'true' : 'false'}
        </span>
        <button onClick={() => login('john', 'secret')}>Login</button>
      </div>
    );
  }

  beforeEach(() => {
    authApi.login.mockResolvedValue({
      accessToken: 'access-123',
      refreshToken: 'refresh-456',
    });
    document.cookie = '';
  });

  it('should update auth state after login', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('false');

    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(authApi.login).toHaveBeenCalledWith('john', 'secret');
    await screen.findByText('true');
    expect(screen.getByTestId('auth-status')).toHaveTextContent('true');
  });
});
