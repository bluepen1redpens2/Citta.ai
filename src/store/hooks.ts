import { useContext, useCallback, useSyncExternalStore } from 'react';
import { FormContext } from './FormContext';
import type { FormState } from './types';
import { FormStore } from './FormStore';

// Helper to deeply compare selected slices (simple implementation for plain objects)
const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }
  return true;
};

export const useFormStore = (): FormStore => {
  const store = useContext(FormContext);
  if (!store) {
    throw new Error('useFormStore must be used within a FormProvider');
  }
  return store;
};

// Hook to subscribe to a specific slice of the global form state
export function useFormSelector<T>(selector: (state: FormState) => T): T {
  const store = useFormStore();

  const getSnapshot = useCallback(() => {
    return selector(store.getState());
  }, [store, selector]);

  // We implement custom memoization inside the hook because useSyncExternalStore
  // requires getSnapshot to return a cached result if the value hasn't changed.
  // Actually, useSyncExternalStore will check Object.is, so we must return the same reference
  // if deepEqual is true.

  // To properly support deepEqual with useSyncExternalStore, we can keep track of the last result:
  let lastSnapshot: T | undefined;
  const getMemoizedSnapshot = useCallback(() => {
    const nextSnapshot = getSnapshot();
    if (lastSnapshot !== undefined && deepEqual(lastSnapshot, nextSnapshot)) {
      return lastSnapshot;
    }
    lastSnapshot = nextSnapshot;
    return nextSnapshot;
  }, [getSnapshot]);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      return store.subscribe(onStoreChange);
    },
    [store]
  );

  return useSyncExternalStore(subscribe, getMemoizedSnapshot, getMemoizedSnapshot);
}

// Helper hook to get the dispatch/update functions
export const useFormDispatch = () => {
  const store = useFormStore();
  return {
    updateState: store.updateState.bind(store),
    updateField: store.updateField.bind(store)
  };
};
