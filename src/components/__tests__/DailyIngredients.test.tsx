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

  it('renders title and total count badge, and is collapsed by default', () => {
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
    // Hidden by default
    expect(screen.queryByText('3 eggs')).toBeNull();
    expect(screen.queryByText('2 cups spinach')).toBeNull();
  });

  it('expands when clicked and filters ingredients when a meal filter button is clicked', () => {
    render(
      <DailyIngredients
        dayName="Monday"
        meals={mockMeals}
        checkedItems={{}}
        onToggleItem={() => {}}
      />
    );

    // Expand card
    const toggleHeaderBtn = screen.getByRole('button', { name: /today's ingredients/i });
    fireEvent.click(toggleHeaderBtn);

    expect(screen.getByText('3 eggs')).toBeTruthy();
    expect(screen.getByText('2 cups spinach')).toBeTruthy();

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

    // Expand card
    fireEvent.click(screen.getByRole('button', { name: /today's ingredients/i }));

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

    // Expand to check item style
    fireEvent.click(screen.getByRole('button', { name: /today's ingredients/i }));
    const eggText = screen.getByText('3 eggs');
    expect(eggText.className).toContain('line-through');
  });

  it('allows expanding and collapsing the ingredients list', () => {
    render(
      <DailyIngredients
        dayName="Monday"
        meals={mockMeals}
        checkedItems={{}}
        onToggleItem={() => {}}
      />
    );

    // Initial state is closed
    const toggleHeaderBtn = screen.getByRole('button', { name: /today's ingredients/i });
    expect(toggleHeaderBtn.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('3 eggs')).toBeNull();

    // Click to expand
    fireEvent.click(toggleHeaderBtn);
    expect(toggleHeaderBtn.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('3 eggs')).toBeTruthy();

    // Click again to collapse
    fireEvent.click(toggleHeaderBtn);
    expect(toggleHeaderBtn.getAttribute('aria-expanded')).toBe('false');
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

  it('uses rounded-lg for inner emoji box for concentric radius polish', () => {
    render(
      <DailyIngredients
        dayName="Monday"
        meals={mockMeals}
        checkedItems={{}}
        onToggleItem={() => {}}
      />
    );
    const emojiBox = screen.getByText('🥕').closest('div');
    expect(emojiBox?.className).toContain('rounded-lg');
    expect(emojiBox?.className).not.toContain('rounded-2xl');
  });

  it('ensures filter chips have minimum 44px touch target', () => {
    render(
      <DailyIngredients
        dayName="Monday"
        meals={mockMeals}
        checkedItems={{}}
        onToggleItem={() => {}}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /today's ingredients/i }));
    const allBtn = screen.getByRole('button', { name: /^all/i });
    expect(allBtn.className).toMatch(/min-h-\[44px\]|h-11|h-12|p-[0-9]+/);
  });

  it('uses bg-orange-600 for checked checkbox state for improved contrast', () => {
    render(
      <DailyIngredients
        dayName="Monday"
        meals={mockMeals}
        checkedItems={{ 'Monday-Breakfast-0': true }}
        onToggleItem={() => {}}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /today's ingredients/i }));
    const checkbox = screen.getByRole('checkbox', { name: /3 eggs/i });
    const indicator = checkbox.querySelector('.rounded-md');
    expect(indicator?.className).toContain('bg-orange-600');
    expect(indicator?.className).not.toContain('bg-orange-500');
  });

  it('includes dynamic count in header toggle aria-label', () => {
    const { rerender } = render(
      <DailyIngredients
        dayName="Monday"
        meals={mockMeals}
        checkedItems={{}}
        onToggleItem={() => {}}
      />
    );
    let toggleBtn = screen.getByLabelText(/toggle today's ingredients, 4 items/i);
    expect(toggleBtn).toBeTruthy();

    rerender(
      <DailyIngredients
        dayName="Monday"
        meals={mockMeals}
        checkedItems={{ 'Monday-Breakfast-0': true }}
        onToggleItem={() => {}}
      />
    );
    toggleBtn = screen.getByLabelText(/toggle today's ingredients, 1\/4 ready/i);
    expect(toggleBtn).toBeTruthy();
  });
});

