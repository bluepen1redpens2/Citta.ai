import { describe, it, expect } from 'vitest';
import { validateForm } from '../../src/validation/engine';
import { FormState } from '../../src/store/types';

describe('Acceptance Testing: Business Rules', () => {
  it('Scenario: User attempts to schedule a workflow without a cron expression', () => {
    // Given the user is configuring a 'scheduled' workflow
    const state: Partial<FormState> = {
      workflowType: 'scheduled',
      cronExpression: ''
    };

    // When the form is validated
    const result = validateForm(state as FormState);

    // Then an error regarding the missing cron expression should be presented
    expect(result.isValid).toBe(false);
    expect(result.errors.cronExpression).toBeDefined();
    expect(result.errors.cronExpression[0]).toMatch(/Cron Expression is required/);
  });

  it('Scenario: User configures an event-based workflow', () => {
    // Given the user is configuring an 'event-based' workflow
    const state: Partial<FormState> = {
      workflowName: 'Webhook trigger',
      workflowType: 'event-based',
      eventSource: 'github-webhook',
      timeoutSeconds: 30,
      retryPolicy: 'none'
    };

    // When the form is validated
    const result = validateForm(state as FormState);

    // Then no cron expression is required and it should be valid
    expect(result.isValid).toBe(true);
    expect(result.errors.cronExpression).toBeUndefined();
  });
});
