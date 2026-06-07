import { describe, it, expect, vi, beforeEach } from 'vitest';
import client from '../client.js';
import { expenseApi } from '../expenses.js';

vi.mock('../client.js', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('expenseApi', () => {
  beforeEach(() => {
    client.get.mockReset();
    client.post.mockReset();
    client.put.mockReset();
    client.delete.mockReset();
  });

  it('should create expense with payload and return response data', async () => {
    client.post.mockResolvedValue({
      data: { data: { expenseId: 'expense-1' } },
    });

    const payload = {
      amount: 50000,
      description: 'Lunch',
      category: 'Food',
      date: '2024-06-07',
    };

    const result = await expenseApi.createExpense(payload);

    expect(client.post).toHaveBeenCalledWith('/expenses', payload);
    expect(result).toEqual({ expenseId: 'expense-1' });
  });

  it('should fetch expenses list', async () => {
    client.get.mockResolvedValue({
      data: { data: { expenses: [{ id: 'expense-1' }] } },
    });

    const result = await expenseApi.getExpenses();

    expect(client.get).toHaveBeenCalledWith('/expenses');
    expect(result).toEqual([{ id: 'expense-1' }]);
  });

  it('should fetch expense by id', async () => {
    client.get.mockResolvedValue({
      data: { data: { expense: { id: 'expense-1' } } },
    });

    const result = await expenseApi.getExpenseById('expense-1');

    expect(client.get).toHaveBeenCalledWith('/expenses/expense-1');
    expect(result).toEqual({ id: 'expense-1' });
  });

  it('should update expense by id', async () => {
    client.put.mockResolvedValue({
      data: { data: { expenseId: 'expense-1' } },
    });

    const payload = {
      amount: 30000,
      description: 'Taxi',
      category: 'Transport',
      date: '2024-06-07',
    };

    const result = await expenseApi.editExpense('expense-1', payload);

    expect(client.put).toHaveBeenCalledWith('/expenses/expense-1', payload);
    expect(result).toEqual({ expenseId: 'expense-1' });
  });

  it('should delete expense by id', async () => {
    client.delete.mockResolvedValue({
      data: { data: { expenseId: 'expense-1' } },
    });

    const result = await expenseApi.deleteExpense('expense-1');

    expect(client.delete).toHaveBeenCalledWith('/expenses/expense-1');
    expect(result).toEqual({ expenseId: 'expense-1' });
  });
});
