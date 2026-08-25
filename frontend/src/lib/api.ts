import axios, { AxiosError, AxiosResponse } from 'axios'
import { useAuthStore } from '@/store/authStore'

const BASE_URL = import.meta.env.VITE_APP_ENV === 'development'
  ? '/api'
  : import.meta.env.VITE_API_BASE_URL

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── REQUEST INTERCEPTOR ───────────────────────────────────────────────────

apiClient.interceptors.request.use(
  (config) => {
    // Attach JWT to every request if token exists
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── RESPONSE INTERCEPTOR ─────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Backend always returns { success, status, message, data, errors, timestamp }
    // Unwrap the .data field so query functions receive T directly
    // not ApiResponse<T>
    
    const apiResponse = response.data
    
    if (apiResponse && typeof apiResponse === 'object' && 'data' in apiResponse) {
      // Return the unwrapped data
      // TanStack Query receives T, not ApiResponse<T>
      response.data = apiResponse.data
    }
    
    return response
  },
  (error: AxiosError) => {
    const response = error.response
    
    if (!response) {
      // Network error — backend not running
      throw new NetworkError('Cannot connect to server. Please try again.')
    }
    
    const apiResponse = response.data as any
    
    // ── 401 Unauthorized ──────────────────────────────────────────────
    if (response.status === 401) {
      // Token expired or invalid
      // Clear auth state and let ProtectedRoute handle redirection to login
      useAuthStore.getState().logout()
      throw new AuthError('Session expired. Please sign in again.')
    }
    
    // ── 403 Forbidden ─────────────────────────────────────────────────
    if (response.status === 403) {
      throw new ForbiddenError(
        apiResponse?.message || 'You do not have permission to do this.'
      )
    }
    
    // ── 404 Not Found ─────────────────────────────────────────────────
    if (response.status === 404) {
      throw new NotFoundError(
        apiResponse?.message || 'Resource not found.'
      )
    }
    
    // ── 400 Validation Error ───────────────────────────────────────────
    if (response.status === 400) {
      const validationErrors = apiResponse?.errors || {}
      throw new ValidationError(
        apiResponse?.message || 'Invalid request.',
        validationErrors
        // { fieldName: "error message", ... }
      )
    }
    
    // ── 409 Conflict ──────────────────────────────────────────────────
    if (response.status === 409) {
      throw new ConflictError(
        apiResponse?.message || 'Conflict with existing data.'
      )
    }
    
    // ── 500 Server Error ──────────────────────────────────────────────
    throw new ServerError(
      apiResponse?.message || 'Something went wrong. Please try again.'
    )
  }
)

// ─── CUSTOM ERROR CLASSES ────────────────────────────────────────────────

export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends Error {
  fieldErrors: Record<string, string>
  constructor(message: string, fieldErrors: Record<string, string>) {
    super(message)
    this.name = 'ValidationError'
    this.fieldErrors = fieldErrors
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConflictError'
  }
}

export class ServerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ServerError'
  }
}

