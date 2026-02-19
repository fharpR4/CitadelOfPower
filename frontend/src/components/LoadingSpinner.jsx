import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-4 border-gray-100 border-t-purple-600 animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
