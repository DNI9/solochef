import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Page from '../page';

describe('Page', () => {
  it('renders title and navigation', () => {
    render(<Page />);
    expect(screen.getByText("Solo Chef's Dabba")).toBeTruthy();
    expect(screen.getByText('Plan')).toBeTruthy();
    expect(screen.getByText('Groceries')).toBeTruthy();
  });

  it('shows empty state when no plan is loaded', () => {
    render(<Page />);
    // Initial tab is plan
    expect(screen.getByText('No meal plan found')).toBeTruthy();
    
    // Click groceries
    fireEvent.click(screen.getByText('Groceries'));
    expect(screen.getByText('Empty Cart')).toBeTruthy();
  });

  it('switches to import tab and shows copy button', () => {
    render(<Page />);
    fireEvent.click(screen.getByText('Import'));
    expect(screen.getByText('🔄 Import Plan')).toBeTruthy();
    expect(screen.getByText('Copy LLM Schema')).toBeTruthy();
  });

  it('renders imported groceries', () => {
    // Mock localStorage
    const mockPlan = {
      Monday: { prepAlert: null, meals: [] },
      Tuesday: { prepAlert: null, meals: [] },
      Wednesday: { prepAlert: null, meals: [] },
      Thursday: { prepAlert: null, meals: [] },
      Friday: { prepAlert: null, meals: [] },
      Saturday: { prepAlert: null, meals: [] },
      Sunday: { prepAlert: null, meals: [] },
      groceries: [
        { category: 'Fresh Produce', items: ['Apples', 'Bananas'] }
      ]
    };
    Storage.prototype.getItem = () => JSON.stringify(mockPlan);

    render(<Page />);
    fireEvent.click(screen.getByText('Groceries'));
    expect(screen.getByText('Fresh Produce')).toBeTruthy();
    expect(screen.getByText('Apples')).toBeTruthy();
    expect(screen.getByText('Bananas')).toBeTruthy();

    // Restore mock
    Storage.prototype.getItem = () => null;
  });

  it('applies native mobile styling and scrollbar suppression classes', () => {
    const { container } = render(<Page />);
    const mainWrapper = container.firstChild as HTMLElement;
    expect(mainWrapper.className).toContain('touch-manipulation');
    expect(mainWrapper.className).toContain('select-none');

    // Bottom navigation buttons have minimum 44px touch targets
    const planTabBtn = screen.getByRole('button', { name: /plan/i });
    expect(planTabBtn.className).toMatch(/min-h-\[44px\]|min-w-\[44px\]|h-12|p-2/);

    // Main element uses no-scrollbar/hide-scrollbar
    const mainContent = screen.getByRole('main');
    expect(mainContent.className).toMatch(/no-scrollbar|hide-scrollbar/);
  });

  it('keeps meal cards collapsed by default on initial load and day change', () => {
    const mockPlan = {
      Monday: {
        prepAlert: null,
        meals: [
          { name: 'Lunch', title: 'Power Salad', type: 'Fiber-First', time: '10m', emoji: '🥗', bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-900', recipe: 'Toss greens with dressing.' }
        ]
      },
      Tuesday: {
        prepAlert: null,
        meals: [
          { name: 'Lunch', title: 'Warm Bowl', type: 'Balanced', time: '15m', emoji: '🍲', bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-900', recipe: 'Heat bowl and serve.' }
        ]
      },
      Wednesday: { prepAlert: null, meals: [] },
      Thursday: { prepAlert: null, meals: [] },
      Friday: { prepAlert: null, meals: [] },
      Saturday: { prepAlert: null, meals: [] },
      Sunday: { prepAlert: null, meals: [] }
    };
    Storage.prototype.getItem = () => JSON.stringify(mockPlan);

    render(<Page />);

    // Click Monday to view Monday's plan
    fireEvent.click(screen.getByText('MON'));

    // Lunch card title should be visible, but recipe should be collapsed (not in document)
    expect(screen.getByText('Power Salad')).toBeTruthy();
    expect(screen.queryByText('Toss greens with dressing.')).toBeNull();

    // Clicking expands it
    fireEvent.click(screen.getByText('Power Salad'));
    expect(screen.getByText('Toss greens with dressing.')).toBeTruthy();

    // Switch to Tuesday - Tuesday's lunch card should NOT automatically be expanded
    fireEvent.click(screen.getByText('TUE'));
    expect(screen.getByText('Warm Bowl')).toBeTruthy();
    expect(screen.queryByText('Heat bowl and serve.')).toBeNull();

    Storage.prototype.getItem = () => null;
  });

  it('renders today\'s ingredients on active day and allows toggling checklist items', () => {
    const mockPlanWithIngredients = {
      Monday: {
        prepAlert: null,
        meals: [
          {
            name: 'Breakfast',
            title: 'Scramble',
            type: 'Protein',
            time: '10m',
            emoji: '🍳',
            bg: 'bg-orange-100',
            border: 'border-orange-300',
            text: 'text-orange-900',
            ingredients: ['3 organic eggs', '1 small onion'],
            recipe: ['Cook eggs.']
          }
        ]
      },
      Tuesday: { prepAlert: null, meals: [] },
      Wednesday: { prepAlert: null, meals: [] },
      Thursday: { prepAlert: null, meals: [] },
      Friday: { prepAlert: null, meals: [] },
      Saturday: { prepAlert: null, meals: [] },
      Sunday: { prepAlert: null, meals: [] }
    };
    Storage.prototype.getItem = (key: string) => {
      if (key === 'solochef_meal_plan') return JSON.stringify(mockPlanWithIngredients);
      return null;
    };

    render(<Page />);
    fireEvent.click(screen.getByText('MON'));

    // Check that DailyIngredients card is rendered
    expect(screen.getByText("Today's Ingredients")).toBeTruthy();
    expect(screen.getByText('2 items')).toBeTruthy();
    expect(screen.getByText('3 organic eggs')).toBeTruthy();

    // Click checkbox to toggle ingredient
    const eggItem = screen.getByRole('checkbox', { name: /3 organic eggs/i });
    fireEvent.click(eggItem);

    // Counter updates to 1/2 ready
    expect(screen.getByText('1/2 ready')).toBeTruthy();

    Storage.prototype.getItem = () => null;
  });
});

