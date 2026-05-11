import type { FormState } from '../store/types';
import { rules, crossFieldRules } from './rules';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  tabErrors: Record<number, boolean>;
}

export const validateForm = (state: FormState): ValidationResult => {
  const errors: Record<string, string[]> = {};
  const tabErrors: Record<number, boolean> = {
    1: false,
    2: false,
    3: false,
    4: false
  };

  // Field-level rules
  for (const rule of rules) {
    const value = state[rule.field];
    const errorMsg = rule.validate(value, state);
    if (errorMsg) {
      if (!errors[rule.field as string]) {
        errors[rule.field as string] = [];
      }
      errors[rule.field as string].push(errorMsg);
      tabErrors[rule.tab] = true;
    }
  }

  // Cross-field rules
  for (const rule of crossFieldRules) {
    const errorMsg = rule.validate(state);
    if (errorMsg) {
      if (!errors[rule.name]) {
        errors[rule.name] = [];
      }
      errors[rule.name].push(errorMsg);
      tabErrors[rule.tab] = true;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    tabErrors
  };
};
