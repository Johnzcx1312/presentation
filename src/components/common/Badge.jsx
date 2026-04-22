import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '' 
}) => {
  const variants = {
    default: 'bg-red-500 text-white',
    primary: 'bg-primary text-white',
    secondary: 'bg-gray-200 text-gray-700',
    outline: 'bg-transparent border border-gray-300 text-gray-600',
  };
  
  const sizes = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-2.5 py-1',
  };
  
  return (
    <span className={`inline-flex items-center justify-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
