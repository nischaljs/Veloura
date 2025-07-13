import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 p-4 text-center">
      <h1 className="text-9xl font-extrabold text-gray-800 dark:text-gray-200 mb-4">
        404
      </h1>
      <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-4">
        Page Not Found
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;