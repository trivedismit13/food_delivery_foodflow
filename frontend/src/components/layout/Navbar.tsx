import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, Bell } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/authStore';
import { useUnreadCount } from '@/queries/notifications';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  
  const cartCount = useStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  
  const { isAuthenticated, user, creatorProfile, isCreator, isCustomer, isAdmin, logout } = useAuthStore();
  const { data: unreadCount = 0 } = useUnreadCount();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const renderGuestActions = () => (
    <div className="flex items-center gap-3">
      <Link to="/auth/login" className="text-sm font-medium text-stone-600 hover:text-orange-500 transition-colors px-3 py-2">
        Sign In
      </Link>
      <Link to="/auth/register/creator" className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-all text-sm font-medium shadow-sm">
        Join as Creator
      </Link>
    </div>
  );

  const renderCustomerActions = () => (
    <div className="flex items-center gap-5">
      <Link to="/notifications" className="relative p-2 text-stone-600 hover:text-orange-500 transition-colors">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white"></span>
        )}
      </Link>
      
      <Link to="/cart" className="relative p-2 text-stone-600 hover:text-orange-500 transition-colors">
        <ShoppingCart className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
            {cartCount}
          </span>
        )}
      </Link>
      
      <div className="relative">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm hover:bg-orange-200 transition-colors"
        >
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-100 py-2 z-50">
            <Link to="/dashboard/customer" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">My Orders</Link>
            <Link to="/dashboard/customer?tab=following" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Saved Creators</Link>
            <Link to="/dashboard/customer?tab=profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Profile Settings</Link>
            <div className="h-px bg-stone-100 my-2"></div>
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign Out</button>
          </div>
        )}
      </div>
    </div>
  );

  const renderCreatorActions = () => (
    <div className="flex items-center gap-5">
      <Link to="/notifications" className="relative p-2 text-stone-600 hover:text-orange-500 transition-colors">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white"></span>
        )}
      </Link>
      
      <Link to="/dashboard/creator" className="hidden md:flex items-center justify-center px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded-xl text-sm font-medium hover:bg-orange-100 transition-colors">
        My Dashboard
      </Link>

      <div className="relative">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-9 h-9 rounded-full bg-stone-800 text-white flex items-center justify-center font-bold text-sm hover:bg-stone-700 transition-colors"
        >
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-100 py-2 z-50">
            <Link to="/dashboard/creator" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Creator Dashboard</Link>
            <Link to={`/creators/${creatorProfile?.restaurantId}`} onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">View My Storefront</Link>
            <Link to="/dashboard/creator/drops" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">My Drops</Link>
            <Link to="/dashboard/creator/analytics" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Analytics</Link>
            <Link to="/dashboard/creator/profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Profile</Link>
            <div className="h-px bg-stone-100 my-2"></div>
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign Out</button>
          </div>
        )}
      </div>
    </div>
  );

  const renderAdminActions = () => (
    <div className="flex items-center gap-5">
      <Link to="/admin/verification/pending" className="hidden md:flex items-center justify-center px-4 py-2 bg-stone-100 text-stone-700 border border-stone-200 rounded-xl text-sm font-medium hover:bg-stone-200 transition-colors">
        Admin Portal
      </Link>

      <div className="relative">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-9 h-9 rounded-full bg-stone-800 text-white flex items-center justify-center font-bold text-sm hover:bg-stone-700 transition-colors"
        >
          {user?.name?.charAt(0)?.toUpperCase() || 'A'}
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-100 py-2 z-50">
            <Link to="/admin/verification/pending" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Verification Queue</Link>
            <div className="h-px bg-stone-100 my-2"></div>
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign Out</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-50 h-16 bg-white border-b border-stone-100 shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg leading-none">F</span>
              </div>
              <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
                FoodFlow<span className="text-orange-500">.</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-6 border-l border-stone-200 pl-6 ml-2">
              {!isAdmin() && (
                <>
                  <Link to="/drops" className="text-sm font-medium text-stone-600 hover:text-orange-500 transition-colors">
                    Discover Drops
                  </Link>
                  <Link to="/creators" className="text-sm font-medium text-stone-600 hover:text-orange-500 transition-colors">
                    All Creators
                  </Link>
                </>
              )}
              {isAuthenticated && isCustomer() && (
                <Link to="/reels" className="text-sm font-medium text-stone-600 hover:text-orange-500 transition-colors">
                  Reels
                </Link>
              )}
            </div>
          </div>

          <form 
            className="hidden md:flex flex-1 max-w-[400px] mx-8 relative"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                navigate(`/drops?query=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-stone-400" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators, cuisines, drops..." 
              className="w-full pl-10 pr-4 py-2 rounded-full bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-50 transition-all"
            />
          </form>

          <div className="hidden md:flex items-center">
            {!isAuthenticated && renderGuestActions()}
            {isAuthenticated && isCustomer() && renderCustomerActions()}
            {isAuthenticated && isCreator() && renderCreatorActions()}
            {isAuthenticated && isAdmin() && renderAdminActions()}
          </div>

          <button 
            className="md:hidden p-2 text-stone-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Sheet Menu (Simplified for brevity) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/20" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4 text-stone-800">Menu</h3>
            <div className="flex flex-col gap-4">
              {isAuthenticated ? (
                <>
                  {isAdmin() ? (
                    <>
                      <Link to="/admin/verification/pending" onClick={() => setIsMobileMenuOpen(false)} className="text-stone-700 font-medium">Verification Queue</Link>
                      <div className="h-px bg-stone-100 my-2"></div>
                      <button onClick={handleLogout} className="text-left text-red-600 font-medium">Sign Out</button>
                    </>
                  ) : isCreator() ? (
                    <>
                      <Link to="/dashboard/creator" onClick={() => setIsMobileMenuOpen(false)} className="text-stone-700 font-medium">Dashboard</Link>
                      <Link to="/dashboard/creator/drops" onClick={() => setIsMobileMenuOpen(false)} className="text-stone-700 font-medium">My Drops</Link>
                      <Link to="/dashboard/creator/analytics" onClick={() => setIsMobileMenuOpen(false)} className="text-stone-700 font-medium">Analytics</Link>
                      <Link to="/notifications" onClick={() => setIsMobileMenuOpen(false)} className="text-stone-700 font-medium flex items-center justify-between">
                        Notifications
                        {unreadCount > 0 && <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>}
                      </Link>
                      <div className="h-px bg-stone-100 my-2"></div>
                      <button onClick={handleLogout} className="text-left text-red-600 font-medium">Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-stone-700 font-medium">Home</Link>
                      <Link to="/drops" onClick={() => setIsMobileMenuOpen(false)} className="text-stone-700 font-medium">Discovery Feed</Link>
                      <Link to="/reels" onClick={() => setIsMobileMenuOpen(false)} className="text-stone-700 font-medium">Reels</Link>
                      <Link to="/dashboard/customer" onClick={() => setIsMobileMenuOpen(false)} className="text-stone-700 font-medium">My Orders</Link>
                      <Link to="/notifications" onClick={() => setIsMobileMenuOpen(false)} className="text-stone-700 font-medium flex items-center justify-between">
                        Notifications
                        {unreadCount > 0 && <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>}
                      </Link>
                      <div className="h-px bg-stone-100 my-2"></div>
                      <button onClick={handleLogout} className="text-left text-red-600 font-medium">Sign Out</button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link to="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="text-stone-700 font-medium">Sign In</Link>
                  <Link to="/auth/register/creator" onClick={() => setIsMobileMenuOpen(false)} className="text-orange-500 font-medium">Join as Creator</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </>
  );
}
