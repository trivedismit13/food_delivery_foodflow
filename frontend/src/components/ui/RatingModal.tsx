import React, { useState } from 'react'
import { useSubmitRating } from '@/queries/ratings'
import { toast } from 'sonner'
import { Star } from 'lucide-react'
import { Button } from './Button'

interface RatingModalProps {
  restaurantId: number
  isOpen: boolean
  onClose: () => void
}

function StarPicker({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} transition-colors`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export function RatingModal({ restaurantId, isOpen, onClose }: RatingModalProps) {
  const [ratingValue, setRatingValue] = useState(0)
  const [foodQuality, setFoodQuality] = useState(0)

  const [packaging, setPackaging] = useState(0)
  const [reviewText, setReviewText] = useState('')

  const { mutate: submitRating, isPending } = useSubmitRating()

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (ratingValue === 0) {
      toast.error('Please provide an overall rating')
      return
    }

    submitRating(
      {
        restaurantId,
        ratingValue,
        foodQualityRating: foodQuality || undefined,
        packagingRating: packaging || undefined,
        reviewText: reviewText || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Thanks for your review!')
          onClose()
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          toast.error(error.response?.data?.message || 'Failed to submit rating')
        }
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Rate your experience</h2>
          <p className="text-gray-500 mt-1">Help us improve by leaving a review</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          <StarPicker label="Overall Rating (Required)" value={ratingValue} onChange={setRatingValue} />
          
          <div className="grid grid-cols-2 gap-4">
            <StarPicker label="Food Quality" value={foodQuality} onChange={setFoodQuality} />
            <StarPicker label="Packaging" value={packaging} onChange={setPackaging} />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Review (Optional)</label>
            <textarea
              className="w-full border rounded-xl p-3 h-24 resize-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="Tell us what you liked or how we can improve..."
              maxLength={1000}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 justify-end mt-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

