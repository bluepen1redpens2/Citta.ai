import type { FormState } from '../store/types';

export type ValidationRule = {
  field: keyof FormState;
  validate: (value: any, state: FormState) => string | null;
  tab: number; // Indicates which tab this field belongs to
};

// Cross-field rules can be applied at the form level
export const rules: ValidationRule[] = [
  // Tab 1
  {
    field: 'workflowName',
    tab: 1,
    validate: (val: string) => {
      if (!val || val.trim().length === 0) return 'Workflow Name is required.';
      if (val.length < 5) return 'Workflow Name must be at least 5 characters long.';
      return null;
    }
  },
  {
    field: 'workflowType',
    tab: 1,
    validate: (val: string) => {
      if (!val) return 'Workflow Type is required.';
      if (val !== 'scheduled' && val !== 'event-based') return 'Invalid Workflow Type.';
      return null;
    }
  },
  // Tab 2
  {
    field: 'cronExpression',
    tab: 2,
    validate: (val: string, state: FormState) => {
      if (state.workflowType === 'scheduled') {
        if (!val || val.trim().length === 0) return 'Cron Expression is required for scheduled workflows.';
        // Basic cron regex for validation (simple version)
        const cronRegex = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/;
        if (!cronRegex.test(val)) return 'Invalid Cron Expression format.';
      }
      return null;
    }
  },
  {
    field: 'eventSource',
    tab: 2,
    validate: (val: string, state: FormState) => {
      if (state.workflowType === 'event-based') {
        if (!val || val.trim().length === 0) return 'Event Source is required for event-based workflows.';
      }
      return null;
    }
  },
  // Tab 3
  {
    field: 'timeoutSeconds',
    tab: 3,
    validate: (val: number) => {
      if (val === undefined || val === null) return 'Timeout is required.';
      if (val < 1) return 'Timeout must be at least 1 second.';
      if (val > 1800) return 'Timeout cannot exceed 1800 seconds.';
      return null;
    }
  },
  {
    field: 'maxRetries',
    tab: 3,
    validate: (val: number, state: FormState) => {
      if (state.retryPolicy !== 'none') {
        if (val === undefined || val === null) return 'Max Retries is required when Retry Policy is set.';
        if (val < 1) return 'Max Retries must be at least 1.';
        if (val > 10) return 'Max Retries cannot exceed 10.';
      }
      return null;
    }
  }
];

export const crossFieldRules = [
  {
    name: 'estimatedExecutionTime',
    tab: 3,
    validate: (state: FormState) => {
      if (state.estimatedExecutionTime > 7200) {
        return 'Estimated execution time cannot exceed 7200 seconds. Reduce timeout or retries.';
      }
      return null;
    }
  }
];
