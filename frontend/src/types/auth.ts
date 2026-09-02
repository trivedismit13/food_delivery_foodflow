export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN';

import { CreatorSummary } from './creator';

export interface AuthResponse {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
  token: string;
  expiresIn: number;
  tokenType: string;
  creatorProfile?: CreatorSummary;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: UserRole;
}
