import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ImportTab from '../ImportTab';
import * as planExport from '@/utils/planExport';

vi.mock('@/utils/planExport', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/planExport')>();
  return {
    ...actual,
    exportPlanToFile: vi.fn(),
    exportPlanToShare: vi.fn(),
  };
});

describe('ImportTab (Manage Plan Hub)', () => {
  const dummyPlan = {
    Monday: { prepAlert: null, meals: [] },
    Tuesday: { prepAlert: null, meals: [] },
    Wednesday: { prepAlert: null, meals: [] },
    Thursday: { prepAlert: null, meals: [] },
    Friday: { prepAlert: null, meals: [] },
    Saturday: { prepAlert: null, meals: [] },
    Sunday: { prepAlert: null, meals: [] }
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('switches between export, import, and vault tabs', () => {
    render(<ImportTab onImport={() => {}} currentPlan={dummyPlan} />);
    
    const exportTab = screen.getByRole('button', { name: /^export$/i });
    const importTab = screen.getByRole('button', { name: /^import$/i });
    const vaultTab = screen.getByRole('button', { name: /^vault$/i });
    
    // Check initial state (maybe export or import is default)
    fireEvent.click(exportTab);
    expect(screen.getByRole('button', { name: /Download .json File/i })).toBeTruthy();
    
    fireEvent.click(importTab);
    expect(screen.getByLabelText(/select \.json file/i)).toBeTruthy(); // assuming file input has this label
    
    fireEvent.click(vaultTab);
    expect(screen.getByRole('button', { name: /save current plan/i })).toBeTruthy();
  });

  it('triggers export when Download .json File is clicked in export tab', () => {
    render(<ImportTab onImport={() => {}} currentPlan={dummyPlan} />);
    fireEvent.click(screen.getByRole('button', { name: /^export$/i }));
    
    const downloadBtn = screen.getByRole('button', { name: /Download .json File/i });
    fireEvent.click(downloadBtn);
    
    expect(planExport.exportPlanToFile).toHaveBeenCalledWith(dummyPlan, expect.any(String));
  });

  it('validates file and opens confirmation modal on .json file selection, then imports on confirm', async () => {
    const onImportMock = vi.fn();
    render(<ImportTab onImport={onImportMock} currentPlan={dummyPlan} />);
    fireEvent.click(screen.getByRole('button', { name: /^import$/i }));
    
    const validPlan = {
      version: 1,
      app: 'solochef',
      exportedAt: '2026-09-22T00:00:00Z',
      plan: dummyPlan
    };
    
    const file = new File([JSON.stringify(validPlan)], 'plan.json', { type: 'application/json' });
    const fileInput = screen.getByLabelText(/select \.json file/i); // You may need to query by data-testid or placeholder in actual implementation
    
    Object.defineProperty(fileInput, 'files', { value: [file] });
    fireEvent.change(fileInput);
    
    // Should show modal with Replace Plan
    const replaceBtn = await screen.findByRole('button', { name: /Replace Plan/i });
    expect(replaceBtn).toBeTruthy();
    
    fireEvent.click(replaceBtn);
    expect(onImportMock).toHaveBeenCalled();
  });

  it('saves current plan to localStorage, loads it, and deletes it in vault tab', () => {
    const onImportMock = vi.fn();
    render(<ImportTab onImport={onImportMock} currentPlan={dummyPlan} />);
    fireEvent.click(screen.getByRole('button', { name: /^vault$/i }));
    
    // Save
    const saveBtn = screen.getByRole('button', { name: /save current plan/i });
    fireEvent.click(saveBtn);
    
    // Saved plan should appear
    const savedPlansRaw = localStorage.getItem('solochef_saved_plans');
    expect(savedPlansRaw).toBeTruthy();
    
    const loadBtns = screen.getAllByRole('button', { name: /load/i });
    expect(loadBtns.length).toBeGreaterThan(0);
    
    // Load
    fireEvent.click(loadBtns[0]);
    expect(onImportMock).toHaveBeenCalled();
    
    // Delete
    const deleteBtns = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteBtns[0]);
    
    const savedPlansRawAfterDelete = localStorage.getItem('solochef_saved_plans');
    expect(JSON.parse(savedPlansRawAfterDelete || '[]')).toHaveLength(0);
  });

  it('validates and loads pasted json plan, displays confirmation modal, and shows success toast on confirm', async () => {
    const onImportMock = vi.fn();
    render(<ImportTab onImport={onImportMock} currentPlan={dummyPlan} />);
    fireEvent.click(screen.getByRole('button', { name: /^import$/i }));

    const textarea = screen.getByLabelText(/paste json meal plan here/i);
    fireEvent.change(textarea, { target: { value: JSON.stringify(dummyPlan) } });

    const validateBtn = screen.getByRole('button', { name: /validate & load pasted plan/i });
    fireEvent.click(validateBtn);

    // Confirmation modal should open
    const replaceBtn = await screen.findByRole('button', { name: /replace plan/i });
    expect(replaceBtn).toBeTruthy();

    fireEvent.click(replaceBtn);

    // Verify onImport was called
    expect(onImportMock).toHaveBeenCalled();

    // Verify success toast appears with plan statistics
    expect(await screen.findByText(/plan imported successfully/i)).toBeTruthy();
  });
});
