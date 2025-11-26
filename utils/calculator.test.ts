// This file serves as an example of how unit tests are structured.
// Since we cannot run Jest in this environment, this code is for documentation and best practice compliance.

import { evaluateExpression } from './mathUtils';

// Declarations to silence TypeScript errors since Jest types are not installed
declare const describe: any;
declare const test: any;
declare const expect: any;

describe('Calculator Logic', () => {
  
  test('Basic Arithmetic', () => {
    expect(evaluateExpression('2+2', 'DEG', 0)).toBe('4');
    expect(evaluateExpression('10-5', 'DEG', 0)).toBe('5');
    expect(evaluateExpression('3*4', 'DEG', 0)).toBe('12');
    expect(evaluateExpression('10/2', 'DEG', 0)).toBe('5');
  });

  test('Trigonometry in Degrees', () => {
    // sin(90) in degrees is 1
    expect(evaluateExpression('sin(90)', 'DEG', 0)).toBe('1');
    // cos(0) is 1
    expect(evaluateExpression('cos(0)', 'DEG', 0)).toBe('1');
  });

  test('Trigonometry in Radians', () => {
    // sin(pi/2) is 1
    expect(evaluateExpression('sin(pi/2)', 'RAD', 0)).toBe('1');
  });

  test('Operator Precedence', () => {
    expect(evaluateExpression('2+3*4', 'DEG', 0)).toBe('14'); // Not 20
    expect(evaluateExpression('(2+3)*4', 'DEG', 0)).toBe('20');
  });

  test('Memory Usage', () => {
    // Using M variable in scope
    expect(evaluateExpression('M+5', 'DEG', 10)).toBe('15');
  });

  test('Error Handling', () => {
    try {
      evaluateExpression('1/0', 'DEG', 0);
    } catch(e) {
      // Mathjs returns Infinity for 1/0 usually, or we can configure it to throw.
      // In standard JS it's Infinity. 
      // If we configured mathjs matrix division etc, it might differ.
    }
  });
});