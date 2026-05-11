import React from 'react';
import { TextInput, SelectInput } from '../components/FormFields';

export const TabBasicInfo: React.FC = () => {
  return (
    <div className="tab-pane">
      <h2>Basic Information</h2>
      <p className="subtitle">Configure the core details of your workflow.</p>
      
      <TextInput 
        label="Workflow Name" 
        name="workflowName" 
        placeholder="e.g. Daily Data Aggregation" 
      />
      
      <SelectInput 
        label="Workflow Type" 
        name="workflowType" 
        options={[
          { label: 'Scheduled', value: 'scheduled' },
          { label: 'Event-Based', value: 'event-based' }
        ]} 
      />
      
      <SelectInput 
        label="Priority" 
        name="priority" 
        options={[
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' }
        ]} 
      />
    </div>
  );
};
