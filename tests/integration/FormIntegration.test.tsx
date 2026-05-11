import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

describe('Integration Testing: MultiStepForm integration with FormStore', () => {
  it('should update state and show errors on next tab navigation', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click Next without filling anything
    const nextBtn = screen.getByText(/Next/i);
    await user.click(nextBtn);

    // The Tab 1 (Basic Info) should have an error indicator because the fields are empty
    const errorIndicator = document.querySelector('.tab-error-indicator');
    expect(errorIndicator).toBeInTheDocument();
  });
});
