import { create, all } from 'mathjs';
import { CalculatorMode } from '../types';

// Initialize mathjs
const math = create(all);

// Configure specific formatting
math.config({
  number: 'BigNumber',
  precision: 14,
});

/**
 * Creates a custom scope for math evaluation based on the Angle Mode (DEG/RAD)
 */
const createScope = (mode: CalculatorMode, memory: number, extraScope: Record<string, any> = {}) => {
  const isDeg = mode === 'DEG';

  return {
    // Memory value
    M: memory,
    ...extraScope,
    
    // Override trig functions to handle degrees if needed
    sin: (x: any) => isDeg ? math.sin(math.unit(x, 'deg')) : math.sin(x),
    cos: (x: any) => isDeg ? math.cos(math.unit(x, 'deg')) : math.cos(x),
    tan: (x: any) => isDeg ? math.tan(math.unit(x, 'deg')) : math.tan(x),
    
    // Arc functions return radians by default; convert to deg if in DEG mode
    asin: (x: number) => {
      const res = math.asin(x);
      return isDeg ? math.unit(res, 'rad').toNumber('deg') : res;
    },
    acos: (x: number) => {
      const res = math.acos(x);
      return isDeg ? math.unit(res, 'rad').toNumber('deg') : res;
    },
    atan: (x: number) => {
      const res = math.atan(x);
      return isDeg ? math.unit(res, 'rad').toNumber('deg') : res;
    },

    // Logarithms
    ln: math.log, // ln is log base e
    log: math.log10, // common log base 10
  };
};

const sanitizeExpression = (expression: string): string => {
  if (!expression) return '';
  return expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .replace(/√\(/g, 'sqrt(') // Handle function style
    .replace(/√(\d+)/g, 'sqrt($1)') // Handle immediate number
    .replace(/\^/g, '^')
    .replace(/e/g, 'e');
}

export const evaluateExpression = (expression: string, mode: CalculatorMode, memory: number): string => {
  try {
    if (!expression.trim()) return '';

    const sanitisedExpr = sanitizeExpression(expression);
    const scope = createScope(mode, memory);
    const result = math.evaluate(sanitisedExpr, scope);

    // Format output
    const formatted = math.format(result, { precision: 10, lowerExp: -9, upperExp: 9 });
    
    return String(formatted).replace(/"/g, '');

  } catch (err: any) {
    console.error("Calculation Error", err);
    throw new Error(err.message || "Error");
  }
};

export const expressionToTex = (expression: string): string => {
    try {
        if (!expression) return '';
        const sanitized = sanitizeExpression(expression);
        const node = math.parse(sanitized);
        return node.toTex({ parenthesis: 'keep' });
    } catch (e) {
        return '';
    }
};

export const formatNumber = (num: string): string => {
  if (!Number.isNaN(Number(num)) && !num.includes('e')) {
    return Number(num).toLocaleString('en-US', { maximumFractionDigits: 10 });
  }
  return num;
};

// Unit Conversion
export const convertUnit = (value: number, fromUnit: string, toUnit: string): number => {
    try {
        const result = math.evaluate(`${value} ${fromUnit} to ${toUnit}`);
        return result.toNumber(toUnit);
    } catch (e) {
        console.error(e);
        return 0;
    }
}
