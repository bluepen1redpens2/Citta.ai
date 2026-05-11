import React from 'react';
import { SelectInput, NumberInput } from '../components/FormFields';
import { useFormSelector } from '../store/hooks';
import type { RetryPolicy } from '../store/types';

export const TabActions: React.FC = () => {
  const retryPolicy = useFormSelector((state) => state.retryPolicy as RetryPolicy);
  const estimatedExecutionTime = useFormSelector((state) => state.estimatedExecutionTime);
  const estimatedError = useFormSelector((state) => state.errors['estimatedExecutionTime']);

  return (
    <div className="tab-pane">
      <h2>Actions & Policies</h2>
      <p className="subtitle">Configure failure handling and limits.</p>
      
      <SelectInput 
        label="Retry Policy" 
        name="retryPolicy" 
        options={[
          { label: 'None', value: 'none' },
          { label: 'Linear Backoff', value: 'linear' },
          { label: 'Exponential Backoff', value: 'exponential' }
        ]} 
      />
      
      {retryPolicy !== 'none' && (
        <NumberInput 
          label="Max Retries" 
          name="maxRetries" 
          min={1}
          max={10}
        />
      )}

      <NumberInput 
        label="Timeout (seconds)" 
        name="timeoutSeconds" 
        min={1}
        max={1800}
      />

      <div className={`derived-value-card ${estimatedError ? 'input-error' : ''}`}>
        <div className="label-col">
          <label>Estimated Execution Time</label>
          <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Calculated based on timeout, retries, and priority.</div>
        </div>
        <div className="value">{estimatedExecutionTime}s</div>
      </div>
      {estimatedError && (
        <div className="error-text" style={{marginTop: '0.5rem'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {estimatedError[0]}
        </div>
      )}
    </div>
  );
};
