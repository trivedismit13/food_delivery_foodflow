import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import { useLogin } from '../queries/auth';

vi.mock('../queries/auth', () => ({
  useLogin: vi.fn(),
}));

describe('AdminLoginPage', () => {
  it('renders login form', () => {
    (useLogin as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    render(
      <MemoryRouter>
        <AdminLoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Portal')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('admin@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('calls useLogin mutation on submit', async () => {
    const mockMutate = vi.fn();
    (useLogin as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    render(
      <MemoryRouter>
        <AdminLoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('admin@example.com'), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for async validation (zod) to finish
    await vi.waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({ email: 'admin@example.com', password: 'password123' });
    });
  });
});
