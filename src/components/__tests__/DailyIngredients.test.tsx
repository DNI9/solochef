import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DailyIngredients from '../DailyIngredients';
import { MealData } from '@/data/meals';

describe('DailyIngredients', () => {
  const mockMeals: MealData[] = [
    {
      name: 'Breakfast',
      title: 'Eggs',
      type: 'Protein',
      time: '10m',
      emoji: '🍳',
      bg: 'bg-orange-100',
      border: 'border-orange-300',
      text: 'text-orange-900',
      ingredients: ['3 eggs', '1 onion'],
      recipe: ['Cook eggs.']
    },
    {
      name: 'Lunch',
      title: 'Salad',
      type: 'Fiber',
      time: '15m',
      emoji: '🥗',
      bg: 'bg-green-100',
      border: 'border-green-300',
      text: 'text-green-900',
      ingredients: ['2 cups spinach', '1 cucumber'],
      recipe: ['Toss greens.']
    }
  ];

  it('renders title, total count badge, and items', () => {
    render(
      <DailyIngredients
        dayName="Monday"
        meals={mockMeals}
        checkedItems={{}}
        onToggleItem={() => {}}
      />
    );

    expect(screen.getByText("Today's Ingredients")).toBeTruthy();
    expect(screen.getByText('4 items')).toBeTruthy();
    expect(screen.getByText('3 eggs')).toBeTruthy();
    expect(screen.getByText('2 cups spinach')).toBeTruthy();
  });

  it('filters ingredients when a meal filter button is clicked', () => {
    render(
      <DailyIngredients
        dayName="Monday"
        meals={mockMeals}
        checkedItems={{}}
        onToggleItem={() => {}}
      />
    );

    // Click Breakfast filter
    const breakfastBtn = screen.getByRole('button', { name: /^breakfast/i });
    fireEvent.click(breakfastBtn);

    expect(screen.getByText('3 eggs')).toBeTruthy();
    expect(screen.queryByText('2 cups spinach')).toBeNull();

    // Click All filter
    const allBtn = screen.getByRole('button', { name: /^all/i });
    fireEvent.click(allBtn);

    expect(screen.getByText('3 eggs')).toBeTruthy();
    expect(screen.getByText('2 cups spinach')).toBeTruthy();
  });

  it('calls onToggleItem when an ingredient checkbox is clicked', () => {
    const handleToggle = vi.fn();
    render(
      <DailyIngredients
        dayName="Monday"
        meals={mockMeals}
        checkedItems={{}}
        onToggleItem={handleToggle}
      />
    );

    const eggItem = screen.getByRole('checkbox', { name: /3 eggs/i });
    fireEvent.click(eggItem);

    expect(handleToggle).toHaveBeenCalledWith('Monday-Breakfast-0');
  });

  it('indicates checked items with line-through and updated counter', () => {
    render(
      <DailyIngredients
        dayName="Monday"
        meals={mockMeals}
        checkedItems={{ 'Monday-Breakfast-0': true }}
        onToggleItem={() => {}}
      />
    );

    expect(screen.getByText('1/4 ready')).toBeTruthy();
    const eggText = screen.getByText('3 eggs');
    expect(eggText.className).toContain('line-through');
  });

  it('allows collapsing and expanding the ingredients list', () => {
    render(
      <DailyIngredients
        dayName="Monday"
        meals={mockMeals}
        checkedItems={{}}
        onToggleItem={() => {}}
      />
    );

    // Initial state is open
    expect(screen.getByText('3 eggs')).toBeTruthy();

    // Click collapse header button
    const toggleHeaderBtn = screen.getByRole('button', { name: /toggle today's ingredients/i });
    fireEvent.click(toggleHeaderBtn);

    // Content should be hidden
    expect(screen.queryByText('3 eggs')).toBeNull();

    // Click again to expand
    fireEvent.click(toggleHeaderBtn);
    expect(screen.getByText('3 eggs')).toBeTruthy();
  });

  it('returns null or empty state if no meals or ingredients exist', () => {
    const { container } = render(
      <DailyIngredients
        dayName="Monday"
        meals={[]}
        checkedItems={{}}
        onToggleItem={() => {}}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
