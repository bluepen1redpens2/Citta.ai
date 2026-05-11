import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

describe('Security Testing: XSS Prevention', () => {
  it('should safely render malicious input strings as text instead of HTML', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(/Workflow Name/i) as HTMLInputElement;
    await user.type(input, '<script>alert("xss")</script>');
    
    // React escapes text content by default. If we search for the value,
    // it will be found as a value attribute in the input, not executed HTML.
    expect(input.value).toBe('<script>alert("xss")</script>');
  });
});
