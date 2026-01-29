import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-gray-200">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-gray-500 dark:text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`flex h-11 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm ring-offset-white dark:ring-offset-gray-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 dark:text-gray-100 transition-all duration-200 ${
            icon ? 'pl-10' : ''
          } ${
            error ? 'border-error-500 dark:border-error-500 ring-error-500/20' : 'hover:border-primary-500/50 dark:hover:border-primary-500/50 focus:border-primary-500 dark:focus:border-primary-500'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs font-medium text-error-600 dark:text-error-400">{error}</p>}
    </div>
  );
};

export default Input;
