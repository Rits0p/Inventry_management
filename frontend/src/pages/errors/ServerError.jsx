import { Link } from 'react-router-dom';

export default function ServerError() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="text-center max-w-lg">
        <div className="mb-6">
          <div className="text-9xl font-black text-red-500 leading-none">500</div>
          <div className="text-6xl mt-2">⚠️</div>
        </div>

        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Server Error</h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Something went wrong on our end. We're working to fix it. Please try again in a moment.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 border border-[var(--card-border)] text-[var(--text-primary)] font-medium rounded-sm hover:bg-[rgba(128,128,128,0.08)] transition"
          >
            🔄 Retry
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
