import { useState, useCallback, useEffect } from 'react';
import { CalculatorState, CalculatorMode, HistoryItem } from '../types';
import { evaluateExpression } from '../utils/mathUtils';
import { parseNaturalLanguage, explainMath } from '../utils/aiUtils';

const MAX_HISTORY = 10;

// Voice Recognition type definition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const useCalculator = () => {
  const [state, setState] = useState<CalculatorState>({
    expression: '',
    result: '',
    history: [],
    memory: 0,
    mode: 'DEG',
    theme: 'dark',
    isScientificOpen: false,
    isGraphOpen: false,
    isUnitConverterOpen: false,
    isAiThinking: false,
    lastCalculated: false,
    error: null,
    aiExplanation: null,
  });

  const [isListening, setIsListening] = useState(false);

  // Apply theme
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  // Actions
  const clear = useCallback(() => setState(prev => ({ ...prev, expression: '', result: '', error: null, lastCalculated: false, aiExplanation: null })), []);
  
  const allClear = useCallback(() => setState(prev => ({ ...prev, expression: '', result: '', history: [], error: null, lastCalculated: false, aiExplanation: null })), []);

  const closeAi = useCallback(() => setState(prev => ({ ...prev, aiExplanation: null, isAiThinking: false })), []);

  const deleteLast = useCallback(() => {
    setState(prev => {
      if (prev.lastCalculated) return { ...prev, expression: '', result: '', lastCalculated: false, error: null, aiExplanation: null };
      return { ...prev, expression: prev.expression.slice(0, -1), error: null };
    });
  }, []);

  const toggleMode = useCallback(() => setState(prev => ({ ...prev, mode: prev.mode === 'DEG' ? 'RAD' : 'DEG' })), []);
  const toggleScientific = useCallback(() => setState(prev => ({ ...prev, isScientificOpen: !prev.isScientificOpen })), []);
  const toggleGraph = useCallback(() => setState(prev => ({ ...prev, isGraphOpen: !prev.isGraphOpen })), []);
  const toggleUnitConverter = useCallback(() => setState(prev => ({ ...prev, isUnitConverterOpen: !prev.isUnitConverterOpen })), []);
  const toggleTheme = useCallback(() => setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' })), []);

  const append = useCallback((value: string) => {
    setState(prev => {
      let newExpr = prev.expression;
      if (prev.lastCalculated && !['+', '-', '×', '÷', '^', '%'].includes(value)) {
          newExpr = '';
      } else if (prev.lastCalculated) {
          newExpr = prev.result;
      }
      
      // Handle function syntax
      if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt', 'abs'].includes(value)) {
        newExpr += `${value}(`;
      } else {
        newExpr += value;
      }

      return { ...prev, expression: newExpr, lastCalculated: false, error: null, aiExplanation: null };
    });
  }, []);

  const evaluate = useCallback(() => {
    setState(prev => {
      if (!prev.expression) return prev;
      try {
        const result = evaluateExpression(prev.expression, prev.mode, prev.memory);
        const newHistory = [{ id: Date.now().toString(), expression: prev.expression, result, timestamp: Date.now() }, ...prev.history].slice(0, MAX_HISTORY);
        return { ...prev, result, expression: result, history: newHistory, lastCalculated: true, error: null };
      } catch (err) {
        return { ...prev, error: "Error", lastCalculated: false };
      }
    });
  }, []);

  // AI Actions
  const handleVoiceInput = useCallback(() => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
          alert("Voice recognition not supported in this browser.");
          return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = async (event: any) => {
          const transcript = event.results[0][0].transcript;
          setState(prev => ({ ...prev, isAiThinking: true }));
          try {
              // Use AI to convert speech to math expression
              const mathExpr = await parseNaturalLanguage(transcript);
              setState(prev => ({ 
                  ...prev, 
                  expression: mathExpr, 
                  isAiThinking: false 
              }));
          } catch (e) {
              setState(prev => ({ ...prev, error: "AI Error", isAiThinking: false }));
          }
      };

      recognition.start();
  }, []);

  const requestAiExplanation = useCallback(async () => {
    // Explain the last calculation or current result
    const targetExpr = state.lastCalculated ? state.history[0]?.expression : state.expression;
    const targetRes = state.lastCalculated ? state.history[0]?.result : state.result;

    if (!targetExpr) return;

    setState(prev => ({ ...prev, isAiThinking: true }));
    const explanation = await explainMath(targetExpr, targetRes || '?');
    setState(prev => ({ ...prev, aiExplanation: explanation, isAiThinking: false }));
  }, [state.lastCalculated, state.history, state.expression, state.result]);

  const handleMemory = useCallback((action: 'MC' | 'MR' | 'MS' | 'M+') => {
      setState(prev => {
        let newMemory = prev.memory;
        let newExpr = prev.expression;
        let newLastCalculated = prev.lastCalculated;
        try {
          const currentVal = prev.result || evaluateExpression(prev.expression || '0', prev.mode, prev.memory);
          const numVal = parseFloat(currentVal);
          switch (action) {
            case 'MC': newMemory = 0; break;
            case 'MS': if (!isNaN(numVal)) newMemory = numVal; break;
            case 'M+': if (!isNaN(numVal)) newMemory += numVal; break;
            case 'MR': 
                newExpr = prev.lastCalculated ? String(newMemory) : prev.expression + String(newMemory);
                newLastCalculated = false;
                break;
          }
        } catch (e) {}
        return { ...prev, memory: newMemory, expression: newExpr, lastCalculated: newLastCalculated };
      });
  }, []);

  const clearHistory = useCallback(() => setState(prev => ({ ...prev, history: [] })), []);

  return {
    state,
    isListening,
    actions: {
      append,
      deleteLast,
      clear,
      allClear,
      closeAi,
      evaluate,
      toggleMode,
      toggleScientific,
      toggleGraph,
      toggleTheme,
      toggleUnitConverter,
      handleMemory,
      clearHistory,
      handleVoiceInput,
      requestAiExplanation
    }
  };
};