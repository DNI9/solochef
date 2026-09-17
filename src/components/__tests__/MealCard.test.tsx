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
});
