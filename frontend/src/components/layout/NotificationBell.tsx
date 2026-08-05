import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { apiClient as api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export function NotificationBell() {
  const { isAuthenticated } = useAuthStore();

  const { data } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      // return (await api.get('/notifications/unread-count')).data;
      return { count: 3 }; // Mocking for now since endpoint might not exist
    },
    enabled: isAuthenticated,
    refetchInterval: 30000, // Poll every 30s
  });

  const unreadCount = data?.count || 0;

  return (
    <Link 
      to="/notifications" 
      className="relative p-2 text-stone-600 hover:text-orange-500 transition-colors rounded-full hover:bg-stone-50"
    >
      <Bell className="w-5 h-5" />
      
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            key={unreadCount} // Re-animates if count changes
            className="absolute top-1 right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white"
          >
            <span className="text-[9px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
}
