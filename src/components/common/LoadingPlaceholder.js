import React from 'react';

function LoadingPlaceholder() {
  // Component implementation
  return (
    <div className="animate-pulse space-y-8">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-gray-200 h-96 rounded-lg"></div>
      ))}
    </div>
  );
}

function ErrorMessage({ error }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error:</strong>
      <span className="block sm:inline"> Unable to fetch opportunities. Please try again later.</span>
      <p>Error details: {error.message}</p>
    </div>
  );
}

export default LoadingPlaceholder;