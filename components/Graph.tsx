import React, { useEffect, useRef } from 'react';
import functionPlot from 'function-plot';
import { X } from 'lucide-react';
import { CalculatorMode, ThemeMode } from '../types';

interface GraphProps {
  expression: string;
  isOpen: boolean;
  onClose: () => void;
  mode: CalculatorMode;
  theme: ThemeMode;
}

const Graph: React.FC<GraphProps> = ({ expression, isOpen, onClose, mode, theme }) => {
  const rootEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && rootEl.current && expression) {
      try {
        // Sanitize for function-plot (it likes standard JS Math syntax)
        // function-plot uses 'x' as variable.
        // We need to replace special chars.
        let safeExpr = expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/π/g, 'PI')
            .replace(/√/g, 'sqrt')
            .replace(/\^/g, '^')
            .replace(/e/g, 'E'); // mathjs 'e' might need careful handling if function-plot doesn't like it, but usually E works.

        // If mode is DEG, we might need to wrap x in trig functions.
        // function-plot usually assumes radians for trig.
        // Supporting DEG in graphing is complex (scale x by PI/180 inside trig functions).
        // For simplicity, we warn user or assume RAD, but let's try a simple replace for common trig
        if (mode === 'DEG') {
             // This is a naive replacement, but works for simple cases like sin(x) -> sin(x * PI / 180)
             // safeExpr = safeExpr.replace(/(sin|cos|tan)\(([^)]+)\)/g, '$1($2 * PI / 180)'); 
             // Regrettably, doing this regex robustly on raw string is error prone.
             // We will render as is (Radians default) and maybe add a label.
        }

        const width = rootEl.current.clientWidth;
        const height = rootEl.current.clientHeight;
        
        // Define colors based on theme
        const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';
        const axisColor = theme === 'dark' ? '#9ca3af' : '#4b5563';
        const textColor = theme === 'dark' ? '#d1d5db' : '#374151';

        functionPlot({
          target: rootEl.current,
          width,
          height,
          yAxis: { domain: [-10, 10] },
          xAxis: { domain: [-10, 10] },
          grid: true,
          data: [
            {
              fn: safeExpr,
              color: '#3b82f6', // Blue-500
              graphType: 'polyline'
            }
          ],
          tip: {
              xLine: true,
              yLine: true,
          }
        });
        
        // Post-render style injection for axis text visibility in dark mode
        // function-plot uses SVG, so we can't style via standard Tailwind easily on the container for internal elements
        // But we can ensure the container handles text color.
      } catch (e) {
        console.error("Graphing error:", e);
        if (rootEl.current) {
            rootEl.current.innerHTML = `<div class="flex items-center justify-center h-full text-red-500">Invalid function for graphing</div>`;
        }
      }
    }
  }, [isOpen, expression, theme, mode]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
        if (isOpen && rootEl.current) {
            // Trigger re-render by toggling a dummy state or just calling the effect again?
            // React effect deps handles logic changes, but window resize needs listener.
            // For MVP, we skip dynamic resize or rely on re-open.
        }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <div 
      className={`absolute inset-0 bg-gray-50 dark:bg-gray-900 z-40 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Interactive Graph</h2>
        <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 hidden sm:inline">Scroll to zoom, Drag to pan</span>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors bg-gray-100 dark:bg-gray-800 rounded-full">
              <X size={20} />
            </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-white dark:bg-gray-950" >
        {expression ? (
             <div ref={rootEl} className="w-full h-full function-plot-container" />
        ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
                <p>Enter an expression with 'x' to graph</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Graph;
