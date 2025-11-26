export type CalculatorMode = 'DEG' | 'RAD';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type ButtonVariant = 'default' | 'operator' | 'action' | 'scientific' | 'equals';

export type ThemeMode = 'light' | 'dark';

export interface CalculatorState {
  expression: string;
  result: string;
  history: HistoryItem[];
  memory: number;
  mode: CalculatorMode;
  theme: ThemeMode;
  isScientificOpen: boolean; // For mobile toggle
  isGraphOpen: boolean;
  lastCalculated: boolean;
  error: string | null;
}

export type ButtonConfig = {
  label: string;
  value: string;
  variant: ButtonVariant;
  action?: 'clear' | 'delete' | 'evaluate' | 'memory' | 'toggleScientific' | 'toggleMode' | 'toggleGraph';
  memoryAction?: 'MC' | 'MR' | 'MS' | 'M+';
  className?: string;
};