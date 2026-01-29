"use client";

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray' | 'custom' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', size = 'md', className = '' }) => {
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
    secondary: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-400',
    success: 'bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-400',
    warning: 'bg-warning-50 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
    error: 'bg-error-50 text-error-700 dark:bg-error-900/30 dark:text-error-400',
    danger: 'bg-error-50 text-error-700 dark:bg-error-900/30 dark:text-error-400',
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    custom: '',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full transition-smooth transform hover:scale-105 cursor-default ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
