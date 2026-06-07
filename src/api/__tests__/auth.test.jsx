import { describe, it, expect, vi, beforeEach } from 'vitest';
import client from '../client.js';
import { authApi } from '../auth.js';

vi.mock('../client.js', () => ({
  default: {
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('authApi', () => {
  beforeEach(() => {
    client.post.mockReset();
    client.put.mockReset();
    client.delete.mockReset();
  });

  it('should send login request and return token data', async () => {
    client.post.mockResolvedValue({
      data: {
        data: { accessToken: 'access-123', refreshToken: 'refresh-456' },
      },
    });

    const result = await authApi.login('john', 'secret');

    expect(client.post).toHaveBeenCalledWith('/authentications', {
      username: 'john',
      password: 'secret',
    });
    expect(result).toEqual({
      accessToken: 'access-123',
      refreshToken: 'refresh-456',
    });
  });

  it('should send register request and return created user data', async () => {
    client.post.mockResolvedValue({ data: { data: { id: 'user-1' } } });

    const result = await authApi.register('john', 'John Doe', 'secret');

    expect(client.post).toHaveBeenCalledWith('/users', {
      username: 'john',
      fullname: 'John Doe',
      password: 'secret',
    });
    expect(result).toEqual({ id: 'user-1' });
  });

  it('should refresh access token using refresh token', async () => {
    client.put.mockResolvedValue({
      data: { data: { accessToken: 'new-access' } },
    });

    const result = await authApi.refreshToken('refresh-456');

    expect(client.put).toHaveBeenCalledWith('/authentications', {
      refreshToken: 'refresh-456',
    });
    expect(result).toEqual({ accessToken: 'new-access' });
  });

  it('should send logout request with refresh token', async () => {
    client.delete.mockResolvedValue({ data: { status: 'success' } });

    const result = await authApi.logout('refresh-456');

    expect(client.delete).toHaveBeenCalledWith('/authentications', {
      data: { refreshToken: 'refresh-456' },
    });
    expect(result).toEqual({ status: 'success' });
  });
});
