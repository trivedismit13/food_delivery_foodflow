import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

// Mock auth store
vi.mock('../store/authStore', () => ({
  useAuthStore: vi.fn((selector) => {
    const state = (globalThis as any).__mockAuthState || { isAuthenticated: false, user: null, isLoading: false };
    return selector ? selector(state) : state;
  })
}));

describe('Role-Aware Routing', () => {
  it('redirects unauthorized users to login', () => {
    (globalThis as any).__mockAuthState = { isAuthenticated: false, user: null };
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['SELLER']}>
              <div>Dashboard Content</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument();
  });

  it('allows SELLER to access seller routes', () => {
    (globalThis as any).__mockAuthState = { 
      isAuthenticated: true, 
      user: { role: 'SELLER' } 
    };
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['SELLER']}>
              <div>Seller Dashboard Content</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Seller Dashboard Content')).toBeInTheDocument();
  });

  it('rejects CUSTOMER from seller routes', () => {
    (globalThis as any).__mockAuthState = { 
      isAuthenticated: true, 
      user: { role: 'CUSTOMER' } 
    };
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['SELLER']}>
              <div>Seller Dashboard Content</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.queryByText('Seller Dashboard Content')).not.toBeInTheDocument();
  });
  it('allows ADMIN to access admin routes', () => {
    (globalThis as any).__mockAuthState = { 
      isAuthenticated: true, 
      user: { role: 'ADMIN' } 
    };
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <div>Admin Console</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Admin Console')).toBeInTheDocument();
  });

  it('rejects CUSTOMER from admin routes', () => {
    (globalThis as any).__mockAuthState = { 
      isAuthenticated: true, 
      user: { role: 'CUSTOMER' } 
    };
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <div>Admin Console</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.queryByText('Admin Console')).not.toBeInTheDocument();
  });

  it('rejects SELLER from admin routes', () => {
    (globalThis as any).__mockAuthState = { 
      isAuthenticated: true, 
      user: { role: 'SELLER' } 
    };
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <div>Admin Console</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.queryByText('Admin Console')).not.toBeInTheDocument();
  });
});
