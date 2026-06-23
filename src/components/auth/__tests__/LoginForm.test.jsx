import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../LoginForm.jsx';
import { useAuth } from '../../../hooks/useAuth.jsx';

vi.mock('../../../hooks/useAuth.jsx', () => ({
  useAuth: vi.fn(),
}));

describe('LoginForm', () => {
  const loginMock = vi.fn();

  beforeEach(() => {
    loginMock.mockReset();
    useAuth.mockReturnValue({ login: loginMock });
  });

  it('toggles password visibility when the eye button is clicked', async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByLabelText(/^Password$/i, {
      selector: 'input',
    });
    const toggleButton = screen.getByRole('button', {
      name: /tampilkan password|sembunyikan password/i,
    });

    expect(passwordInput).toHaveAttribute('type', 'password');

    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('shows the success modal after a successful login', async () => {
    loginMock.mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    await userEvent.type(screen.getByLabelText(/username/i), 'john');
    await userEvent.type(
      screen.getByLabelText(/^Password$/i, { selector: 'input' }),
      'secret',
    );
    await userEvent.click(screen.getByRole('button', { name: /masuk/i }));

    expect(loginMock).toHaveBeenCalledWith('john', 'secret');
    expect(await screen.findByText(/login berhasil/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /masuk dashboard/i }),
    ).toBeInTheDocument();
  });

  it('displays an error message when login fails', async () => {
    loginMock.mockResolvedValue({
      success: false,
      error: 'Username atau password salah',
    });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    await userEvent.type(screen.getByLabelText(/username/i), 'john');
    await userEvent.type(
      screen.getByLabelText(/^Password$/i, { selector: 'input' }),
      'wrongpass',
    );
    await userEvent.click(screen.getByRole('button', { name: /masuk/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /username atau password salah/i,
    );
  });
});
