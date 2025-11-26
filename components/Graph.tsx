import React, { useMemo } from 'react';
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { X } from 'lucide-react';
import { generateGraphData } from '../utils/mathUtils';
import { CalculatorMode, ThemeMode } from '../types';

interface GraphProps {
  expression: string;
  isOpen: boolean;
  onClose: () => void;
  mode: CalculatorMode;
  theme: ThemeMode;
}

const Graph: React.FC<GraphProps> = ({ expression, isOpen, onClose, mode, theme }) => {
  const graphData = useMemo(() => {
    if (!isOpen || !expression) return null;
    return generateGraphData(expression, mode);
  }, [expression, isOpen, mode]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#4b5563',
        },
        title: {
          display: true,
          text: 'x',
          color: theme === 'dark' ? '#9ca3af' : '#4b5563',
        }
      },
      y: {
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#4b5563',
        },
        title: {
          display: true,
          text: 'y',
          color: theme === 'dark' ? '#9ca3af' : '#4b5563',
        }
      },
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    interaction: {
        mode: 'nearest' as const,
        axis: 'x' as const,
        intersect: false
    }
  };

  const data = {
    labels: graphData?.labels || [],
    datasets: [
      {
        label: `f(x) = ${expression}`,
        data: graphData?.data || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 10,
      },
    ],
  };

  return (
    <div 
      className={`absolute inset-0 bg-gray-50 dark:bg-gray-900 z-40 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Graph: <span className="font-mono text-blue-600 dark:text-blue-400 text-sm">{expression || 'No Expression'}</span></h2>
        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors bg-gray-100 dark:bg-gray-800 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 relative">
        {expression ? (
            <div className="w-full h-full">
                <Line options={options} data={data} />
            </div>
        ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
                <p>Enter an expression with 'x' to graph</p>
            </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs text-center text-gray-500">
         Range: -10 to 10
      </div>
    </div>
  );
};

export default Graph;