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
});
