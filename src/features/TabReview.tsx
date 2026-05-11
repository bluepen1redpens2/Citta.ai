import React from 'react';
import { useFormStore } from '../store/hooks';
import { useSyncExternalStore } from 'react';

interface TabReviewProps {
  onNavigateToTab: (tabIndex: number) => void;
}

export const TabReview: React.FC<TabReviewProps> = ({ onNavigateToTab }) => {
  const store = useFormStore();
  const state = useSyncExternalStore(store.subscribe.bind(store), store.getState.bind(store));

  const hasErrors = Object.keys(state.errors).length > 0;

  // We map fields to their respective tab indexes for navigation
  const fieldToTabMap: Record<string, number> = {
    workflowName: 0,
    workflowType: 0,
    priority: 0,
    cronExpression: 1,
    eventSource: 1,
    retryPolicy: 2,
    maxRetries: 2,
    timeoutSeconds: 2,
    estimatedExecutionTime: 2
  };

  return (
    <div className="tab-pane">
      <h2>Review & Submit</h2>
      <p className="subtitle">Review your configuration before submission.</p>

      {hasErrors && (
        <div className="error-summary-card">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            Validation Errors Detected
          </h3>
          <ul className="error-list">
            {Object.entries(state.errors).map(([field, msgs]) => (
              <li key={field}>
                <button 
                  className="error-link" 
                  onClick={() => onNavigateToTab(fieldToTabMap[field] ?? 0)}
                  type="button"
                >
                  {field}: {msgs[0]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="review-section" style={{ marginTop: hasErrors ? '2rem' : '0' }}>
        <h3>1. Basic Info</h3>
        <div className="review-grid" style={{marginTop: '1rem'}}>
          <div className="review-item">
            <span className="review-label">Workflow Name</span>
            <span className="review-value">{state.workflowName || '-'}</span>
          </div>
          <div className="review-item">
            <span className="review-label">Type</span>
            <span className="review-value">{state.workflowType}</span>
          </div>
          <div className="review-item">
            <span className="review-label">Priority</span>
            <span className="review-value">{state.priority}</span>
          </div>
        </div>
      </div>

      <div className="review-section">
        <h3>2. Trigger Configuration</h3>
        <div className="review-grid" style={{marginTop: '1rem'}}>
          {state.workflowType === 'scheduled' ? (
            <div className="review-item">
              <span className="review-label">Cron Expression</span>
              <span className="review-value">{state.cronExpression || '-'}</span>
            </div>
          ) : (
            <div className="review-item">
              <span className="review-label">Event Source</span>
              <span className="review-value">{state.eventSource || '-'}</span>
            </div>
          )}
        </div>
      </div>

      <div className="review-section">
        <h3>3. Actions</h3>
        <div className="review-grid" style={{marginTop: '1rem'}}>
          <div className="review-item">
            <span className="review-label">Retry Policy</span>
            <span className="review-value">{state.retryPolicy}</span>
          </div>
          {state.retryPolicy !== 'none' && (
            <div className="review-item">
              <span className="review-label">Max Retries</span>
              <span className="review-value">{state.maxRetries}</span>
            </div>
          )}
          <div className="review-item">
            <span className="review-label">Timeout</span>
            <span className="review-value">{state.timeoutSeconds}s</span>
          </div>
          <div className="review-item">
            <span className="review-label">Estimated Execution Time</span>
            <span className="review-value" style={{color: 'var(--primary-accent)'}}>{state.estimatedExecutionTime}s</span>
          </div>
        </div>
      </div>
    </div>
  );
};
