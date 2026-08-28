import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useLogin } from '@/queries/auth';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UtensilsCrossed } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function SellerLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin('SELLER');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };


  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Column - Social Proof */}
      <div className="hidden md:flex md:w-[60%] bg-gradient-to-br from-orange-50 to-amber-50 flex-col justify-center px-16 relative overflow-hidden">
        <div className="z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-3xl font-bold text-stone-900 tracking-tight">FoodFlow</span>
          </div>
          
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-stone-900 mb-6 leading-tight">
            The marketplace for independent food creators
          </h1>
          
          <div className="space-y-4 mt-12">
            {[
              "🎂 Priya's Kitchen — 312 orders completed",
              "🍛 Sunday Biryani Drop — Sold out in 90 mins",
              "🌿 Healthy Tiffin — 94% repeat customers"
            ].map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="bg-white/80 backdrop-blur rounded-2xl px-5 py-4 shadow-sm border border-orange-100/50 flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <p className="font-medium text-stone-700">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Decorative background shapes */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl" />
      </div>

      {/* Right Column - Form */}
      <div className="w-full md:w-[40%] flex flex-col justify-center items-center px-6 py-12 lg:px-12 relative">
        <div className="w-full max-w-[360px]">
          
          <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-stone-900">FoodFlow</span>
          </div>

          <div className="mb-8 text-center md:text-left">
            <h2 className="font-display text-3xl font-bold text-stone-800 mb-2">Creator Sign In</h2>
            <p className="text-stone-500">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email address</label>
              <input
                type="email"
                {...register('email')}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all outline-none"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-stone-700">Password</label>
                <Link to="#" className="text-sm text-orange-500 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all outline-none pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-2 shadow-sm shadow-orange-500/20"
            >
              {loginMutation.isPending && (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-stone-200" />
            <span className="px-4 text-xs text-stone-400 uppercase tracking-wider font-medium">or continue with</span>
            <div className="flex-1 border-t border-stone-200" />
          </div>


          <p className="text-center text-sm text-stone-600 mt-8">
            New creator?{' '}
            <Link to="/auth/register/creator" className="text-orange-500 font-semibold hover:underline">
              Create seller account
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <Link to="/auth/login" className="text-stone-600 text-sm font-medium hover:text-orange-500 transition-colors">
              Looking for food? Sign in as customer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
