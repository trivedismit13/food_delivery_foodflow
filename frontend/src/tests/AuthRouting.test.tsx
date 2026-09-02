import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

// Mock auth store
vi.mock('../store/authStore', () => ({
  useAuthStore: vi.fn((selector) => {
    const state = globalThis.__mockAuthState || { isAuthenticated: false, user: null, isLoading: false };
    return selector ? selector(state) : state;
  })
}));

describe('Role-Aware Routing', () => {
  it('redirects unauthorized users to login', () => {
    globalThis.__mockAuthState = { isAuthenticated: false, user: null };
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoute allowedRoles={['SELLER']}>
          <div>Dashboard Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument();
  });

  it('allows SELLER to access seller routes', () => {
    globalThis.__mockAuthState = { 
      isAuthenticated: true, 
      user: { role: 'SELLER' } 
    };
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoute allowedRoles={['SELLER']}>
          <div>Seller Dashboard Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText('Seller Dashboard Content')).toBeInTheDocument();
  });

  it('rejects CUSTOMER from seller routes', () => {
    globalThis.__mockAuthState = { 
      isAuthenticated: true, 
      user: { role: 'CUSTOMER' } 
    };
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoute allowedRoles={['SELLER']}>
          <div>Seller Dashboard Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.queryByText('Seller Dashboard Content')).not.toBeInTheDocument();
  });
});
