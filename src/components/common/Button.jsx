import React from 'react';

const Button = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '', 
  onClick,
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded focus:outline-none focus:ring-2 focus:ring-offset-1';
  
  const variants = {
    default: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-200',
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary-light',
    gradient: 'bg-gradient-to-r from-primary to-purple-500 text-white hover:opacity-90 focus:ring-purple-300',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    outline: 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-white',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
  };
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
