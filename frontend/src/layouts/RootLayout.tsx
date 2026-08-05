import { Outlet } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import { LocationGate } from '@/components/location/LocationGate'

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background-base font-sans">
      <Navbar />
      {/* LocationGate silently detects GPS on first visit, shows prompt if denied */}
      <LocationGate />

      <main className="flex-1 w-full relative">
        <Outlet />
      </main>
      
      <footer className="bg-white border-t border-stone-200 py-12 mt-auto">
        <div className="container mx-auto px-4 text-center text-stone-500 text-sm">
          <p>© {new Date().getFullYear()} FoodFlow Indie. The marketplace for independent food creators.</p>
        </div>
      </footer>
    </div>
  )
}
