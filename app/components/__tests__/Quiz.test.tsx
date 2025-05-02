import { render, screen, fireEvent } from '@testing-library/react';
import Quiz from '../Quiz';

describe('Quiz', () => {
  it('renders and allows answering a question', () => {
    render(<Quiz />);
    expect(screen.getByText(/Do you currently have a source of income/i)).toBeInTheDocument();
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);
    expect(screen.getByText(/What is your monthly income after taxes/i)).toBeInTheDocument();
  });
}); 