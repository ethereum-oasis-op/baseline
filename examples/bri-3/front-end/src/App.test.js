import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Login button', () => {
  render(<App />);
  const linkElement = screen.getByTestId("login");
  expect(linkElement).toBeInTheDocument();
});
