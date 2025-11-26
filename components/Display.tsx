import React from 'react';

interface DisplayProps {
  expression: string;
  result: string;
  error: string | null;
  mode: string;
}

const Display: React.FC<DisplayProps> = ({ expression, result, error, mode }) => {
  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-3xl mb-4 relative overflow-hidden shadow-inner border border-gray-200 dark:border-gray-800 transition-colors duration-200">
      {/* Status Bar */}
      <div className="flex justify-between text-xs font-mono text-gray-400 dark:text-gray-500 mb-2">
        <span>SCICALC PRO</span>
        <span className={mode === 'DEG' ? 'text-orange-500 dark:text-yellow-500' : 'text-green-600 dark:text-green-500'}>{mode}</span>
      </div>

      {/* Main Display Area */}
      <div className="flex flex-col items-end justify-end h-32 space-y-1">
        
        {/* Expression (Input) */}
        <div className="w-full overflow-x-auto no-scrollbar text-right">
           <span className={`whitespace-nowrap font-mono transition-all duration-200 ${result ? 'text-gray-500 dark:text-gray-400 text-lg sm:text-xl' : 'text-gray-900 dark:text-white text-3xl sm:text-4xl'}`}>
             {expression || '0'}
           </span>
        </div>

        {/* Result */}
        <div className="w-full text-right h-12 flex items-center justify-end">
           {error ? (
             <span className="text-red-500 dark:text-red-400 font-bold text-xl animate-pulse">{error}</span>
           ) : (
             <span className={`font-bold transition-all duration-200 ${result ? 'text-4xl sm:text-5xl text-gray-900 dark:text-white' : 'text-transparent text-xl'}`}>
               {result || (expression ? '=' : '')}
             </span>
           )}
        </div>
      </div>
    </div>
  );
};

export default Display;