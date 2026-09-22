import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AskGeminiButton from '../AskGeminiButton';
import * as geminiPromptUtils from '../../utils/geminiPrompt';

describe('AskGeminiButton Component', () => {
  const mockMeal = {
    title: 'Avocado Toast with Poached Egg',
    ingredients: ['2 slices sourdough bread', '1 ripe avocado', '2 fresh eggs', 'Chili flakes'],
    recipe: ['Toast the bread', 'Mash avocado and spread on toast', 'Poach eggs and place on top'],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the Ask Gemini button with accessible label', () => {
    render(<AskGeminiButton meal={mockMeal} />);

    const button = screen.getByRole('button', { name: /ask gemini about avocado toast with poached egg/i });
    expect(button).toBeTruthy();
    expect(button.textContent).toMatch(/ask gemini/i);
  });

  it('calls shareToGemini with meal data when clicked', async () => {
    const shareSpy = vi.spyOn(geminiPromptUtils, 'shareToGemini').mockResolvedValue('shared');

    render(<AskGeminiButton meal={mockMeal} />);
    const button = screen.getByRole('button', { name: /ask gemini about avocado toast with poached egg/i });

    fireEvent.click(button);

    await waitFor(() => {
      expect(shareSpy).toHaveBeenCalledTimes(1);
      expect(shareSpy).toHaveBeenCalledWith({
        title: mockMeal.title,
        ingredients: mockMeal.ingredients,
        recipe: mockMeal.recipe,
      });
    });
  });

  it('supports button click and has aria-expanded on toggle', async () => {
    const shareSpy = vi.spyOn(geminiPromptUtils, 'shareToGemini').mockResolvedValue('shared');

    render(<AskGeminiButton meal={mockMeal} />);
    const button = screen.getByRole('button', { name: /ask gemini about avocado toast with poached egg/i });
    const toggleButton = screen.getByRole('button', { name: /show gemini prompt preview/i });

    expect(toggleButton.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggleButton);
    expect(toggleButton.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(button);
    await waitFor(() => {
      expect(shareSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('shows prompt preview block for text selection when toggle is clicked', () => {
    render(<AskGeminiButton meal={mockMeal} showPromptPreview={true} />);

    // Check if the prompt preview with select-all styling is present
    const promptBlock = screen.getByTestId('gemini-prompt-preview');
    expect(promptBlock).toBeTruthy();
    expect(promptBlock.textContent).toMatch(/I am cooking Avocado Toast with Poached Egg/i);
    expect(promptBlock.className).toContain('select-all');
  });

  it('shows helper hint for Android text selection context menu', () => {
    render(<AskGeminiButton meal={mockMeal} showPromptPreview={true} />);

    expect(screen.getByText(/tip: long press text above for android 'ask gemini' menu/i)).toBeTruthy();
  });

  it('renders secondary action children alongside Gemini button in 2-column grid', () => {
    const { container } = render(
      <AskGeminiButton meal={mockMeal}>
        <button type="button">Secondary Action</button>
      </AskGeminiButton>
    );

    const grid = container.querySelector('.grid.grid-cols-2');
    expect(grid).toBeTruthy();
    expect(screen.getByText('Secondary Action')).toBeTruthy();
  });
});

