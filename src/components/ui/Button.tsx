import React, { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    fullWidth = false,
    disabled, 
    children, 
    ...props 
  }, ref) => {
    const variants = {
      primary: 'bg-[#3fe3ff] hover:bg-[#2ad4f0] text-gray-900',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
      danger: 'bg-red-500 hover:bg-red-600 text-white'
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded',
      md: 'text-sm px-4 py-2 rounded-md',
      lg: 'text-base px-6 py-3 rounded-lg'
    };

    return (
      <button
        ref={ref}
        className={twMerge(
          'font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3fe3ff] focus:ring-opacity-50 inline-flex items-center justify-center',
          variants[variant],
          sizes[size],
          fullWidth ? 'w-full' : '',
          (disabled || isLoading) ? 'opacity-70 cursor-not-allowed' : '',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;