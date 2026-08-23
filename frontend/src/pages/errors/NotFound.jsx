import { Link, useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="text-center max-w-lg">
        {/* 404 Illustration */}
        <div className="mb-6">
          <div className="text-9xl font-black text-[#2874F0] leading-none">404</div>
          <div className="text-6xl mt-2">😕</div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-sm hover:bg-gray-100 transition"
          >
            ← Go Back
          </button>
          <Link
            to="/"
            className="px-6 py-3 bg-[#2874F0] hover:bg-blue-700 text-white font-medium rounded-sm transition"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
