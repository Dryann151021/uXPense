import client from './client.js';

export const budgetApi = {
  createBudget: async (payload) => {
    const response = await client.post('/budgets', payload);
    return response.data.data;
  },

  getBudgets: async () => {
    const response = await client.get('/budgets');
    return response.data.data.budgets;
  },

  getBudgetById: async (id) => {
    const response = await client.get(`/budgets/${id}`);
    return response.data.data.budget;
  },

  updateBudget: async (id, payload) => {
    const response = await client.put(`/budgets/${id}`, payload);
    return response.data.data;
  },

  deleteBudget: async (id) => {
    const response = await client.delete(`/budgets/${id}`);
    return response.data.data;
  },
};
