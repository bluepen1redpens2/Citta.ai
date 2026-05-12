import React, { createContext, useRef } from 'react';
import { FormStore } from './FormStore';

export const FormContext = createContext<FormStore | null>(null);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Ensure the store is created only once per provider instance
  const storeRef = useRef<FormStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = new FormStore();
  }

  return (
    <FormContext.Provider value={storeRef.current}>
      {children}
    </FormContext.Provider>
  );
};
