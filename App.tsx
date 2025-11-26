import React, { useState, useEffect } from 'react';
import { Menu, History as HistoryIcon, Calculator as CalculatorIcon, LineChart, Moon, Sun } from 'lucide-react';
import { useCalculator } from './hooks/useCalculator';
import Display from './components/Display';
import Button from './components/Button';
import History from './components/History';
import Graph from './components/Graph';

function App() {
  const { state, actions } = useCalculator();
  const [showHistory, setShowHistory] = useState(false);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      if (/[0-9.]/.test(key)) {
        actions.append(key);
      } else if (['+', '-', '*', '/', '(', ')', '^', '%'].includes(key)) {
        const map: {[key: string]: string} = { '*': '×', '/': '÷' };
        actions.append(map[key] || key);
      } else if (key.toLowerCase() === 'x') {
        actions.append('x');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        actions.evaluate();
      } else if (key === 'Backspace') {
        actions.deleteLast();
      } else if (key === 'Escape') {
        actions.clear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions]);

  // Define keypad layouts
  const scientificKeys = [
    { label: 'sin', val: 'sin' }, { label: 'cos', val: 'cos' }, { label: 'tan', val: 'tan' },
    { label: 'asin', val: 'asin' }, { label: 'acos', val: 'acos' }, { label: 'atan', val: 'atan' },
    { label: 'ln', val: 'ln' }, { label: 'log', val: 'log' }, { label: 'e', val: 'e' },
    { label: 'π', val: 'π' }, { label: '√', val: 'sqrt' }, { label: 'n!', val: '!' },
    { label: 'x²', val: '^2', className: 'text-purple-600 dark:text-purple-400 font-serif italic' }, 
    { label: 'x³', val: '^3', className: 'text-purple-600 dark:text-purple-400 font-serif italic' }, 
    { label: 'xʸ', val: '^', className: 'text-purple-600 dark:text-purple-400 font-serif italic' },
    { label: '(', val: '(' }, { label: ')', val: ')' }, { label: '|x|', val: 'abs(' },
    { label: 'mod', val: '%' }, { label: 'x', val: 'x' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-200">
      
      {/* Main Container */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row h-[90vh] md:h-auto transition-colors duration-200">
        
        {/* History Sidebar Overlay */}
        <History 
          history={state.history} 
          isOpen={showHistory} 
          onClose={() => setShowHistory(false)}
          onClear={actions.clearHistory}
          onSelect={(expr) => actions.append(expr)} 
        />

        {/* Graph Overlay */}
        <Graph 
          expression={state.expression} 
          isOpen={state.isGraphOpen} 
          onClose={actions.toggleGraph}
          mode={state.mode}
          theme={state.theme}
        />

        {/* Header / Top Bar (Mobile) */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 z-10 border-b border-gray-100 dark:border-gray-800">
          <div className="flex space-x-2">
            <button onClick={() => setShowHistory(true)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <HistoryIcon />
            </button>
             <button onClick={actions.toggleTheme} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
               {state.theme === 'dark' ? <Sun size={20}/> : <Moon size={20} />}
             </button>
          </div>
          
          <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
             <button 
               onClick={actions.toggleMode}
               className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${state.mode === 'DEG' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400'}`}
             >DEG</button>
             <button 
               onClick={actions.toggleMode}
               className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${state.mode === 'RAD' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400'}`}
             >RAD</button>
          </div>
          
          <div className="flex space-x-2">
            <button onClick={actions.toggleGraph} className={`text-gray-500 dark:text-gray-400 hover:text-blue-500 ${state.isGraphOpen ? 'text-blue-500' : ''}`}>
               <LineChart />
            </button>
            <button onClick={actions.toggleScientific} className={`text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white ${state.isScientificOpen ? 'text-blue-500' : ''}`}>
               <CalculatorIcon />
            </button>
          </div>
        </div>

        {/* Scientific Pad (Desktop: Always Visible, Mobile: Toggleable) */}
        <div className={`
          md:w-2/5 p-6 bg-gray-50 dark:bg-gray-850 md:border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors duration-200
          ${state.isScientificOpen ? 'block' : 'hidden md:flex'}
          absolute md:relative inset-0 z-20 md:z-auto bg-white dark:bg-gray-850 mt-16 md:mt-0 overflow-y-auto
        `}>
          <div className="hidden md:flex justify-between items-center mb-6">
             <h3 className="text-gray-400 dark:text-gray-500 text-sm font-semibold tracking-wider">SCIENTIFIC</h3>
             <div className="flex space-x-2 bg-gray-200 dark:bg-gray-800 rounded-lg p-1">
               <button onClick={() => state.mode !== 'DEG' && actions.toggleMode()} className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${state.mode === 'DEG' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>DEG</button>
               <button onClick={() => state.mode !== 'RAD' && actions.toggleMode()} className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${state.mode === 'RAD' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>RAD</button>
             </div>
          </div>

          <div className="grid grid-cols-3 gap-3 content-start">
             {scientificKeys.map((k) => (
               <Button 
                 key={k.label} 
                 variant="scientific" 
                 label={k.label} 
                 onClick={() => actions.append(k.val)}
                 className={k.className}
               />
             ))}
             {/* Memory Controls */}
             <Button variant="scientific" label="MC" onClick={() => actions.handleMemory('MC')} className="text-red-500 dark:text-red-300" />
             <Button variant="scientific" label="MR" onClick={() => actions.handleMemory('MR')} />
             <Button variant="scientific" label="M+" onClick={() => actions.handleMemory('M+')} />
          </div>
          
          <div className="mt-auto pt-6 hidden md:block">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
              <div className="text-gray-400 dark:text-gray-500 text-xs mb-1">MEMORY</div>
              <div className="text-gray-900 dark:text-white text-xl font-mono truncate">{state.memory}</div>
            </div>
          </div>
        </div>


        {/* Standard Pad & Display */}
        <div className="w-full md:w-3/5 p-4 sm:p-6 flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-200">
          
          {/* Header (Desktop) */}
          <div className="hidden md:flex justify-between items-center mb-4">
             <div className="flex space-x-2">
                 <button 
                   onClick={() => setShowHistory(!showHistory)}
                   className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                 >
                   <HistoryIcon size={18} />
                   <span className="text-sm font-medium">History</span>
                 </button>
                 <button 
                   onClick={actions.toggleGraph}
                   className={`flex items-center space-x-2 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${state.isGraphOpen ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                 >
                   <LineChart size={18} />
                   <span className="text-sm font-medium">Graph</span>
                 </button>
             </div>

             <div className="flex items-center space-x-4">
                <button 
                    onClick={actions.toggleTheme}
                    className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                >
                    {state.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} className="text-gray-600"/>}
                </button>
                <div className="text-gray-400 text-xs">SciCalc Pro v1.1</div>
             </div>
          </div>

          <Display 
            expression={state.expression} 
            result={state.result} 
            error={state.error}
            mode={state.mode}
          />

          {/* Standard Keypad Grid */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4 flex-1 content-end">
            
            {/* Row 1 */}
            <Button variant="action" label="AC" onClick={actions.allClear} className="text-red-600 dark:text-red-500" />
            <Button variant="action" label="C" onClick={actions.clear} />
            <Button variant="action" label="⌫" onClick={actions.deleteLast} />
            <Button variant="operator" label="÷" onClick={() => actions.append('÷')} />

            {/* Row 2 */}
            <Button label="7" onClick={() => actions.append('7')} />
            <Button label="8" onClick={() => actions.append('8')} />
            <Button label="9" onClick={() => actions.append('9')} />
            <Button variant="operator" label="×" onClick={() => actions.append('×')} />

            {/* Row 3 */}
            <Button label="4" onClick={() => actions.append('4')} />
            <Button label="5" onClick={() => actions.append('5')} />
            <Button label="6" onClick={() => actions.append('6')} />
            <Button variant="operator" label="-" onClick={() => actions.append('-')} />

            {/* Row 4 */}
            <Button label="1" onClick={() => actions.append('1')} />
            <Button label="2" onClick={() => actions.append('2')} />
            <Button label="3" onClick={() => actions.append('3')} />
            <Button variant="operator" label="+" onClick={() => actions.append('+')} />

            {/* Row 5 */}
            <Button label="0" onClick={() => actions.append('0')} className="col-span-2" />
            <Button label="." onClick={() => actions.append('.')} />
            <Button variant="equals" label="=" onClick={actions.evaluate} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;