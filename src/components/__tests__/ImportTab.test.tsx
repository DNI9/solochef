import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ImportTab from '../ImportTab';
import { SCHEMA_TEMPLATE, LLM_INSTRUCTION } from '@/utils/schema';

describe('ImportTab', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders step-by-step recipe instructions and copy options', () => {
    render(<ImportTab onImport={() => {}} />);
    
    expect(screen.getByText('🔄 Import Plan')).toBeTruthy();
    expect(screen.getByText('1. Get Schema & Instructions')).toBeTruthy();
    expect(screen.getByText(/Step-by-Step Recipes:/i)).toBeTruthy();
    expect(screen.getByText('Copy LLM Prompt')).toBeTruthy();
    expect(screen.getByText('Copy LLM Schema')).toBeTruthy();
  });

  it('copies LLM schema to clipboard on schema button click', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock
      }
    });

    render(<ImportTab onImport={() => {}} />);
    const copySchemaBtn = screen.getByText('Copy LLM Schema');
    fireEvent.click(copySchemaBtn);

    expect(writeTextMock).toHaveBeenCalledWith(SCHEMA_TEMPLATE);
    expect(await screen.findByText('Schema Copied!')).toBeTruthy();
  });

  it('copies full LLM prompt to clipboard on prompt button click', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock
      }
    });

    render(<ImportTab onImport={() => {}} />);
    const copyPromptBtn = screen.getByText('Copy LLM Prompt');
    fireEvent.click(copyPromptBtn);

    expect(writeTextMock).toHaveBeenCalledWith(LLM_INSTRUCTION);
    expect(await screen.findByText('Prompt Copied!')).toBeTruthy();
  });

  it('imports valid JSON plan successfully', () => {
    const onImportMock = vi.fn();
    render(<ImportTab onImport={onImportMock} />);

    const validPlan = JSON.stringify({
      Monday: {
        prepAlert: null,
        meals: [
          {
            name: 'Breakfast',
            title: 'Scramble',
            type: 'High-Protein',
            time: '10m',
            emoji: '🍳',
            bg: 'bg-orange-100',
            border: 'border-orange-300',
            text: 'text-orange-900',
            recipe: ['Crack eggs', 'Cook gently']
          }
        ]
      },
      Tuesday: { prepAlert: null, meals: [] },
      Wednesday: { prepAlert: null, meals: [] },
      Thursday: { prepAlert: null, meals: [] },
      Friday: { prepAlert: null, meals: [] },
      Saturday: { prepAlert: null, meals: [] },
      Sunday: { prepAlert: null, meals: [] }
    });

    const textarea = screen.getByRole('textbox', { name: /paste json meal plan here/i });
    fireEvent.change(textarea, { target: { value: validPlan } });

    const importBtn = screen.getByRole('button', { name: /import plan/i });
    fireEvent.click(importBtn);

    expect(onImportMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Plan imported successfully!')).toBeTruthy();
  });

  it('shows error when importing empty or invalid JSON', () => {
    const onImportMock = vi.fn();
    render(<ImportTab onImport={onImportMock} />);

    const importBtn = screen.getByRole('button', { name: /import plan/i });
    fireEvent.click(importBtn);

    expect(screen.getByText('Please paste a JSON plan first.')).toBeTruthy();
    expect(onImportMock).not.toHaveBeenCalled();

    const textarea = screen.getByRole('textbox', { name: /paste json meal plan here/i });
    fireEvent.change(textarea, { target: { value: '{"bad json":' } });
    fireEvent.click(importBtn);

    expect(screen.getByText(/Unexpected end of JSON/i)).toBeTruthy();
  });

  it('renders curated starter presets section with all 4 preset options', () => {
    render(<ImportTab onImport={() => {}} />);
    
    expect(screen.getByText('Curated Starter Presets')).toBeTruthy();
    expect(screen.getByText('Anti-Slump High Energy')).toBeTruthy();
    expect(screen.getByText('Solo Vegetarian Express')).toBeTruthy();
    expect(screen.getByText('One-Pan Minimal Cleanup')).toBeTruthy();
    expect(screen.getByText('Global Solo Classics')).toBeTruthy();
  });

  it('loads curated preset when clicking Load Preset button', () => {
    const onImportMock = vi.fn();
    render(<ImportTab onImport={onImportMock} />);

    const loadAntiSlumpBtn = screen.getByRole('button', { name: /load anti-slump high energy/i });
    fireEvent.click(loadAntiSlumpBtn);

    expect(onImportMock).toHaveBeenCalledTimes(1);
    const loadedData = onImportMock.mock.calls[0][0];
    expect(loadedData.Monday).toBeDefined();
    expect(loadedData.Monday.meals[0].title).toBe('3-Egg Veggie Bhurji');
    expect(screen.getByText(/Loaded "Anti-Slump High Energy" preset!/i)).toBeTruthy();
  });
});
