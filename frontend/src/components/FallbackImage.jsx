import React from 'react';

const FallbackImage = ({ className, text = 'COP' }) => {
  return (
    <div 
      className={`flex items-center justify-center bg-blue-600 text-white font-bold ${className}`}
      style={{ minWidth: '32px', minHeight: '32px' }}
    >
      {text}
    </div>
  );
};

export default FallbackImage;