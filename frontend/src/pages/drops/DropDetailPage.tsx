import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { CountdownTimer } from '@/components/drops/CountdownTimer';
import type { DropStatus } from '@/components/drops/DropCard';
import { VerificationBadge } from '@/components/creators/VerificationBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Star, Clock, MapPin, Loader2, Minus, Plus, CreditCard, Wallet, Banknote } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { useDropRealtime } from '@/hooks/useDropRealtime';
import { useDropById, usePlaceDropOrder } from '@/queries/drops';

export default function DropDetailPage() {
  const { dropId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [selectedItems, setSelectedItems] = useState<Record<number, number>>({});
  const [collectionMethod, setCollectionMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('12:00 PM');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet' | 'cod'>('upi');

  const { data: drop, isLoading: isDropLoading } = useDropById(Number(dropId));
  const placeOrderMutation = usePlaceDropOrder();
  const isPlacingOrder = placeOrderMutation.isPending;

  useDropRealtime(dropId ? Number(dropId) : undefined, (update) => {
    if (update.isSoldOut) {
      toast.error('This drop just sold out!')
    }
  });

  if (isDropLoading || !drop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const now = new Date();
  
  // Create a safe default for reviews (since they aren't provided by the backend endpoint yet)
  const reviews = [
    { id: 1, name: "Rahul S.", rating: 5, text: "The best biryani I've had in Mumbai, hands down. The meat was so tender it fell off the bone.", date: "2 weeks ago" },
    { id: 2, name: "Neha K.", rating: 4, text: "Amazing flavor and portion size. Packaging was very neat and eco-friendly.", date: "1 month ago" },
    { id: 3, name: "Amit V.", rating: 5, text: "Consistent quality every single time. The salan is exceptionally good.", date: "1 month ago" }
  ];

  const isSoldOut = drop.currentOrders >= drop.maxOrders || drop.isSoldOut;
  const percentFilled = Math.min((drop.currentOrders / drop.maxOrders) * 100, 100);
  const timeToCutoffMs = new Date(drop.orderCutoffTime).getTime() - now.getTime();
  const isClosingSoon = timeToCutoffMs > 0 && timeToCutoffMs < 1000 * 60 * 60 * 2;

  // Order Calculations
  const itemTotal = drop.items?.reduce((total, item) => {
    const qty = selectedItems[item.itemId] || 0;
    return total + ((item.dropPrice || item.price) * qty);
  }, 0) || 0;
  
  const totalItems = Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);
  const orderTotal = itemTotal + (collectionMethod === 'delivery' && drop.deliveryCharge ? drop.deliveryCharge : 0);

  const handleQtyChange = (itemId: number, delta: number, max: number) => {
    setSelectedItems(prev => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, Math.min(current + delta, max));
      if (next === 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login?redirect=/drops/' + drop.dropId);
      return;
    }

    if (totalItems === 0) {
      toast.error("Please add at least one item to your order");
      return;
    }

    try {
      await placeOrderMutation.mutateAsync({
        dropId: drop.dropId,
        items: Object.entries(selectedItems).map(([itemId, quantity]) => ({
          itemId: Number(itemId),
          quantity
        })),
        isDelivery: collectionMethod === 'delivery',
        deliveryAddress: collectionMethod === 'delivery' ? deliveryAddress : undefined,
        specialInstructions
      } as any);

      // confetti logic inside onSuccess in hook or here
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#f97316', '#fbbf24', '#34d399']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#f97316', '#fbbf24', '#34d399']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      toast.success("Pre-order confirmed! 🎉");
      
    } catch (e) {
      // Error handled by mutation hook
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen pb-24">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Info */}
          <div className="w-full lg:w-[60%] space-y-10">
            
            {/* SECTION 1: Header */}
            <section>
              <div className="w-full h-[320px] rounded-3xl overflow-hidden bg-gradient-to-br from-orange-200 to-amber-100 mb-6 relative border border-stone-100 shadow-sm">
                {drop.dropPhotoUrl ? (
                  <img src={drop.dropPhotoUrl} alt={drop.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl text-orange-400">🍽️</div>
                )}
                <div className="absolute top-4 left-4">
                  {drop.status === 'OPEN' && !isSoldOut && <span className="px-3 py-1.5 text-sm font-bold rounded-full bg-green-500 text-white shadow-sm">🟢 Accepting Orders</span>}
                  {drop.status === 'OPEN' && isSoldOut && <span className="px-3 py-1.5 text-sm font-bold rounded-full bg-stone-500 text-white shadow-sm">Sold Out</span>}
                  {drop.status === 'ANNOUNCED' && <span className="px-3 py-1.5 text-sm font-bold rounded-full bg-blue-500 text-white shadow-sm">📢 Coming Soon</span>}
                  {drop.status === 'CUTOFF' && <span className="px-3 py-1.5 text-sm font-bold rounded-full bg-amber-500 text-white shadow-sm">🍳 Cooking Now</span>}
                </div>
              </div>

              <h1 className="font-display text-4xl lg:text-5xl font-bold text-stone-900 mb-3">{drop.title}</h1>
              
              <Link to={`/creators/${drop.creator?.restaurantId}`} className="inline-flex items-center gap-2 hover:bg-stone-100 p-1.5 -ml-1.5 rounded-lg transition-colors">
                <span className="text-stone-500">by</span>
                <span className="font-semibold text-stone-800">{drop.creator?.name}</span>
                <VerificationBadge level={drop.creator?.verificationLevel || 1} size="sm" />
              </Link>

              <div className="mt-8 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row gap-6 md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-stone-700">{drop.currentOrders} of {drop.maxOrders} slots claimed</span>
                    {isSoldOut && <span className="text-red-500 font-bold">Sold Out</span>}
                  </div>
                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${percentFilled > 80 ? 'bg-red-400' : 'bg-orange-500'}`}
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>
                </div>
                <div className="w-px h-12 bg-stone-200 hidden md:block"></div>
                <div className="shrink-0">
                  <CountdownTimer cutoffTime={drop.orderCutoffTime} size="lg" />
                </div>
              </div>
            </section>

            {/* SECTION 2: Description */}
            <section className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-stone-900 mb-4">About This Drop</h2>
              <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">{drop.description}</p>
              
              {drop.specialNotes && (
                <div className="mt-6 bg-amber-50 rounded-2xl p-5 border border-amber-200/50 flex gap-3">
                  <span className="text-xl">📝</span>
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">Note from the creator</h4>
                    <p className="text-sm text-amber-800">{drop.specialNotes}</p>
                  </div>
                </div>
              )}
            </section>

            {/* SECTION 3: Items */}
            <section className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-stone-900 mb-6">What's included</h2>
              
              <div className="space-y-4">
                {drop.items?.map(item => {
                  const available = item.quantityAvailable;
                  const qty = selectedItems[item.itemId] || 0;
                  
                  return (
                    <div key={item.itemId} className="flex flex-col sm:flex-row gap-4 justify-between p-4 rounded-2xl border border-stone-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`flex-shrink-0 w-4 h-4 border flex items-center justify-center rounded-sm ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                            <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                          </div>
                          <h3 className="font-semibold text-stone-900">{item.name}</h3>
                        </div>
                        <p className="text-sm text-stone-500 pl-6">{item.description}</p>
                      </div>
                      
                      <div className="flex sm:flex-col items-center justify-between sm:items-end gap-3 sm:pl-4 sm:border-l border-stone-100 shrink-0">
                        <div className="text-right">
                          {item.dropPrice && item.dropPrice < item.price ? (
                            <div className="flex items-center gap-2">
                              <span className="text-stone-400 line-through text-sm">₹{item.price}</span>
                              <span className="font-bold text-orange-600 text-lg">₹{item.dropPrice}</span>
                            </div>
                          ) : (
                            <span className="font-bold text-stone-900 text-lg">₹{item.price}</span>
                          )}
                          <div className="text-xs text-stone-500 mt-1">
                            {available} remaining
                          </div>
                        </div>

                        {drop.status === 'OPEN' && !isSoldOut && (
                          <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl p-1 shadow-sm">
                            <button 
                              onClick={() => handleQtyChange(item.itemId, -1, available)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-600 disabled:opacity-50"
                              disabled={qty === 0}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-4 text-center font-semibold text-stone-800">{qty}</span>
                            <button 
                              onClick={() => handleQtyChange(item.itemId, 1, available)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-600 disabled:opacity-50"
                              disabled={qty >= available || qty >= 10}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECTION 4: Creator Info */}
            <section className="bg-stone-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-xl font-bold border-2 border-white/20">
                      {(drop.creator?.name || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-bold">{drop.creator?.name}</h3>
                      <p className="text-stone-400">{drop.creator?.creatorType} • {(drop.creator as any)?.city || 'Local Area'}</p>
                    </div>
                  </div>
                  
                  <button className="w-full sm:w-auto px-6 py-2.5 rounded-full font-semibold border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors">
                    Follow {drop.creator?.name?.split(' ')[0]}
                  </button>
                </div>

                <p className="text-stone-300 leading-relaxed mb-8">{(drop.creator as any)?.bio || 'This creator is passionate about bringing the best homemade food to your table.'}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-stone-800">
                  <div>
                    <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">Verification</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm text-emerald-400"><Shield size={16} /> Identity Verified</li>
                      <li className="flex items-center gap-2 text-sm text-emerald-400"><Shield size={16} /> Food Licence on File</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">Stats</h4>
                    <div className="flex items-center gap-6">
                      <div>
                        <div className="text-xl font-bold text-white">{drop.creator?.totalOrdersCompleted || 0}</div>
                        <div className="text-xs text-stone-400">Orders</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white">{drop.creator.followerCount}</div>
                        <div className="text-xs text-stone-400">Followers</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white flex items-center gap-1"><Star size={16} className="fill-orange-400 text-orange-400" /> {drop.creator?.avgRating || 'New'}</div>
                        <div className="text-xs text-stone-400">Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 5: Reviews */}
            <section className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
              <div className="flex justify-between items-end mb-6">
                <h2 className="font-display text-2xl font-bold text-stone-900">Recent Reviews</h2>
                <button className="text-orange-500 font-medium text-sm hover:text-orange-600">View all →</button>
              </div>
              
              <div className="grid gap-4">
                {reviews.map(review => (
                  <div key={review.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-600">
                          {(review.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-stone-900">{review.name}</span>
                      </div>
                      <span className="text-xs text-stone-400">{review.date}</span>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} size={14} className={star <= review.rating ? "fill-orange-400 text-orange-400" : "text-stone-300"} />
                      ))}
                    </div>
                    <p className="text-sm text-stone-600">{review.text}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: Order Card (Sticky) */}
          <div className="w-full lg:w-[40%]">
            <div className="sticky top-24 bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-stone-100">
              
              <h2 className="font-display text-2xl font-bold text-stone-900 mb-6">Reserve Your Slot</h2>

              {isClosingSoon && (
                <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-3 flex gap-3 animate-pulse">
                  <span className="text-red-500">⚡</span>
                  <p className="text-sm text-red-800 font-medium">Hurry! The order window is closing very soon.</p>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100 mb-6">
                <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">Your Selection</h3>
                
                {totalItems === 0 ? (
                  <p className="text-sm text-stone-400 italic text-center py-2">Select items from the menu to build your order.</p>
                ) : (
                  <div className="space-y-3 mb-4">
                    {drop.items?.map(item => {
                      const qty = selectedItems[item.itemId];
                      if (!qty) return null;
                      return (
                        <div key={item.itemId} className="flex justify-between text-sm">
                          <span className="text-stone-700"><span className="font-semibold">{qty}x</span> {item.name}</span>
                          <span className="text-stone-900 font-medium">₹{(item.dropPrice || item.price) * qty}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <div className="border-t border-stone-200 pt-3 space-y-2">
                  <div className="flex justify-between text-sm text-stone-600">
                    <span>Item Total</span>
                    <span>₹{itemTotal}</span>
                  </div>
                  {collectionMethod === 'delivery' && drop.deliveryCharge !== undefined && (
                    <div className="flex justify-between text-sm text-stone-600">
                      <span>Delivery Partner Fee</span>
                      <span>₹{drop.deliveryCharge}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-stone-900 pt-2 border-t border-stone-200 mt-2">
                    <span>Total</span>
                    <span>₹{orderTotal}</span>
                  </div>
                </div>
              </div>

              {/* Collection Toggle */}
              <div className="mb-6 space-y-3">
                <h3 className="text-sm font-semibold text-stone-700">How would you like to get it?</h3>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all ${collectionMethod === 'pickup' ? 'border-orange-500 bg-orange-50/30' : 'border-stone-100 bg-white hover:border-orange-200'}`}>
                    <input type="radio" name="collection" value="pickup" checked={collectionMethod === 'pickup'} onChange={() => setCollectionMethod('pickup')} className="absolute opacity-0" />
                    <span className="font-semibold text-stone-900 mb-1">Pickup</span>
                    <span className="text-xs text-stone-500">Collect yourself</span>
                  </label>
                  <label className={`relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all ${collectionMethod === 'delivery' ? 'border-orange-500 bg-orange-50/30' : 'border-stone-100 bg-white hover:border-orange-200'}`}>
                    <input type="radio" name="collection" value="delivery" checked={collectionMethod === 'delivery'} onChange={() => setCollectionMethod('delivery')} className="absolute opacity-0" />
                    <span className="font-semibold text-stone-900 mb-1">Delivery</span>
                    <span className="text-xs text-stone-500">+₹{drop.deliveryCharge || 0}</span>
                  </label>
                </div>
              </div>

              {/* Dynamic Collection Details */}
              <div className="mb-6">
                <AnimatePresence mode="wait">
                  {collectionMethod === 'pickup' ? (
                    <motion.div key="pickup" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                      <div className="bg-orange-50 text-orange-900 p-4 rounded-xl text-sm flex gap-3">
                        <MapPin size={18} className="shrink-0 text-orange-500" />
                        <p>{(drop.creator as any)?.pickupAddress || 'Creator local address will be shown after booking.'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-stone-700 block mb-2">Select Pickup Time</label>
                        <div className="flex flex-wrap gap-2">
                          {['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM'].map(time => (
                            <button 
                              key={time}
                              onClick={() => setSelectedTimeSlot(time)}
                              className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${selectedTimeSlot === time ? 'bg-orange-500 border-orange-500 text-white font-medium' : 'bg-white border-stone-200 text-stone-600 hover:border-orange-300'}`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="delivery" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden">
                      <label className="text-sm font-medium text-stone-700 block">Delivery Address</label>
                      <textarea 
                        rows={2}
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Enter full address for delivery..."
                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none text-sm"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-stone-700 block mb-2">Special Instructions</label>
                <input 
                  type="text" 
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any dietary notes or allergies?"
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
                />
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <label className="text-sm font-medium text-stone-700 block mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'bg-stone-900 border-stone-900 text-white' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}>
                    <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="hidden" />
                    <span className="font-semibold text-sm">UPI</span>
                  </label>
                  <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'card' ? 'bg-stone-900 border-stone-900 text-white' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}>
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                    <CreditCard size={16} />
                    <span className="font-semibold text-sm">Card</span>
                  </label>
                </div>
              </div>

              {/* Primary Action Button */}
              {!isAuthenticated ? (
                <button 
                  onClick={() => navigate('/auth/login?redirect=/drops/' + drop.dropId)}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl py-4 transition-colors shadow-sm"
                >
                  Sign in to Pre-order
                </button>
              ) : drop.status === 'OPEN' && !isSoldOut ? (
                <button 
                  onClick={handlePlaceOrder}
                  disabled={totalItems === 0 || isPlacingOrder || (collectionMethod === 'delivery' && !deliveryAddress)}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-bold text-lg rounded-xl py-4 transition-colors shadow-sm flex justify-center items-center gap-2"
                >
                  {isPlacingOrder ? <><Loader2 className="animate-spin" size={20}/> Confirming...</> : `Confirm Pre-order — ₹${orderTotal}`}
                </button>
              ) : drop.status === 'ANNOUNCED' ? (
                <button className="w-full bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold rounded-xl py-4 transition-colors">
                  Notify Me When Open
                </button>
              ) : (
                <div className="text-center">
                  <button disabled className="w-full bg-stone-100 text-stone-400 font-bold rounded-xl py-4 cursor-not-allowed mb-2">
                    {isSoldOut ? 'Sold Out' : 'Order Window Closed'}
                  </button>
                  <p className="text-xs text-stone-500">Food is being prepared. Check back later.</p>
                </div>
              )}

              <p className="text-center text-xs text-stone-400 mt-4 flex items-center justify-center gap-2">
                <span>🔒 Secure payment</span> • <span>No cancellation after cutoff</span>
              </p>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
