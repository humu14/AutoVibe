import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

const NotFoundScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full opacity-20 blur-xl"></div>
          <div className="relative w-32 h-32 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <FaExclamationTriangle className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
          <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 mb-4">
            404
          </h1>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <FaHome className="w-5 h-5" />
              Go Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-3 px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
            >
              <FaArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Need help? Try these options:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/allProducts" className="text-blue-600 hover:text-blue-700 hover:underline">
                Browse Products
              </Link>
              <Link to="/search" className="text-blue-600 hover:text-blue-700 hover:underline">
                Search
              </Link>
              <Link to="/contact" className="text-blue-600 hover:text-blue-700 hover:underline">
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 bg-pink-200 rounded-full opacity-30 animate-pulse delay-500"></div>
      </div>
    </div>
  );
};

export default NotFoundScreen;
