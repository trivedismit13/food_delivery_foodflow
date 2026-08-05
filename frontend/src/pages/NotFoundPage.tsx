import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm border border-stone-200">
        🤔
      </div>
      <h1 className="font-display text-4xl font-bold text-stone-900 mb-2">Page Not Found</h1>
      <p className="text-stone-500 mb-8 max-w-sm">
        We couldn't find the page you were looking for. It might have been moved or doesn't exist.
      </p>
      <Link 
        to="/" 
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-sm"
      >
        Back to Home
      </Link>
    </div>
  );
}
