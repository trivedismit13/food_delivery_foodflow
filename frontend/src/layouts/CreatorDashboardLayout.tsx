import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { VerificationBadge } from '@/components/creators/VerificationBadge';
import { BarChart3, Package, Settings, ShieldCheck, Film, ListPlus, Bell, LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CreatorDashboardLayout() {
  const { user, logout, creatorProfile } = useAuthStore();
  const location = useLocation();

  const navLinks = [
    { to: "/dashboard/creator", label: "Dashboard", icon: BarChart3, exact: true },
    { to: "/dashboard/creator/drops", label: "My Drops", icon: Package },
    { to: "/dashboard/creator/menu", label: "My Menu", icon: ListPlus },
    { to: "/dashboard/creator/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/dashboard/creator/reels", label: "Reels", icon: Film },
    { to: "/dashboard/creator/profile", label: "Profile", icon: Settings },
    { to: "/dashboard/creator/verification", label: "Verification", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row pb-20 md:pb-0">
      
      {/* LEFT SIDEBAR (Desktop) / Top Nav (Mobile) */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-stone-100 flex-shrink-0 md:h-screen md:sticky md:top-0 md:overflow-y-auto flex flex-col">
        
        {/* Creator Info Header */}
        <div className="p-6 border-b border-stone-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xl font-bold shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <h2 className="font-semibold text-stone-900 truncate">{user?.name || "Creator Name"}</h2>
              <p className="text-sm text-stone-500">Home Chef</p>
            </div>
          </div>
          <VerificationBadge level={creatorProfile?.verificationLevel || 1} />
        </div>

        {/* Navigation Links */}
        <nav className="p-4 flex-1 flex flex-row md:flex-col overflow-x-auto md:overflow-visible no-scrollbar gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact 
              ? location.pathname === link.to 
              : location.pathname.startsWith(link.to);
            
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap",
                  isActive 
                    ? "bg-orange-50 text-orange-600" 
                    : "text-stone-600 hover:bg-stone-50"
                )}
              >
                <Icon size={18} className={isActive ? "text-orange-500" : "text-stone-400"} />
                {link.label}
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom Sidebar Widgets (Desktop Only) */}
        <div className="hidden md:block p-4 border-t border-stone-100 bg-stone-50/50 space-y-4">
          <button onClick={logout} className="w-full flex items-center gap-2 justify-center py-3 text-sm font-semibold text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full overflow-hidden">
        <Outlet />
      </main>

    </div>
  );
}
