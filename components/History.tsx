import React from 'react';
import { HistoryItem } from '../types';
import { Trash2, X, Clock } from 'lucide-react';

interface HistoryProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  onSelect: (expr: string) => void;
}

const History: React.FC<HistoryProps> = ({ history, isOpen, onClose, onClear, onSelect }) => {
  return (
    <div 
      className={`absolute inset-y-0 left-0 w-3/4 sm:w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 z-50 shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
          <Clock size={18} />
          <h2 className="font-semibold">History</h2>
        </div>
        <div className="flex items-center space-x-2">
          {history.length > 0 && (
            <button onClick={onClear} className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors" title="Clear History">
              <Trash2 size={18} />
            </button>
          )}
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100%-60px)] p-2 space-y-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-600 text-sm">
            <p>No history yet</p>
          </div>
        ) : (
          history.map((item) => (
            <div 
              key={item.id} 
              onClick={() => {
                onSelect(item.expression);
                onClose();
              }}
              className="bg-white dark:bg-gray-800/50 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors group shadow-sm border border-gray-100 dark:border-transparent"
            >
              <div className="text-gray-500 dark:text-gray-400 text-sm font-mono mb-1 truncate">{item.expression}</div>
              <div className="text-gray-900 dark:text-white text-lg font-semibold text-right group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">= {item.result}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;