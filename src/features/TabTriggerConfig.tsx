import React from 'react';
import { TextInput } from '../components/FormFields';
import { useFormSelector } from '../store/hooks';
import type { WorkflowType } from '../store/types';

export const TabTriggerConfig: React.FC = () => {
  const workflowType = useFormSelector((state) => state.workflowType as WorkflowType);

  return (
    <div className="tab-pane">
      <h2>Trigger Configuration</h2>
      <p className="subtitle">Configure when this workflow should execute.</p>
      
      {workflowType === 'scheduled' && (
        <TextInput 
          label="Cron Expression" 
          name="cronExpression" 
          placeholder="e.g. 0 0 * * *" 
        />
      )}

      {workflowType === 'event-based' && (
        <TextInput 
          label="Event Source (Topic/Queue)" 
          name="eventSource" 
          placeholder="e.g. user.signup.topic" 
        />
      )}
    </div>
  );
};
