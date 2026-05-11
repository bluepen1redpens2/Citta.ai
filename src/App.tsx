import React, { useState } from 'react';
import { FormProvider } from './store/FormContext';
import { useFormStore, useFormDispatch } from './store/hooks';
import { validateForm } from './validation/engine';
import { TabBasicInfo } from './features/TabBasicInfo';
import { TabTriggerConfig } from './features/TabTriggerConfig';
import { TabActions } from './features/TabActions';
import { TabReview } from './features/TabReview';
import { useSyncExternalStore } from 'react';

const tabs = [
  { id: 0, label: '1. Basic Info' },
  { id: 1, label: '2. Trigger' },
  { id: 2, label: '3. Actions' },
  { id: 3, label: '4. Review' }
];

const MultiStepForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabErrors, setTabErrors] = useState<Record<number, boolean>>({});
  
  const store = useFormStore();
  const { updateState } = useFormDispatch();

  // Handle changing tabs. We trigger validation here as requested.
  const handleTabChange = (newTab: number) => {
    // Run validation on the current state
    const result = validateForm(store.getState());
    
    // Update store with any errors
    updateState({ errors: result.errors });
    setTabErrors(result.tabErrors);

    // Navigate to new tab
    setActiveTab(newTab);
  };

  const handleSubmit = () => {
    const result = validateForm(store.getState());
    updateState({ errors: result.errors });
    setTabErrors(result.tabErrors);

    if (result.isValid) {
      alert('Form submitted successfully!');
      console.log('Final Data:', store.getState());
    } else {
      // If invalid, navigate to review tab
      setActiveTab(3);
    }
  };

  return (
    <div className="glass-container">
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
            {tabErrors[tab.id + 1] && <span className="tab-error-indicator" title="Validation error in this tab"></span>}
          </button>
        ))}
      </div>

      <div className="form-content">
        {activeTab === 0 && <TabBasicInfo />}
        {activeTab === 1 && <TabTriggerConfig />}
        {activeTab === 2 && <TabActions />}
        {activeTab === 3 && <TabReview onNavigateToTab={setActiveTab} />}
      </div>

      <div className="actions-footer">
        <button 
          className="btn btn-secondary" 
          disabled={activeTab === 0} 
          onClick={() => handleTabChange(activeTab - 1)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Previous
        </button>

        {activeTab < tabs.length - 1 ? (
          <button 
            className="btn btn-primary" 
            onClick={() => handleTabChange(activeTab + 1)}
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        ) : (
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
          >
            Submit Workflow
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <FormProvider>
      <div style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Workflow Builder</h1>
        <MultiStepForm />
      </div>
    </FormProvider>
  );
};

export default App;
