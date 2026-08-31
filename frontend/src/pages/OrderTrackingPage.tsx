import { motion } from 'framer-motion'
import { Check, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useParams } from 'react-router-dom'
import { useOrderById } from '@/queries/orders'
import { usePaymentByOrder } from '@/queries/usePayments'
import type { OrderStatus } from '@/types/api'
import { useState } from 'react'
import { RatingModal } from '@/components/ui/RatingModal'

const steps: { id: OrderStatus, label: string, time?: string }[] = [
  { id: 'PLACED', label: 'Order Received', time: '08:40 PM' },
  { id: 'PREPARING', label: 'Food is being prepared', time: '08:45 PM' },
  { id: 'READY', label: 'Ready for Collection / On the Way' },
  { id: 'DELIVERED', label: 'Completed' },
]

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading, error } = useOrderById(Number(id))
  const { data: payment, isLoading: isPaymentLoading } = usePaymentByOrder(Number(id))
  
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
  const [hasRatedLocal, setHasRatedLocal] = useState(false)

  if (isLoading) {
    return <div className="min-h-screen py-8 text-center text-stone-500">Loading order details...</div>
  }

  if (!order) {
    return <div className="min-h-screen py-8 text-center text-stone-500">Order not found.</div>
  }

  const currentStatus = order.status
  let currentStepIndex = steps.findIndex(s => s.id === currentStatus)
  // Fallback for ON_THE_WAY since we replaced it with READY in the steps array
  if (currentStatus === 'ON_THE_WAY') {
    currentStepIndex = 2; // maps to the 3rd step (index 2)
  }

  const isTerminal = currentStatus === 'DELIVERED' || currentStatus === 'CANCELLED'

  // Banner logic
  const renderBanner = () => {
    if (currentStatus === 'DELIVERED') {
      return (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-8 flex items-center justify-between shadow-sm">
          <div>
            <h3 className="text-emerald-800 font-bold text-lg">Order Delivered! 🎉</h3>
            <p className="text-emerald-700 text-sm">Enjoy your meal. Rate your experience below.</p>
          </div>
          {!hasRatedLocal && (
            <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200" onClick={() => setIsRatingModalOpen(true)}>Rate Now</Button>
          )}
        </div>
      )
    }
    if (currentStatus === 'ON_THE_WAY') {
      return (
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 mb-8 flex items-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-brand-500 animate-pulse"></div>
          <div>
            <h3 className="text-brand-800 font-bold text-lg flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
              </span>
              Your order is on the way!
            </h3>
            <p className="text-brand-700 text-sm ml-5">Arriving in approx. 12 mins</p>
          </div>
        </div>
      )
    }
    if (currentStatus === 'READY') {
      return (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-8 flex items-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-green-500 animate-pulse"></div>
          <div>
            <h3 className="text-green-800 font-bold text-lg flex items-center gap-2">
              🟢 Your food is ready for collection!
            </h3>
            <p className="text-green-700 text-sm ml-5">Please pick it up at the designated location.</p>
          </div>
        </div>
      )
    }
    if (currentStatus === 'CANCELLED') {
      return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 flex items-center shadow-sm">
          <div>
            <h3 className="text-red-800 font-bold text-lg">Order Cancelled ❌</h3>
            <p className="text-red-700 text-sm">This order has been cancelled and will not be processed.</p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-background-base min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-800">Track Order #FF-{order.orderId}</h1>
          <p className="text-stone-500 mt-1">Placed at {order.restaurantName} • ₹{order.totalAmount}</p>
        </div>

        {renderBanner()}

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left: Timeline */}
          {currentStatus !== 'CANCELLED' && (
            <div className="md:w-[55%]">
              <div className="bg-white rounded-2xl p-6 shadow-warm-sm border border-stone-100">
                <h2 className="text-lg font-bold text-stone-800 mb-6">Status</h2>
                
                <div className="relative pl-4">
                  {/* Connecting Line background */}
                  <div className="absolute top-4 bottom-4 left-[27px] w-0.5 bg-stone-100"></div>
                  
                  {/* Active Connecting Line */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute top-4 left-[27px] w-0.5 bg-brand-500 origin-top"
                  ></motion.div>

                  <div className="space-y-8 relative z-10">
                    {steps.map((step, index) => {
                      const isCompleted = index < currentStepIndex || currentStatus === 'DELIVERED'
                      const isCurrent = index === currentStepIndex

                      return (
                        <div key={step.id} className="flex gap-4 items-start">
                          {/* Dot / Icon */}
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm transition-colors duration-300 border-2",
                            isCompleted ? "bg-brand-500 border-brand-500 text-white" :
                            isCurrent ? "bg-white border-brand-500" :
                            "bg-white border-stone-200 text-transparent"
                          )}>
                            {isCompleted ? (
                              <Check className="w-3 h-3 stroke-[3]" />
                            ) : isCurrent ? (
                              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                            ) : null}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 pb-1">
                            <h4 className={cn(
                              "font-semibold transition-colors duration-300",
                              isCompleted || isCurrent ? "text-stone-800" : "text-stone-400"
                            )}>
                              {step.label}
                            </h4>
                            {step.time && (
                              <p className={cn(
                                "text-xs mt-1 transition-colors duration-300",
                                isCompleted || isCurrent ? "text-stone-500" : "text-stone-300"
                              )}>
                                {step.time}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right: Details & Map Placeholder */}
          <div className={cn("flex flex-col gap-6", currentStatus === 'CANCELLED' ? "w-full" : "md:w-[45%]")}>
            
            {/* Delivery Partner */}
            {currentStepIndex >= 2 && currentStatus !== 'CANCELLED' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-5 shadow-warm-sm border border-stone-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-stone-200 to-stone-300 rounded-full flex items-center justify-center text-stone-500 font-bold overflow-hidden shadow-inner">
                    R
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 font-medium uppercase tracking-wider mb-0.5">Delivery Partner</p>
                    <p className="font-bold text-stone-800 text-sm">Ramesh Kumar</p>
                    <p className="text-xs font-semibold flex items-center gap-1 mt-0.5"><span className="text-brand-500">⭐ 4.8</span> (450+ deliveries)</p>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center hover:bg-brand-100 transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Map Placeholder */}
            {currentStatus !== 'CANCELLED' && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-warm-sm border border-stone-100 h-[200px] relative">
                <div className="absolute inset-0 bg-stone-100 flex flex-col items-center justify-center text-stone-400">
                  <MapPin className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-sm font-medium">Map View</span>
                </div>
              </div>
            )}

            {/* Order Details Summary */}
            <div className="bg-white rounded-2xl p-5 shadow-warm-sm border border-stone-100">
              <h3 className="font-bold text-stone-800 mb-4 text-sm uppercase tracking-wider text-stone-500">Order Summary</h3>
              <ul className="mt-4 space-y-3">
                {order.items.map((item: any, idx: number) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span className="text-stone-700"><span className="font-medium text-stone-800">{item.quantity} ×</span> {item.itemName}</span>
                    <span className="text-stone-800 font-medium">₹{item.priceEach * item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Payment Summary */}
            {payment && (
              <div className="bg-white rounded-2xl p-5 shadow-warm-sm border border-stone-100">
                <h3 className="font-bold text-stone-800 mb-4 text-sm uppercase tracking-wider text-stone-500">Payment</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-700">Method</span>
                    <span className="text-stone-800 font-medium">Pay at Pickup</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-700">Status</span>
                    <span className={cn("font-medium", payment.status === 'COLLECTED' ? 'text-green-600' : payment.status === 'CANCELLED' ? 'text-red-600' : 'text-amber-600')}>
                      {payment.status === 'COLLECTED' ? 'Paid at Pickup' : payment.status === 'CANCELLED' ? 'Cancelled' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-stone-100">
                    <span className="text-stone-700 font-bold">Total</span>
                    <span className="text-stone-800 font-bold">₹{payment.amount}</span>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
      
      {order && (
        <RatingModal 
          restaurantId={order.restaurantId} 
          isOpen={isRatingModalOpen} 
          onClose={() => {
            setIsRatingModalOpen(false)
            setHasRatedLocal(true)
          }} 
        />
      )}
    </div>
  )
}
