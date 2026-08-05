import { useForm, UseFormProps, FieldValues, SubmitHandler } from 'react-hook-form'
import { UseMutationResult } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ValidationError } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'

// Wrapper around React Hook Form that handles backend ValidationError

export function useFormWithApiErrors<T extends FieldValues>(
  formConfig: UseFormProps<T>
) {
  const form = useForm<T>(formConfig)
  
  const handleSubmitWithApiErrors = (
    onValid: SubmitHandler<T>,
    mutation: UseMutationResult<any, any, T>
  ) => {
    return form.handleSubmit(async (data) => {
      try {
        await mutation.mutateAsync(data)
      } catch (error: any) {
        if (error instanceof ValidationError) {
          toast.error(error.message)
        } else if (error.response?.status === 400 && error.response.data?.fieldErrors) {
           // Handle structured validation errors if returned in standard format
           Object.entries(error.response.data.fieldErrors).forEach(([field, message]) => {
            form.setError(field as any, { 
              type: 'server', 
              message: message as string
            })
          })
          toast.error(error.response.data.message || 'Validation failed')
        } else {
          handleApiError(error)
        }
      }
    })
  }
  
  return { ...form, handleSubmitWithApiErrors }
}
