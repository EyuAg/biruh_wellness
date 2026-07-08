import React from 'react';
import './BrandLogo.css';

const logoMap = {
  mark: '/images/brand/Mark.png',
  wide: '/images/brand/Wide.png',
  stacked: '/images/brand/Stacked.png',
};

const BrandLogo = ({ variant = 'mark', className = '', alt = 'Biruh Wellness Mental Health Clinic' }) => {
  const src = logoMap[variant] || logoMap.mark;

  return (
    <img
      className={`brand-logo brand-logo--${variant} ${className}`.trim()}
      src={src}
      alt={alt}
    />
  );
};

export default BrandLogo;
