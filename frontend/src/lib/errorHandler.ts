import { toast } from 'sonner'
import { 
  NetworkError, AuthError, ForbiddenError,
  NotFoundError, ValidationError, ConflictError, ServerError 
} from './api'

// Single function to handle any error from any API call
// Used in mutation onError callbacks and query error handlers

export function handleApiError(error: unknown, context?: string): void {
  
  if (error instanceof NetworkError) {
    toast.error('Connection failed', {
      description: 'Make sure the server is running and try again.',
    })
    return
  }

  if (error instanceof AuthError) {
    // Redirect already handled in interceptor
    // Just show a toast
    toast.error('Session expired', {
      description: 'Please sign in again.',
    })
    return
  }

  if (error instanceof ForbiddenError) {
    toast.error('Access denied', {
      description: error.message,
    })
    return
  }

  if (error instanceof NotFoundError) {
    toast.error('Not found', {
      description: error.message,
    })
    return
  }

  if (error instanceof ValidationError) {
    // For forms: return field errors to be set on form
    // For non-form contexts: show as toast
    if (context === 'form') return // handled by form itself
    
    const firstError = Object.values(error.fieldErrors)[0]
    toast.error(error.message, {
      description: firstError,
    })
    return
  }

  if (error instanceof ConflictError) {
    toast.error('Already exists', {
      description: error.message,
    })
    return
  }

  if (error instanceof ServerError) {
    toast.error('Something went wrong', {
      description: 'We\'re looking into it. Please try again shortly.',
    })
    return
  }

  // Unknown error
  console.error('Unhandled error:', error)
  toast.error('Unexpected error', {
    description: 'Please refresh the page and try again.',
  })
}

// Helper for React Hook Form + ValidationError integration
export function applyValidationErrors(
  error: unknown,
  setError: (field: string, error: { message: string }) => void
): boolean {
  if (error instanceof ValidationError) {
    Object.entries(error.fieldErrors).forEach(([field, message]) => {
      setError(field, { message })
    })
    return true
  }
  return false
}
