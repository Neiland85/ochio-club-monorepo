import React from 'react';

const Button = ({ children, variant, size, onClick, className }) => {
  return (
    <button
      className={`${variant === 'outline' ? 'border' : 'bg-primary'} ${size === 'sm' ? 'text-sm' : 'text-md'} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
