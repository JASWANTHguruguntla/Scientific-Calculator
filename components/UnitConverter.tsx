import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, ArrowDown } from 'lucide-react';
import { convertUnit } from '../utils/mathUtils';
import { UnitCategory } from '../types';

interface UnitConverterProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: Record<UnitCategory, string[]> = {
    length: ['mm', 'cm', 'm', 'km', 'inch', 'ft', 'yard', 'mile'],
    mass: ['mg', 'g', 'kg', 'oz', 'lb', 'ton'],
    temperature: ['degC', 'degF', 'K'],
    volume: ['ml', 'l', 'cup', 'pint', 'quart', 'gal'],
    digital: ['b', 'B', 'kb', 'MB', 'GB', 'TB']
};

const UnitConverter: React.FC<UnitConverterProps> = ({ isOpen, onClose }) => {
    const [category, setCategory] = useState<UnitCategory>('length');
    const [fromUnit, setFromUnit] = useState<string>(CATEGORIES['length'][0]);
    const [toUnit, setToUnit] = useState<string>(CATEGORIES['length'][1]);
    const [value, setValue] = useState<string>('1');
    const [result, setResult] = useState<string>('');

    // Update units when category changes
    useEffect(() => {
        setFromUnit(CATEGORIES[category][0]);
        setToUnit(CATEGORIES[category][1]);
    }, [category]);

    // Calculate
    useEffect(() => {
        if (!value || isNaN(Number(value))) {
            setResult('---');
            return;
        }
        const res = convertUnit(Number(value), fromUnit, toUnit);
        setResult(res.toLocaleString(undefined, { maximumFractionDigits: 6 }));
    }, [value, fromUnit, toUnit, category]);

    return (
        <div 
          className={`absolute inset-0 bg-white dark:bg-gray-950 z-50 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
              <ArrowRightLeft size={18} className="text-blue-500" />
              <h2 className="font-semibold text-lg">Unit Converter</h2>
            </div>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
            
            {/* Category Selector */}
            <div className="flex space-x-2 overflow-x-auto pb-6 w-full max-w-lg no-scrollbar snap-x">
                {(Object.keys(CATEGORIES) as UnitCategory[]).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`flex-none snap-start px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all border ${category === cat ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Converter Card */}
            <div className="w-full max-w-lg space-y-4">
                
                {/* FROM Section */}
                <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 block">From</label>
                    <div className="flex space-x-4 items-center">
                        <input 
                            type="number" 
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-white dark:bg-gray-800 border border-transparent focus:border-blue-500 rounded-xl p-3 text-2xl font-mono text-gray-900 dark:text-white outline-none transition-all placeholder-gray-300 dark:placeholder-gray-700 h-16"
                            placeholder="0"
                        />
                        <div className="relative w-1/3 min-w-[120px] h-16">
                            <select 
                                value={fromUnit}
                                onChange={(e) => setFromUnit(e.target.value)}
                                className="w-full h-full appearance-none bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-2 pr-8 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                            >
                                {CATEGORIES[category].map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <ArrowDown size={14} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider / Swap Icon */}
                <div className="flex justify-center -my-2 relative z-10">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-2 text-gray-400 shadow-sm">
                        <ArrowDown size={20} />
                    </div>
                </div>

                {/* TO Section */}
                <div className="bg-blue-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-blue-100 dark:border-gray-800 shadow-sm">
                    <label className="text-xs font-bold text-blue-400 dark:text-blue-400 uppercase tracking-wider mb-2 block">To</label>
                    <div className="flex space-x-4 items-center">
                        <div className="flex-1 bg-white/50 dark:bg-gray-800 border border-blue-100 dark:border-transparent rounded-xl p-3 text-2xl font-mono font-bold text-blue-600 dark:text-blue-300 overflow-x-auto h-16 flex items-center">
                            {result}
                        </div>
                        <div className="relative w-1/3 min-w-[120px] h-16">
                            <select 
                                value={toUnit}
                                onChange={(e) => setToUnit(e.target.value)}
                                className="w-full h-full appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-2 pr-8 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                            >
                                {CATEGORIES[category].map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <ArrowDown size={14} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
          </div>
        </div>
    );
};

export default UnitConverter;