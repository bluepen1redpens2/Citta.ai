export type WorkflowType = 'scheduled' | 'event-based';
export type Priority = 'low' | 'medium' | 'high';
export type RetryPolicy = 'none' | 'linear' | 'exponential';

export interface FormState {
  // Tab 1: Basic Info
  workflowName: string;
  workflowType: WorkflowType;
  priority: Priority;

  // Tab 2: Trigger Config
  cronExpression?: string; // For scheduled
  eventSource?: string; // For event-based

  // Tab 3: Actions
  retryPolicy: RetryPolicy;
  maxRetries: number;
  timeoutSeconds: number;

  // Derived Values
  estimatedExecutionTime: number;

  // Validation State
  errors: Record<string, string[]>;
}

export const INITIAL_STATE: FormState = {
  workflowName: '',
  workflowType: 'scheduled',
  priority: 'low',
  
  cronExpression: '',
  
  retryPolicy: 'none',
  maxRetries: 0,
  timeoutSeconds: 30,
  
  estimatedExecutionTime: 30, // 30 * 0 * 1 weight = 0, but base timeout is 30. Let's calculate properly later.
  
  errors: {}
};
