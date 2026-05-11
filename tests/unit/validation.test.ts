import { describe, it, expect } from 'vitest';
import { validateForm } from '../../src/validation/engine';
import { INITIAL_STATE } from '../../src/store/types';

describe('Unit Testing: Form Validation Engine', () => {
  it('should validate an empty form as invalid', () => {
    const result = validateForm(INITIAL_STATE);
    expect(result.isValid).toBe(false);
    expect(result.errors.workflowName).toBeDefined();
    expect(result.errors.workflowName[0]).toBe('Workflow Name is required.');
  });

  it('should validate a correct scheduled workflow', () => {
    const result = validateForm({
      ...INITIAL_STATE,
      workflowName: 'Nightly Backup',
      workflowType: 'scheduled',
      cronExpression: '0 0 * * *',
      timeoutSeconds: 300,
      retryPolicy: 'none'
    });
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });
});
