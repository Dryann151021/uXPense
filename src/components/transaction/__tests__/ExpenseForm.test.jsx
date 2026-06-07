import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpenseForm from '../ExpenseForm.jsx';

describe('ExpenseForm', () => {
  it('should submit payload with number amount and selected date', async () => {
    const onSubmit = vi.fn().mockResolvedValue({ success: true });
    render(<ExpenseForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/kategori/i), {
      target: { value: 'Food' },
    });
    fireEvent.change(screen.getByLabelText(/jumlah/i), {
      target: { value: '75000' },
    });
    fireEvent.change(screen.getByLabelText(/deskripsi/i), {
      target: { value: 'Makan siang' },
    });
    fireEvent.change(screen.getByLabelText(/tanggal/i), {
      target: { value: '2024-06-07' },
    });

    await userEvent.click(
      screen.getByRole('button', { name: /catat pengeluaran/i }),
    );

    expect(onSubmit).toHaveBeenCalledWith({
      category: 'Food',
      amount: 75000,
      description: 'Makan siang',
      date: '2024-06-07',
    });
    expect(
      await screen.findByText(/pengeluaran berhasil ditambahkan/i),
    ).toBeInTheDocument();
  });

  it('should display error message when submit fails', async () => {
    const onSubmit = vi
      .fn()
      .mockResolvedValue({ success: false, error: 'Gagal server' });
    render(<ExpenseForm onSubmit={onSubmit} />);

    await userEvent.selectOptions(screen.getByLabelText(/kategori/i), 'Food');
    await userEvent.type(screen.getByLabelText(/jumlah/i), '50000');
    await userEvent.click(
      screen.getByRole('button', { name: /catat pengeluaran/i }),
    );

    expect(await screen.findByText(/gagal server/i)).toBeInTheDocument();
  });
});
