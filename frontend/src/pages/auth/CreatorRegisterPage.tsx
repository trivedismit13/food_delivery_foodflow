import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegisterCreator } from '@/queries/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';

const creatorRegisterSchema = z.object({
  // Step 1: Personal
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Must be 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  
  // Step 2: Creator Details
  creatorName: z.string().min(2, 'Brand name is required'),
  creatorType: z.string().min(2, 'Creator type is required'),
  city: z.string().optional(),
  cuisine: z.string().min(2, 'Cuisine is required'),
  bio: z.string().max(300, 'Bio too long'),
  
  // Step 3: Location and Pickup
  offersPickup: z.boolean(),
  pickupAddress: z.string().optional(),
  offersDelivery: z.boolean(),
  deliveryRadius: z.number().min(1).max(20).optional(),
  deliveryCharge: z.number().min(0).optional(),
  instagramHandle: z.string().optional(),
}).refine(data => {
  if (data.offersPickup && (!data.pickupAddress || data.pickupAddress.trim() === '')) return false;
  return true;
}, {
  message: "Pickup address is required if offering pickup",
  path: ["pickupAddress"]
}).refine(data => {
  if (data.offersDelivery && data.deliveryCharge === undefined) return false;
  return true;
}, {
  message: "Delivery charge is required if offering delivery",
  path: ["deliveryCharge"]
});

type CreatorFormValues = z.infer<typeof creatorRegisterSchema>;

const CREATOR_TYPES = [
  'Home Baker', 'Tiffin Service', 'Campus Seller', 
  'Weekend Chef', 'Cloud Kitchen', 'Specialty Desserts', 'Healthy Meals'
];

const CUISINES = [
  'South Indian', 'North Indian', 'Baked Goods', 'Healthy',
  'Continental', 'Desserts', 'Street Food', 'Mixed'
];

export default function CreatorRegisterPage() {
  const [step, setStep] = useState(1);
  const registerMutation = useRegisterCreator();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreatorFormValues>({
    resolver: zodResolver(creatorRegisterSchema),
    defaultValues: {
      offersPickup: true,
      offersDelivery: false,
      deliveryRadius: 5,
      deliveryCharge: 0,
    }
  });

  const offersPickup = watch('offersPickup');
  const offersDelivery = watch('offersDelivery');
  const bio = watch('bio') || '';

  const nextStep = async (fieldsToValidate: (keyof CreatorFormValues)[]) => {
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep(prev => prev + 1);
    }
  };

  const onSubmit = (data: CreatorFormValues) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl shadow-stone-200/50 overflow-hidden border border-stone-100">
        
        {/* Header & Progress */}
        <div className="bg-orange-500 px-8 py-10 text-white text-center">
          <h2 className="font-display text-3xl font-bold mb-2">Join as a Creator</h2>
          <p className="text-orange-100 mb-8">Start your food business today.</p>
          
          <div className="flex items-center justify-center max-w-xs mx-auto">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step > num ? 'bg-white text-orange-500' : 
                  step === num ? 'bg-orange-600 border-2 border-white text-white' : 
                  'bg-orange-400/50 text-orange-200'
                }`}>
                  {step > num ? <Check size={16} /> : num}
                </div>
                {num < 3 && (
                  <div className={`w-16 h-1 transition-colors ${step > num ? 'bg-white' : 'bg-orange-400/50'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 relative min-h-[400px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold text-stone-800 mb-6">Personal Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                    <input type="text" {...register('name')} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:border-orange-400 outline-none" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                    <input type="email" {...register('email')} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:border-orange-400 outline-none" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-stone-200 bg-stone-100 text-stone-500">+91</span>
                      <input type="tel" {...register('phone')} className="flex-1 bg-stone-50 border border-stone-200 rounded-r-xl px-4 py-2.5 focus:border-orange-400 outline-none" />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
                    <input type="password" {...register('password')} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:border-orange-400 outline-none" />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                  </div>

                  <button 
                    type="button" 
                    onClick={() => nextStep(['name', 'email', 'phone', 'password'])}
                    className="w-full bg-stone-900 text-white rounded-xl py-3 mt-6 flex justify-center items-center gap-2 hover:bg-stone-800"
                  >
                    Continue <ArrowRight size={18} />
                  </button>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold text-stone-800 mb-6">Creator Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Creator Name (Brand)</label>
                    <input type="text" {...register('creatorName')} placeholder="e.g. Priya's Kitchen" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:border-orange-400 outline-none" />
                    {errors.creatorName && <p className="text-red-500 text-xs mt-1">{errors.creatorName.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Creator Type</label>
                      <select {...register('creatorType')} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:border-orange-400 outline-none text-sm appearance-none">
                        <option value="">Select type...</option>
                        {CREATOR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      {errors.creatorType && <p className="text-red-500 text-xs mt-1">{errors.creatorType.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Specialty Cuisine</label>
                      <select {...register('cuisine')} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:border-orange-400 outline-none text-sm appearance-none">
                        <option value="">Select cuisine...</option>
                        {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.cuisine && <p className="text-red-500 text-xs mt-1">{errors.cuisine.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">City (Optional)</label>
                    <input 
                      type="text" 
                      {...register('city')} 
                      placeholder="e.g. Mumbai" 
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:border-orange-400 outline-none" 
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <label className="font-medium text-stone-700">Bio</label>
                      <span className="text-stone-400">{bio.length}/300</span>
                    </div>
                    <textarea 
                      {...register('bio')} 
                      rows={3}
                      placeholder="Tell customers about yourself..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:border-orange-400 outline-none resize-none" 
                    />
                    {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setStep(1)} className="px-4 py-3 border border-stone-200 rounded-xl hover:bg-stone-50">
                      <ArrowLeft size={18} className="text-stone-600" />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => nextStep(['creatorName', 'creatorType', 'city', 'cuisine', 'bio'])}
                      className="flex-1 bg-stone-900 text-white rounded-xl py-3 flex justify-center items-center gap-2 hover:bg-stone-800"
                    >
                      Continue <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold text-stone-800 mb-6">Location & Logistics</h3>
                  
                  <div className="p-4 border border-stone-200 rounded-xl bg-stone-50/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-stone-800">Offer Pickup?</label>
                      <input type="checkbox" {...register('offersPickup')} className="w-5 h-5 accent-orange-500" />
                    </div>
                    
                    {offersPickup && (
                      <div className="animate-in slide-in-from-top-2">
                        <label className="block text-sm font-medium text-stone-700 mb-1">Pickup Address</label>
                        <textarea {...register('pickupAddress')} rows={2} className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 focus:border-orange-400 outline-none" />
                        {errors.pickupAddress && <p className="text-red-500 text-xs mt-1">{errors.pickupAddress.message}</p>}
                      </div>
                    )}
                  </div>

                  <div className="p-4 border border-stone-200 rounded-xl bg-stone-50/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-stone-800">Offer Delivery?</label>
                      <input type="checkbox" {...register('offersDelivery')} className="w-5 h-5 accent-orange-500" />
                    </div>
                    
                    {offersDelivery && (
                      <div className="animate-in slide-in-from-top-2 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">Radius (km)</label>
                          <input type="number" {...register('deliveryRadius', { valueAsNumber: true })} className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 focus:border-orange-400 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">Fee (₹)</label>
                          <input type="number" {...register('deliveryCharge', { valueAsNumber: true })} className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 focus:border-orange-400 outline-none" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Instagram Handle (Optional)</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-stone-200 bg-stone-100 text-stone-500">@</span>
                      <input type="text" {...register('instagramHandle')} className="flex-1 bg-stone-50 border border-stone-200 rounded-r-xl px-4 py-2.5 focus:border-orange-400 outline-none" />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 pt-4">
                    <button type="button" onClick={() => setStep(2)} className="px-4 py-3 border border-stone-200 rounded-xl hover:bg-stone-50">
                      <ArrowLeft size={18} className="text-stone-600" />
                    </button>
                    <button 
                      type="submit"
                      disabled={registerMutation.isPending}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl py-3 flex justify-center items-center gap-2"
                    >
                      {registerMutation.isPending ? 'Creating Account...' : 'Create My Creator Account'}
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}
