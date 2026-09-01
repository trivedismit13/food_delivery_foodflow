import { Routes, Route, Navigate } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import CreatorDashboardLayout from './layouts/CreatorDashboardLayout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { GuestRoute } from './components/auth/GuestRoute'
import RedirectToCreator from './components/RedirectToCreator'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'sonner'
import { useAuthInit } from './hooks/useAuthInit'
import { useAuthStore } from './store/authStore'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import SellerRegisterPage from './pages/auth/SellerRegisterPage'
import SellerLoginPage from './pages/auth/SellerLoginPage'

// Core Pages
import HomePage from './pages/HomePage'
import DropsPage from './pages/drops/DropsPage'
import DropDetailPage from './pages/drops/DropDetailPage'
import CreatorsListPage from './pages/creators/CreatorsListPage'
import CreatorProfilePage from './pages/creators/CreatorProfilePage'


// Common

import OrderTrackingPage from './pages/OrderTrackingPage'
import NotificationsPage from './pages/NotificationsPage'
import NotFoundPage from './pages/NotFoundPage'
import CartPage from './pages/CartPage'
import CustomerReelsPage from './pages/reels/CustomerReelsPage'

// Dashboards
import CustomerDashboardPage from './pages/dashboard/CustomerDashboardPage'

// Creator Dashboard
import CreatorDashboardHome from './pages/dashboard/creator/CreatorDashboardHome'
import CreatorDropsPage from './pages/dashboard/creator/CreatorDropsPage'
import CreateDropPage from './pages/dashboard/creator/CreateDropPage'
import ManageDropPage from './pages/dashboard/creator/ManageDropPage'
import CreatorMenuPage from './pages/dashboard/creator/CreatorMenuPage'
import CreatorAnalyticsPage from './pages/dashboard/creator/CreatorAnalyticsPage'
import CreatorVerificationPage from './pages/dashboard/creator/CreatorVerificationPage'
import CreatorReelsPage from './pages/dashboard/creator/CreatorReelsPage'
import CreatorProfileSettingsPage from './pages/dashboard/creator/CreatorProfileSettingsPage'

// Admin Pages
import AdminVerificationPage from './pages/admin/AdminVerificationPage'

function App() {
  useAuthInit()  // verify token on every page load

  const { isLoading } = useAuthStore()
  
  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-stone-50">Loading...</div>
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy'}>
      <Routes>
        {/* Root layout with Navbar */}
        <Route element={<RootLayout />}>
          
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/drops" element={<DropsPage />} />
          <Route path="/drops/:dropId" element={<DropDetailPage />} />
          <Route path="/creators" element={<CreatorsListPage />} />
          <Route path="/creators/:creatorId" element={<CreatorProfilePage />} />

          
          {/* Legacy redirects */}
          <Route path="/restaurants" element={<Navigate to="/creators" replace />} />
          <Route path="/restaurants/:id" element={<RedirectToCreator />} />
          
          {/* Auth routes (redirect to / if already logged in) */}
          <Route path="/auth/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/auth/login/seller" element={<GuestRoute><SellerLoginPage /></GuestRoute>} />
          <Route path="/auth/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/auth/register/creator" element={<GuestRoute><SellerRegisterPage /></GuestRoute>} />
          
          {/* Order tracking */}
          <Route path="/orders/:orderId/track" element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
              <OrderTrackingPage />
            </ProtectedRoute>
          } />
          
          {/* Notifications */}
          <Route path="/notifications" element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
              <NotificationsPage />
            </ProtectedRoute>
          } />
          
          {/* Cart */}
          <Route path="/cart" element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
              <CartPage />
            </ProtectedRoute>
          } />
          
          {/* Customer dashboard */}
          <Route path="/dashboard/customer" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CustomerDashboardPage />
            </ProtectedRoute>
          } />
          
          {/* Customer Reels */}
          <Route path="/reels" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CustomerReelsPage />
            </ProtectedRoute>
          } />
          
          {/* Legacy profile redirect */}
          <Route path="/profile" element={<Navigate to="/dashboard/customer" replace />} />
          
          {/* Creator dashboard — nested routes */}
          <Route path="/dashboard/creator" element={
            <ProtectedRoute allowedRoles={['SELLER']} redirectTo="/auth/login/seller">
              <CreatorDashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<CreatorDashboardHome />} />
            <Route path="drops" element={<CreatorDropsPage />} />
            <Route path="drops/new" element={<CreateDropPage />} />
            <Route path="drops/:dropId" element={<ManageDropPage />} />
            <Route path="menu" element={<CreatorMenuPage />} />
            <Route path="analytics" element={<CreatorAnalyticsPage />} />
            <Route path="reels" element={<CreatorReelsPage />} />
            <Route path="profile" element={<CreatorProfileSettingsPage />} />
            <Route path="verification" element={<CreatorVerificationPage />} />
          </Route>
          {/* Admin routes */}
          <Route path="/admin/verification/pending" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminVerificationPage />
            </ProtectedRoute>
          } />
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
          
        </Route>
      </Routes>
      <Toaster />
    </GoogleOAuthProvider>
  )
}

export default App
