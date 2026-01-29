import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  footer,
  onClick,
}) => {
  return (
    <div 
      onClick={onClick}
      className={`glass-card text-gray-900 dark:text-gray-100 overflow-hidden ${className} ${onClick ? 'cursor-pointer hover:scale-[1.01]' : ''}`}
    >
      {(title || subtitle) && (
        <div className="flex flex-col space-y-1.5 p-6">
          {title && (
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="p-6 pt-0">{children}</div>
      {footer && (
        <div className="flex items-center p-6 pt-0">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
