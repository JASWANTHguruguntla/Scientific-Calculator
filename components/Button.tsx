import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'operator' | 'action' | 'scientific' | 'equals';
  label: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'default', label, className = '', ...props }) => {
  let baseStyles = "relative w-full h-14 sm:h-16 rounded-xl font-medium text-lg sm:text-xl transition-all duration-150 active:scale-95 flex items-center justify-center select-none outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900";
  
  const variants = {
    // Light: White bg, dark text. Dark: Gray-800 bg, white text.
    default: "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-750 focus:ring-gray-400 dark:focus:ring-gray-600 shadow-sm shadow-black/5 dark:shadow-black/20",
    
    // Light: Blue-50 bg, Blue-600 text. Dark: Gray-700 bg, Blue-300 text.
    operator: "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-gray-700 dark:text-blue-300 dark:hover:bg-gray-600 focus:ring-blue-500 shadow-sm shadow-blue-900/5 dark:shadow-black/20 font-semibold",
    
    // Light: Gray-200, Dark: Gray-300 (inverse-ish for visibility). Actually Action buttons like AC/C.
    action: "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-white focus:ring-gray-300 dark:focus:ring-gray-200 font-semibold shadow-sm",
    
    // Light: Gray-100. Dark: Gray-850.
    scientific: "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-850 dark:text-gray-300 dark:hover:bg-gray-700 focus:ring-gray-300 dark:focus:ring-gray-700 text-sm sm:text-base border border-gray-200 dark:border-gray-800",
    
    // Primary Color
    equals: "bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-400 font-bold shadow-lg shadow-blue-500/30 dark:shadow-blue-900/50",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {label}
    </button>
  );
};

export default Button;