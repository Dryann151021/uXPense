import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionList from '../TransactionList.jsx';

const transactions = [
  {
    id: 'expense-1',
    category: 'Food',
    amount: 50000,
    description: 'Lunch',
    date: '2024-06-07',
  },
  {
    id: 'expense-2',
    category: 'Transport',
    amount: 30000,
    description: 'Taxi',
    date: '2024-06-06',
  },
];

describe('TransactionList', () => {
  it('should show loading state when loading is true', () => {
    render(<TransactionList loading={true} transactions={[]} />);

    expect(screen.getByText(/memuat pengeluaran/i)).toBeInTheDocument();
  });

  it('should show error state when error is provided', () => {
    render(
      <TransactionList loading={false} error="Test error" transactions={[]} />,
    );

    expect(screen.getByText(/test error/i)).toBeInTheDocument();
  });

  it('should render transactions and total amount', () => {
    render(
      <TransactionList
        loading={false}
        error={null}
        transactions={transactions}
      />,
    );

    expect(screen.getByText(/lunch/i)).toBeInTheDocument();
    expect(screen.getByText(/taxi/i)).toBeInTheDocument();
    expect(screen.getByText(/total pengeluaran/i)).toBeInTheDocument();
    expect(screen.getByText(/80.000/i)).toBeInTheDocument();
  });

  it('should filter transactions by category', async () => {
    render(
      <TransactionList
        loading={false}
        error={null}
        transactions={transactions}
      />,
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    await userEvent.selectOptions(select, 'Food');

    expect(screen.getByText(/lunch/i)).toBeInTheDocument();
    expect(screen.queryByText(/taxi/i)).not.toBeInTheDocument();
  });
});
