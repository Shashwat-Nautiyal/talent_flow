import React from 'react';
import { render } from '@testing-library/react';

// Simple smoke test to verify the test infrastructure works
describe('Test Infrastructure', () => {
  it('should be able to run tests', () => {
    expect(1 + 1).toBe(2);
  });
  
  it('should be able to render React components', () => {
    const TestComponent = () => <div>Test</div>;
    const { container } = render(<TestComponent />);
    expect(container).toBeInTheDocument();
  });
});
