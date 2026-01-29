"use client";

import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    primary: 'border-primary-500 border-t-transparent',
    secondary: 'border-secondary-500 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
    />
  );
};

export default Spinner;
