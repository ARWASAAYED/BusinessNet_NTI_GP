import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-smooth active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-400 hover:to-primary-500 shadow-lg shadow-primary-500/40 hover:shadow-xl hover:shadow-primary-500/50 hover:scale-105',
    secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-400 hover:to-secondary-500 shadow-lg shadow-secondary-500/40 hover:shadow-xl hover:shadow-secondary-500/50 hover:scale-105',
    outline: 'border-2 border-primary-500 bg-white dark:bg-gray-950 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:translate-y-[-3px] hover:shadow-lg hover:shadow-primary-500/30 text-primary-600 dark:text-primary-400 hover:scale-105',
    ghost: 'hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 text-gray-700 dark:text-gray-300 hover:scale-105',
    danger: 'bg-gradient-to-r from-error-500 to-error-600 text-white hover:from-error-400 hover:to-error-500 shadow-lg shadow-error-500/30 hover:shadow-xl hover:shadow-error-500/40 hover:scale-105',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${fullWidth ? 'w-full' : ''} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
