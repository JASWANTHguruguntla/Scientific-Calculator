import React, { useEffect, useState } from 'react';
import katex from 'katex';
import { Mic, Sparkles } from 'lucide-react';
import { expressionToTex } from '../utils/mathUtils';

interface DisplayProps {
  expression: string;
  result: string;
  error: string | null;
  mode: string;
  onVoiceInput: () => void;
  onAiRequest: () => void;
  isListening: boolean;
  isAiThinking: boolean;
}

const Display: React.FC<DisplayProps> = ({ 
  expression, 
  result, 
  error, 
  mode, 
  onVoiceInput, 
  onAiRequest,
  isListening, 
  isAiThinking 
}) => {
  const [latexHtml, setLatexHtml] = useState('');

  // Render LaTeX preview
  useEffect(() => {
    if (!expression) {
        setLatexHtml('');
        return;
    }
    const tex = expressionToTex(expression);
    try {
        const html = katex.renderToString(tex || '', {
            throwOnError: false,
            displayMode: false
        });
        setLatexHtml(html);
    } catch (e) {
        setLatexHtml('');
    }
  }, [expression]);

  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-3xl mb-4 relative overflow-hidden shadow-inner border border-gray-200 dark:border-gray-800 transition-colors duration-200">
      
      {/* Status Bar */}
      <div className="flex justify-between text-xs font-mono text-gray-400 dark:text-gray-500 mb-2">
        <div className="flex items-center space-x-2">
             <span>SCICALC PRO</span>
             {isListening && <span className="flex items-center text-red-500"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></span> Listening...</span>}
             {isAiThinking && <span className="flex items-center text-blue-500"><span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-1"></span> AI Thinking...</span>}
        </div>
        <div className="flex items-center space-x-4">
             {/* AI Helper Button */}
             <button 
                onClick={onAiRequest} 
                className={`transition-colors flex items-center space-x-1 ${isAiThinking ? 'text-blue-500' : 'hover:text-blue-500'}`}
                title="Ask AI to explain"
             >
                <Sparkles size={16} />
                <span className="hidden sm:inline">Explain</span>
             </button>

             {/* Voice Input Button */}
             <button onClick={onVoiceInput} className={`transition-colors ${isListening ? 'text-red-500' : 'hover:text-blue-500'}`} title="Voice Input">
                <Mic size={16} />
             </button>

             <span className={`font-bold ${mode === 'DEG' ? 'text-orange-500 dark:text-yellow-500' : 'text-green-600 dark:text-green-500'}`}>{mode}</span>
        </div>
      </div>

      {/* Main Display Area */}
      <div className="flex flex-col items-end justify-end min-h-[8rem] space-y-1">
        
        {/* Natural Math Preview (LaTeX) */}
        {expression && !result && (
             <div 
                className="text-gray-400 dark:text-gray-500 text-sm h-6 mb-1 opacity-70"
                dangerouslySetInnerHTML={{ __html: latexHtml }} 
             />
        )}

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