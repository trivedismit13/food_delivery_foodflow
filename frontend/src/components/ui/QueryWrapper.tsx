import React from 'react'
import { UseQueryResult } from '@tanstack/react-query'
import { Button } from './Button'

interface QueryWrapperProps<T> {
  query: UseQueryResult<T>
  loadingComponent?: React.ReactNode
  errorComponent?: (error: Error, retry: () => void) => React.ReactNode
  children: (data: T) => React.ReactNode
}

export function QueryWrapper<T>({ 
  query, 
  loadingComponent,
  errorComponent, 
  children 
}: QueryWrapperProps<T>) {
  
  if (query.isLoading) {
    return (loadingComponent as any) ?? <DefaultSkeleton />
  }
  
  if (query.isError) {
    const error = query.error as Error
    return errorComponent 
      ? (errorComponent(error, query.refetch) as any)
      : <DefaultError error={error} onRetry={query.refetch} />
  }
  
  if (!query.data) return null
  
  return (children(query.data) as any)
}

function DefaultSkeleton() {
  return (
    <div className="w-full h-32 bg-stone-100 animate-pulse rounded-xl flex items-center justify-center">
      <div className="text-stone-400">Loading...</div>
    </div>
  )
}

function DefaultError({ error, onRetry }: { error: Error, onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-4">😕</div>
      <h3 className="font-semibold text-stone-800 mb-2">Something went wrong</h3>
      <p className="text-stone-500 text-sm mb-6 max-w-sm">{error.message}</p>
      <Button onClick={onRetry} variant="secondary">Try Again</Button>
    </div>
  )
}
