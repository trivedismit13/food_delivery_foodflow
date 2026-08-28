import { useStore } from '@/store/useStore';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, Loader2 } from 'lucide-react';
import { usePlaceDropOrder } from '@/queries/orders';
import { toast } from 'sonner';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useStore();
  const navigate = useNavigate();
  const placeOrder = usePlaceDropOrder();

  const handleCheckout = () => {
    if (items.length === 0) return;

    const dropId = items[0].dropId;
    if (!dropId) {
      toast.error('Cannot checkout: items must belong to a drop');
      return;
    }

    placeOrder.mutate(
      {
        dropId: dropId,
        items: items.map((item) => ({
          itemId: item.id,
          quantity: item.quantity,
        })),
        paymentMethod: 'CARD',
      },
      {
        onSuccess: (data) => {
          toast.success('Order placed successfully!');
          clearCart();
          navigate(`/orders/${data.orderId}/track`);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || 'Failed to place order');
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-display font-bold mb-8 text-stone-800">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-stone-100">
          <p className="text-stone-500 mb-6 text-lg">Your cart is feeling a bit empty.</p>
          <Link 
            to="/drops" 
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
          >
            Discover Drops
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              <ul className="divide-y divide-stone-100">
                {items.map((item) => (
                  <li key={item.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-stone-50/50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-stone-800">{item.name}</h3>
                      <p className="text-sm text-orange-500 font-medium">${item.price.toFixed(2)} each</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3 bg-stone-50 rounded-lg p-1 border border-stone-200">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center rounded bg-white text-stone-600 shadow-sm hover:text-orange-500 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-4 text-center font-medium text-stone-700">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded bg-white text-stone-600 shadow-sm hover:text-orange-500 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="font-semibold text-lg text-stone-800 w-20 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-stone-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-800">${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Fees</span>
                  <span className="font-medium text-stone-800">Calculated at checkout</span>
                </div>
                
                <div className="h-px bg-stone-100 my-4"></div>
                
                <div className="flex justify-between text-lg font-bold text-stone-900">
                  <span>Total</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                disabled={placeOrder.isPending}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2"
              >
                {placeOrder.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
