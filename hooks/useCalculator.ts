import { useState, useCallback, useEffect } from 'react';
import { CalculatorState, CalculatorMode, HistoryItem } from '../types';
import { evaluateExpression } from '../utils/mathUtils';

const MAX_HISTORY = 10;

export const useCalculator = () => {
  const [state, setState] = useState<CalculatorState>({
    expression: '',
    result: '',
    history: [],
    memory: 0,
    mode: 'DEG',
    theme: 'dark', // Default to dark match index.html
    isScientificOpen: false,
    isGraphOpen: false,
    lastCalculated: false,
    error: null,
  });

  // Apply theme to document
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  const clear = useCallback(() => {
    setState(prev => ({
      ...prev,
      expression: '',
      result: '',
      error: null,
      lastCalculated: false
    }));
  }, []);

  const allClear = useCallback(() => {
    setState(prev => ({
      ...prev,
      expression: '',
      result: '',
      history: [],
      error: null,
      lastCalculated: false
    }));
  }, []);

  const deleteLast = useCallback(() => {
    setState(prev => {
      if (prev.lastCalculated) {
        return { ...prev, expression: '', result: '', lastCalculated: false, error: null };
      }
      return {
        ...prev,
        expression: prev.expression.slice(0, -1),
        error: null
      };
    });
  }, []);

  const toggleMode = useCallback(() => {
    setState(prev => ({ ...prev, mode: prev.mode === 'DEG' ? 'RAD' : 'DEG' }));
  }, []);

  const toggleScientific = useCallback(() => {
    setState(prev => ({ ...prev, isScientificOpen: !prev.isScientificOpen }));
  }, []);

  const toggleGraph = useCallback(() => {
    setState(prev => ({ ...prev, isGraphOpen: !prev.isGraphOpen }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  }, []);

  const append = useCallback((value: string) => {
    setState(prev => {
      let newExpr = prev.expression;
      
      if (prev.lastCalculated) {
        // If we just calculated, and user types an operator, continue with result
        if (['+', '-', '×', '÷', '^', '%'].includes(value)) {
          newExpr = prev.result;
        } else {
          // If user types a number/function, start fresh
          newExpr = '';
        }
      }

      // Handle specific function appends
      if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt', 'abs'].includes(value)) {
        newExpr += `${value}(`;
      } else {
        newExpr += value;
      }

      return {
        ...prev,
        expression: newExpr,
        lastCalculated: false,
        error: null,
      };
    });
  }, []);

  const evaluate = useCallback(() => {
    setState(prev => {
      if (!prev.expression) return prev;

      try {
        const result = evaluateExpression(prev.expression, prev.mode, prev.memory);
        
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          expression: prev.expression,
          result: result,
          timestamp: Date.now()
        };

        const newHistory = [newHistoryItem, ...prev.history].slice(0, MAX_HISTORY);

        return {
          ...prev,
          result,
          expression: result, // Update expression to result for chaining
          history: newHistory,
          lastCalculated: true,
          error: null
        };
      } catch (err) {
        return {
          ...prev,
          error: "Error",
          lastCalculated: false
        };
      }
    });
  }, []);

  const handleMemory = useCallback((action: 'MC' | 'MR' | 'MS' | 'M+') => {
    setState(prev => {
      let newMemory = prev.memory;
      let newExpr = prev.expression;
      let newLastCalculated = prev.lastCalculated;

      try {
        const currentVal = prev.result || evaluateExpression(prev.expression || '0', prev.mode, prev.memory);
        const numVal = parseFloat(currentVal);

        switch (action) {
          case 'MC':
            newMemory = 0;
            break;
          case 'MS':
            if (!isNaN(numVal)) newMemory = numVal;
            break;
          case 'M+':
            if (!isNaN(numVal)) newMemory += numVal;
            break;
          case 'MR':
            newExpr = prev.lastCalculated ? String(newMemory) : prev.expression + String(newMemory);
            newLastCalculated = false;
            break;
        }
      } catch (e) {
        // Ignore memory errors silently
      }

      return {
        ...prev,
        memory: newMemory,
        expression: newExpr,
        lastCalculated: newLastCalculated
      };
    });
  }, []);

  const clearHistory = useCallback(() => {
    setState(prev => ({ ...prev, history: [] }));
  }, []);

  return {
    state,
    actions: {
      append,
      deleteLast,
      clear,
      allClear,
      evaluate,
      toggleMode,
      toggleScientific,
      toggleGraph,
      toggleTheme,
      handleMemory,
      clearHistory
    }
  };
};