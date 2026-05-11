import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';

describe('Performance Testing: Render Efficiency', () => {
  it('should batch state updates without triggering excessive renders', () => {
    render(<App />);
    const input = screen.getByLabelText(/Workflow Name/i) as HTMLInputElement;
    
    const startTime = performance.now();
    
    for(let i = 0; i < 100; i++) {
      fireEvent.change(input, { target: { value: `Test ${i}` } });
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(500);
  });
});
