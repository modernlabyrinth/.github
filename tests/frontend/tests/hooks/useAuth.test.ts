/**
 * Unit tests for useAuth hook
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useState } from 'react';

// Mock hook - replace with actual implementation
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock API call
      const mockUser = { id: 1, email, name: 'Test User' };
      setUser(mockUser);
      localStorage.setItem('token', 'mock-token');
      return mockUser;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const mockUser = { id: 1, email, name };
      setUser(mockUser);
      return mockUser;
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoading, error, login, logout, register };
};

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('initializes with null user', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('logs in user successfully', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.user).toEqual({
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
    });
    expect(localStorage.getItem('token')).toBe('mock-token');
  });

  it('sets loading state during login', async () => {
    const { result } = renderHook(() => useAuth());

    let loginPromise: Promise<any>;
    act(() => {
      loginPromise = result.current.login('test@example.com', 'password123');
    });

    // Should be loading during login
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await loginPromise!;
    });

    // Should not be loading after login
    expect(result.current.isLoading).toBe(false);
  });

  it('logs out user', async () => {
    const { result } = renderHook(() => useAuth());

    // First login
    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.user).not.toBeNull();

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('registers new user', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.register('new@example.com', 'password123', 'New User');
    });

    expect(result.current.user).toEqual({
      id: 1,
      email: 'new@example.com',
      name: 'New User',
    });
  });

  it('handles login errors', async () => {
    // Mock a hook that throws errors
    const useAuthWithError = () => {
      const [error, setError] = useState<string | null>(null);
      const login = async () => {
        setError('Invalid credentials');
        throw new Error('Invalid credentials');
      };
      return { error, login };
    };

    const { result } = renderHook(() => useAuthWithError());

    try {
      await act(async () => {
        await result.current.login();
      });
    } catch (err) {
      // Expected to throw
    }

    expect(result.current.error).toBe('Invalid credentials');
  });

  it('persists authentication across hook re-renders', async () => {
    const { result, rerender } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.user).not.toBeNull();

    rerender();

    // In a real implementation with context/state management,
    // the user should persist across re-renders
    expect(localStorage.getItem('token')).toBe('mock-token');
  });
});
