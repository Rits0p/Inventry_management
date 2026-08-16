import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F1F3F6] flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <div className="mb-6">
          <div className="text-9xl font-black text-[#FB641B] leading-none">403</div>
          <div className="text-6xl mt-2">🔒</div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-8">
          You don't have permission to view this page. Please log in with the correct account or
          contact support.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-sm hover:bg-gray-100 transition"
          >
            ← Go Back
          </button>
          <Link
            to="/login"
            className="px-6 py-3 bg-[#2874F0] hover:bg-blue-700 text-white font-medium rounded-sm transition"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
