import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card = ({ className, children }: CardProps) => {
  return (
    <div 
      className={twMerge(
        'bg-white rounded-lg shadow-md overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export const CardHeader = ({ className, children }: CardHeaderProps) => {
  return (
    <div 
      className={twMerge(
        'px-6 py-4 border-b border-gray-200',
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

export const CardTitle = ({ className, children }: CardTitleProps) => {
  return (
    <h3 
      className={twMerge(
        'text-lg font-semibold text-gray-800',
        className
      )}
    >
      {children}
    </h3>
  );
};

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export const CardContent = ({ className, children }: CardContentProps) => {
  return (
    <div 
      className={twMerge(
        'px-6 py-4',
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

export const CardFooter = ({ className, children }: CardFooterProps) => {
  return (
    <div 
      className={twMerge(
        'px-6 py-4 bg-gray-50 border-t border-gray-200',
        className
      )}
    >
      {children}
    </div>
  );
};