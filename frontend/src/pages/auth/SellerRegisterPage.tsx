import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegisterCreator } from '@/queries/auth';
import { ChefHat, ArrowRight, Loader2, Info } from 'lucide-react';

export default function SellerRegisterPage() {
  const { mutateAsync: registerCreator, isPending: isLoading } = useRegisterCreator();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    creatorName: '',
    whatDoYouMake: '',
    bio: '',
    city: '',
    pickupLocation: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerCreator(formData);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Left side - Information */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 p-12 text-white flex-col justify-between">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-16">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">F</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">FoodFlow.</span>
          </Link>
          
          <h1 className="text-5xl font-display font-bold mb-6 leading-tight">
            Turn your passion for food into a <span className="text-orange-500">business.</span>
          </h1>
          <p className="text-stone-400 text-lg max-w-md mb-12">
            Join the new wave of food creators. Run limited-time drops, build your audience, and cook on your own terms.
          </p>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center shrink-0">
                <ChefHat className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">No Restaurant Required</h3>
                <p className="text-stone-400">Perfect for home chefs, pop-ups, and food enthusiasts.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center shrink-0">
                <ArrowRight className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Pre-order Model</h3>
                <p className="text-stone-400">Zero food waste. Know exactly what to cook and when.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-16 overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile logo */}
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">F</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-stone-900">FoodFlow.</span>
          </Link>

          <h2 className="text-3xl font-display font-bold text-stone-900 mb-2">Create your store</h2>
          <p className="text-stone-500 mb-8">Fill in your details to start hosting food drops.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-start gap-3 mb-6">
              <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-sm text-orange-800">
                <p className="font-medium mb-1">Welcome to FoodFlow for Creators</p>
                <p className="opacity-90">All payments are handled directly via Cash on Pickup. You won't need to connect a bank account.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-200">Personal Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="Enter your full name" />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
                <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="••••••••" />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number (Optional)</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="10-digit number" />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-200">Seller Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Seller / Brand Name</label>
                <input type="text" name="creatorName" required value={formData.creatorName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="e.g. John's Kitchen" />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">What do you make?</label>
                <input type="text" name="whatDoYouMake" required value={formData.whatDoYouMake} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="e.g. Brownies and dessert boxes" />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">City (Optional)</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="e.g. Vellore" />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-200">About You</h3>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Pickup Location (Optional)</label>
                <textarea name="pickupLocation" rows={2} value={formData.pickupLocation} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none" placeholder="e.g. Near VIT Main Gate" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Bio (Optional)</label>
                <textarea name="bio" rows={3} value={formData.bio} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none" placeholder="Tell customers a bit about yourself and your food..." />
              </div>
            </div>
            
            <button type="submit" disabled={isLoading} className="w-full py-3.5 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-colors shadow-[0_2px_10px_rgba(249,115,22,0.3)] disabled:opacity-70 flex items-center justify-center gap-2 mt-4">
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</> : 'Create Store'}
            </button>
            
            <p className="text-center text-sm text-stone-500 mt-6">
              Already have an account?{' '}
              <Link to="/auth/login/seller" className="text-orange-500 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
