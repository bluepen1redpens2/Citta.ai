import { INITIAL_STATE } from './types';
import type { FormState, Priority } from './types';

export type Listener = () => void;
export type Updater<T> = (prevState: T) => T;

export class FormStore {
  private state: FormState;
  private listeners: Set<Listener> = new Set();

  constructor(initialState: FormState = INITIAL_STATE) {
    this.state = initialState;
    this.recalculateDerivedValues();
  }

  // Subscribe a component to store changes
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Get current state
  getState(): FormState {
    return this.state;
  }

  // Update state immutably
  updateState(updater: Partial<FormState> | Updater<FormState>) {
    const nextState = typeof updater === 'function' ? updater(this.state) : { ...this.state, ...updater };
    
    // Check if workflowType changed to reset incompatible fields safely
    let modifiedState = { ...nextState };
    if (nextState.workflowType !== this.state.workflowType) {
      if (nextState.workflowType === 'scheduled') {
        modifiedState.eventSource = undefined;
        modifiedState.cronExpression = this.state.cronExpression || '';
      } else {
        modifiedState.cronExpression = undefined;
        modifiedState.eventSource = this.state.eventSource || '';
      }
    }

    // Assign modified state temporarily to recalculate derived values
    this.state = modifiedState;
    this.recalculateDerivedValues();

    // Notify listeners
    this.notify();
  }

  // Helper for deeply nested or specific field updates without creating a huge useEffect
  updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    this.updateState({ [field]: value } as Partial<FormState>);
  }

  // Recalculate derived state such as estimatedExecutionTime
  private recalculateDerivedValues() {
    const priorityWeights: Record<Priority, number> = {
      low: 1,
      medium: 1.5,
      high: 2
    };

    const weight = priorityWeights[this.state.priority];
    // Base time is timeoutSeconds. Retries add extra execution time.
    // If exponential, it would be more complex, but let's do a simple formula:
    // estimated = (timeoutSeconds + (maxRetries * timeoutSeconds * 0.5)) * priorityWeight
    
    const retriesFactor = this.state.retryPolicy === 'none' ? 0 : this.state.maxRetries;
    const estimated = (this.state.timeoutSeconds + (retriesFactor * this.state.timeoutSeconds * 0.5)) * weight;
    
    this.state.estimatedExecutionTime = Math.round(estimated);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

// Create a singleton instance for global use if needed, 
// though we will primarily provide it via React Context for testability and scoping.
export const globalStore = new FormStore();
