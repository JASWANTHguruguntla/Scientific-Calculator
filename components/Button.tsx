import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'operator' | 'action' | 'scientific' | 'equals';
  label: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'default', label, className = '', ...props }) => {
  // Base styles:
  // - active:duration-75 makes the "down" press feel snappy/responsive
  // - duration-200 makes the "up" release/hover feel smooth
  // - active:scale-95 provides physical feedback
  // - transform-gpu ensures smooth composition
  const baseStyles = "relative w-full h-14 sm:h-16 rounded-2xl font-medium text-lg sm:text-xl transition-all duration-200 active:duration-75 flex items-center justify-center select-none outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-offset-gray-900 active:scale-95 transform-gpu disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Standard Number Buttons
    // Light: White button with subtle shadow, lifts on hover
    // Dark: Dark gray button, deep shadow
    default: `
      bg-white text-gray-700 
      shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.1)]
      
      hover:bg-gray-50 
      hover:shadow-[0_8px_16px_rgba(0,0,0,0.08),0_4px_6px_rgba(0,0,0,0.04)] 
      hover:-translate-y-1 
      hover:text-gray-900
      
      active:bg-gray-100 
      active:shadow-inner 
      active:translate-y-0
      
      dark:bg-gray-800 dark:text-gray-100 
      dark:shadow-[0_2px_4px_rgba(0,0,0,0.4)]
      dark:hover:bg-gray-750 
      dark:hover:shadow-[0_8px_16px_rgba(0,0,0,0.5)]
      dark:active:bg-gray-700 dark:active:shadow-none
    `,
    
    // Operations (+, -, *, /)
    // Light: Indigo tint to distinguish from numbers
    operator: `
      bg-indigo-50 text-indigo-600 font-semibold
      shadow-[0_2px_4px_rgba(79,70,229,0.1)]
      
      hover:bg-indigo-100 
      hover:shadow-[0_8px_16px_rgba(79,70,229,0.15)] 
      hover:-translate-y-1 
      hover:text-indigo-700
      
      active:bg-indigo-200 
      active:shadow-inner 
      active:translate-y-0
      
      dark:bg-gray-700 dark:text-indigo-300 
      dark:shadow-[0_2px_4px_rgba(0,0,0,0.3)]
      dark:hover:bg-gray-600 dark:hover:text-indigo-200
      dark:active:bg-gray-500
    `,
    
    // Actions (AC, C, Del)
    // Light: Gray background
    action: `
      bg-gray-100 text-gray-800 font-semibold
      shadow-[0_2px_4px_rgba(0,0,0,0.05)]
      
      hover:bg-gray-200 
      hover:shadow-[0_6px_12px_rgba(0,0,0,0.08)] 
      hover:-translate-y-0.5
      
      active:bg-gray-300 
      active:shadow-inner 
      active:translate-y-0
      
      dark:bg-gray-600 dark:text-gray-100 
      dark:hover:bg-gray-500
      dark:active:bg-gray-400
    `,
    
    // Scientific Functions
    // Smaller text, subtle border look
    scientific: `
      bg-white text-gray-600 text-sm sm:text-base border border-gray-100
      
      hover:bg-gray-50 hover:text-gray-900 hover:border-gray-200 
      hover:shadow-md hover:-translate-y-0.5
      
      active:bg-gray-100 active:translate-y-0 active:shadow-inner
      
      dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700
      dark:hover:bg-gray-750 dark:hover:text-white dark:hover:border-gray-600
      dark:active:bg-gray-700
      shadow-sm
    `,
    
    // Equals Button
    // Prominent Blue with strong glow on hover
    equals: `
      bg-blue-600 text-white font-bold text-2xl
      shadow-[0_4px_6px_rgba(37,99,235,0.3)]
      
      hover:bg-blue-500 
      hover:shadow-[0_10px_20px_rgba(37,99,235,0.4)] 
      hover:-translate-y-1
      
      active:bg-blue-700 
      active:shadow-inner 
      active:translate-y-0
      
      dark:shadow-[0_4px_6px_rgba(37,99,235,0.2)]
      dark:hover:shadow-[0_10px_20px_rgba(37,99,235,0.3)]
    `,
  };

  // Helper to merge class strings cleanly
  const variantClasses = variants[variant].replace(/\s+/g, ' ').trim();

  return (
    <button 
      className={`${baseStyles} ${variantClasses} ${className}`}
      {...props}
    >
      {label}
    </button>
  );
};

export default Button;