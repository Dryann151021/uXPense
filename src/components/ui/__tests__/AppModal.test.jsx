import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppModal from '../AppModal.jsx';

describe('AppModal', () => {
  it('renders title, description, and action buttons', () => {
    render(
      <AppModal
        isOpen
        title="Tersimpan"
        description="Data telah berhasil disimpan"
        confirmLabel="OK"
        cancelLabel="Batal"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/tersimpan/i)).toBeInTheDocument();
    expect(
      screen.getByText(/data telah berhasil disimpan/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /batal/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
  });

  it('hides the cancel button when showCancel is false', () => {
    render(
      <AppModal
        isOpen
        title="Login berhasil"
        confirmLabel="Lanjutkan"
        showCancel={false}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole('button', { name: /batal/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /lanjutkan/i }),
    ).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    const onConfirm = vi.fn();
    render(
      <AppModal
        isOpen
        title="Konfirmasi"
        confirmLabel="Ya"
        cancelLabel="Tidak"
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: /ya/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking overlay background', () => {
    const onClose = vi.fn();
    render(
      <AppModal
        isOpen
        title="Keluar"
        description="Apakah Anda yakin?"
        confirmLabel="Ya"
        cancelLabel="Tidak"
        onClose={onClose}
      />,
    );

    fireEvent.mouseDown(screen.getByRole('presentation'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders disabled confirm button when confirmDisabled is true', () => {
    render(
      <AppModal
        isOpen
        title="Penting"
        confirmLabel="Simpan"
        showCancel={false}
        confirmDisabled
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: /simpan/i })).toBeDisabled();
  });
});
