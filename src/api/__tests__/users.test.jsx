import { describe, it, expect, vi, beforeEach } from 'vitest';
import client from '../client.js';
import { usersApi } from '../users.js';

vi.mock('../client.js', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('usersApi', () => {
  beforeEach(() => {
    client.get.mockReset();
  });

  it('should fetch all users', async () => {
    client.get.mockResolvedValue({ data: { data: [{ id: 'u1' }] } });

    const result = await usersApi.getAll();

    expect(client.get).toHaveBeenCalledWith('/users');
    expect(result).toEqual([{ id: 'u1' }]);
  });

  it('should fetch user by id', async () => {
    client.get.mockResolvedValue({ data: { data: { id: 'u1' } } });

    const result = await usersApi.getById('u1');

    expect(client.get).toHaveBeenCalledWith('/users/u1');
    expect(result).toEqual({ id: 'u1' });
  });
});
