import { describe, it, expect } from 'vitest';

const sum = (a: number, b: number) => a + b;

describe('Sum Function', () => {
  it('should add two numbers correctly', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(sum(-2, 3)).toBe(1);
  });

  it('should return zero when adding zero', () => {
    expect(sum(0, 0)).toBe(0);
  });
});
