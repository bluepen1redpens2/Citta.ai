import { describe, it, expect } from 'vitest';
import { validateForm } from '../../src/validation/engine';
import { INITIAL_STATE } from '../../src/store/types';

describe('Regression Testing: Field limits', () => {
  it('should enforce the new 1800 second maximum for timeout', () => {
    const state = { ...INITIAL_STATE, timeoutSeconds: 1801 };
    const result = validateForm(state);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.timeoutSeconds).toContain('Timeout cannot exceed 1800 seconds.');
  });

  it('should enforce max retries to not exceed 10', () => {
    const state = { ...INITIAL_STATE, retryPolicy: 'linear' as const, maxRetries: 11, timeoutSeconds: 30 };
    const result = validateForm(state);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.maxRetries).toContain('Max Retries cannot exceed 10.');
  });
});
