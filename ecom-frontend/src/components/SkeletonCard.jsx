import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="card animate-pulse">
      <div className="skeleton skeleton-image mb-4"></div>
      <div className="skeleton skeleton-title mb-2"></div>
      <div className="skeleton skeleton-text mb-2"></div>
      <div className="skeleton skeleton-text mb-4" style={{ width: '60%' }}></div>
      <div className="skeleton skeleton-text mb-4" style={{ width: '40%' }}></div>
      <div className="skeleton skeleton-text" style={{ height: '45px' }}></div>
    </div>
  );
};

export default SkeletonCard; 