import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MealCard from '../MealCard';

describe('MealCard', () => {
  const mockData = {
    title: "3-Egg Veggie Bhurji",
    type: "High-Protein",
    time: "10m",
    emoji: "🍳",
    bg: "bg-orange-100",
    border: "border-orange-300",
    text: "text-orange-900",
    recipe: "Scramble 2 whole eggs."
  };

  it('renders closed state correctly', () => {
    render(<MealCard mealName="Breakfast" data={mockData} isOpen={false} onClick={() => {}} />);
    
    expect(screen.getByText('Breakfast')).toBeTruthy();
    expect(screen.getByText('3-Egg Veggie Bhurji')).toBeTruthy();
    expect(screen.getByText('🍳')).toBeTruthy();
    expect(screen.getByText('10m')).toBeTruthy();
    expect(screen.queryByText('Scramble 2 whole eggs.')).toBeNull();
  });

  it('renders open state with recipe details', () => {
    render(<MealCard mealName="Breakfast" data={mockData} isOpen={true} onClick={() => {}} />);
    
    expect(screen.getByText('Scramble 2 whole eggs.')).toBeTruthy();
    expect(screen.getByText('High-Protein')).toBeTruthy();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<MealCard mealName="Breakfast" data={mockData} isOpen={false} onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Breakfast'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders YouTube recipe search button when card is open with valid query URL', () => {
    render(<MealCard mealName="Breakfast" data={mockData} isOpen={true} onClick={() => {}} />);
    
    const ytButton = screen.getByRole('link', { name: /youtube/i });
    expect(ytButton).toBeTruthy();
    expect(ytButton.getAttribute('href')).toBe(
      'https://www.youtube.com/results?search_query=3-Egg%20Veggie%20Bhurji%20recipe'
    );
    expect(ytButton.getAttribute('target')).toBe('_blank');
    expect(ytButton.getAttribute('rel')).toContain('noopener');
  });

  it('does not render YouTube button when card is closed', () => {
    render(<MealCard mealName="Breakfast" data={mockData} isOpen={false} onClick={() => {}} />);
    expect(screen.queryByRole('link', { name: /youtube/i })).toBeNull();
  });

  it('stops propagation when clicking YouTube link so parent card does not trigger onClick', () => {
    const handleCardClick = vi.fn();
    render(<MealCard mealName="Breakfast" data={mockData} isOpen={true} onClick={handleCardClick} />);
    
    const ytButton = screen.getByRole('link', { name: /youtube/i });
    fireEvent.click(ytButton);
    expect(handleCardClick).not.toHaveBeenCalled();
  });

  it('stops keydown propagation when pressing Enter on YouTube link so parent card does not trigger onClick', () => {
    const handleCardClick = vi.fn();
    render(<MealCard mealName="Breakfast" data={mockData} isOpen={true} onClick={handleCardClick} />);
    
    const ytButton = screen.getByRole('link', { name: /youtube/i });
    fireEvent.keyDown(ytButton, { key: 'Enter', code: 'Enter' });
    expect(handleCardClick).not.toHaveBeenCalled();
  });

  it('renders step-by-step numbered recipe instructions when recipe is an array', () => {
    const arrayData = {
      ...mockData,
      recipe: [
        'Chop bell peppers and onions.',
        'Sauté on medium flame for 2 mins.',
        'Add eggs and scramble softly.'
      ]
    };
    render(<MealCard mealName="Breakfast" data={arrayData} isOpen={true} onClick={() => {}} />);
    expect(screen.getByText('Chop bell peppers and onions.')).toBeTruthy();
    expect(screen.getByText('Sauté on medium flame for 2 mins.')).toBeTruthy();
    expect(screen.getByText('Add eggs and scramble softly.')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText(/3 steps/i)).toBeTruthy();
  });

  it('strips redundant step prefixes like "Step 1:" or "1." from step text', () => {
    const prefixedData = {
      ...mockData,
      recipe: [
        'Step 1: Whisk 3 whole eggs.',
        '2. Heat butter in skillet.'
      ]
    };
    render(<MealCard mealName="Breakfast" data={prefixedData} isOpen={true} onClick={() => {}} />);
    expect(screen.getByText('Whisk 3 whole eggs.')).toBeTruthy();
    expect(screen.getByText('Heat butter in skillet.')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('handles multiline string recipe as numbered steps', () => {
    const multilineData = {
      ...mockData,
      recipe: 'Heat pan.\nAdd eggs.\nServe warm.'
    };
    render(<MealCard mealName="Breakfast" data={multilineData} isOpen={true} onClick={() => {}} />);
    expect(screen.getByText('Heat pan.')).toBeTruthy();
    expect(screen.getByText('Add eggs.')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('renders ingredients list when ingredients array is provided and card is open', () => {
    const dataWithIngredients = {
      ...mockData,
      ingredients: ['3 eggs', '1 onion', '1 tsp salt']
    };
    render(<MealCard mealName="Breakfast" data={dataWithIngredients} isOpen={true} onClick={() => {}} />);
    expect(screen.getByText('Ingredients')).toBeTruthy();
    expect(screen.getByText('3 eggs')).toBeTruthy();
    expect(screen.getByText('1 onion')).toBeTruthy();
    expect(screen.getByText('1 tsp salt')).toBeTruthy();
  });

  it('does not render ingredients section when ingredients array is empty or undefined', () => {
    render(<MealCard mealName="Breakfast" data={mockData} isOpen={true} onClick={() => {}} />);
    expect(screen.queryByText('Ingredients')).toBeNull();
  });

  it('renders Ask Gemini button when card is open', () => {
    render(<MealCard mealName="Breakfast" data={mockData} isOpen={true} onClick={() => {}} />);
    expect(screen.getByRole('button', { name: /ask gemini about 3-egg veggie bhurji/i })).toBeTruthy();
  });
});

