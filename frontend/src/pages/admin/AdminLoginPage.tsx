import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/queries/auth';
import { Eye, EyeOff, ShieldAlert } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin('ADMIN');

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
    <div className="min-h-screen flex flex-col justify-center items-center bg-stone-50 px-6 py-12">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-xl shadow-stone-200/50 p-8 border border-stone-100">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-stone-900 rounded-xl flex items-center justify-center shadow-lg shadow-stone-900/20 mb-4">
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold text-stone-900 mb-1">Admin Portal</h2>
          <p className="text-stone-500 text-sm">Sign in to privileged console</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Email address</label>
            <input
              type="email"
              {...register('email')}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all outline-none"
              placeholder="admin@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all outline-none pr-10"
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
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-4 shadow-sm shadow-stone-900/20"
          >
            {loginMutation.isPending && (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {loginMutation.isPending ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

      </div>
    </div>
  );
}
