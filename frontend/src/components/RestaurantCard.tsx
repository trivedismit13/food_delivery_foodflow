import { Link } from 'react-router-dom'
import { RatingDisplay } from './ui/RatingDisplay'

interface RestaurantCardProps {
  id: number
  name: string
  cuisine: string
  city: string
  isOpen: boolean
  rating: number
  reviewCount: number
  foodRating: number
  deliveryRating: number
  isVeg: boolean
  imageUrl?: string
  topCategories?: string[]
}

export function RestaurantCard({
  id, name, cuisine, city, isOpen, rating, reviewCount, 
  foodRating, deliveryRating, isVeg, imageUrl, topCategories
}: RestaurantCardProps) {
  
  return (
    <Link 
      to={`/restaurants/${id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-warm hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image Area */}
      <div className="h-[180px] relative w-full bg-gradient-to-br from-brand-100 to-amber-50">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-300 text-5xl">🍽️</div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
            isOpen ? 'bg-status-success/90 text-white backdrop-blur-sm shadow-sm' 
                   : 'bg-status-error/90 text-white backdrop-blur-sm shadow-sm'
          }`}>
            {isOpen ? 'OPEN' : 'CLOSED'}
          </span>
        </div>
        
        {/* Cuisine Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/80 text-stone-800 backdrop-blur-md shadow-sm">
            {cuisine}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-semibold text-stone-800 truncate">
              {name}
            </h3>
            <p className="text-sm text-stone-500 mt-0.5 truncate">
              {cuisine} • {city}
            </p>
          </div>
          {isVeg && (
            <div className="flex-shrink-0 mt-1" title="Pure Veg">
              <div className="w-4 h-4 border border-green-600 flex items-center justify-center rounded-sm">
                <div className="w-2 h-2 rounded-full bg-green-600"></div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <RatingDisplay 
            rating={rating} 
            count={reviewCount} 
            size="md" 
          />
        </div>
        
        <div className="mt-2.5 pt-2.5 border-t border-stone-100">
          <RatingDisplay 
            rating={rating} 
            showPills 
            foodRating={foodRating} 
            deliveryRating={deliveryRating} 
          />
        </div>

        <div className="mt-3 flex justify-between items-center">
          <div className="flex gap-1.5 overflow-hidden flex-1 pr-2">
            {topCategories?.map(cat => (
              <span key={cat} className="inline-block px-2 py-0.5 bg-stone-50 text-stone-500 text-[10px] font-medium rounded truncate">
                {cat}
              </span>
            ))}
          </div>
          <span className="text-sm font-semibold text-brand-500 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
            View Menu →
          </span>
        </div>
      </div>
    </Link>
  )
}
