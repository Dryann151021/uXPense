import client from './client.js';

export const expenseApi = {
  createExpense: async (payload) => {
    const response = await client.post('/expenses', payload);
    return response.data.data;
  },

  getExpenses: async () => {
    const response = await client.get('/expenses');
    return response.data.data.expenses;
  },

  getExpenseById: async (id) => {
    const response = await client.get(`/expenses/${id}`);
    return response.data.data.expense;
  },

  editExpense: async (id, payload) => {
    const response = await client.put(`/expenses/${id}`, payload);
    return response.data.data;
  },

  deleteExpense: async (id) => {
    const response = await client.delete(`/expenses/${id}`);
    return response.data.data;
  },
};
