// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  createExportEnvelope, 
  generateExportFilename, 
  exportPlanToFile, 
  exportPlanToShare 
} from '../planExport';
import { MealPlanData } from '../../data/meals';

describe('planExport utils', () => {
  const dummyPlan: MealPlanData = {
    Monday: { prepAlert: null, meals: [] },
    Tuesday: { prepAlert: null, meals: [] },
    Wednesday: { prepAlert: null, meals: [] },
    Thursday: { prepAlert: null, meals: [] },
    Friday: { prepAlert: null, meals: [] },
    Saturday: { prepAlert: null, meals: [] },
    Sunday: { prepAlert: null, meals: [] },
  };

  describe('createExportEnvelope', () => {
    it('creates object with version, app, exportedAt, and plan', () => {
      const envelope = createExportEnvelope(dummyPlan);
      expect(envelope.version).toBe(1);
      expect(envelope.app).toBe('solochef');
      expect(new Date(envelope.exportedAt).getTime()).not.toBeNaN();
      expect(envelope.plan).toEqual(dummyPlan);
      expect(envelope.planName).toBeUndefined();
    });

    it('includes planName when provided', () => {
      const envelope = createExportEnvelope(dummyPlan, 'My Plan');
      expect(envelope.planName).toBe('My Plan');
    });
  });

  describe('generateExportFilename', () => {
    it('generates default filename when no name provided', () => {
      const date = new Date('2026-09-22T10:00:00Z');
      const filename = generateExportFilename(undefined, date);
      expect(filename).toMatch(/^solochef-plan-2026-09-\d{2}\.json$/);
    });

    it('generates sanitized slug filename when planName provided', () => {
      const date = new Date('2026-09-22T10:00:00Z');
      const filename = generateExportFilename('High Protein Week!!!', date);
      expect(filename).toMatch(/^solochef-high-protein-week-2026-09-\d{2}\.json$/);
    });
  });

  describe('exportPlanToFile', () => {
    beforeEach(() => {
      global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
      global.URL.revokeObjectURL = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('creates and clicks an anchor element with correct Blob content', () => {
      const mockAnchor = {
        href: '',
        download: '',
        click: vi.fn(),
        style: {}
      } as unknown as HTMLAnchorElement;
      
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockAnchor);
      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockAnchor);
      
      exportPlanToFile(dummyPlan, 'Test Plan');
      
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockAnchor.href).toBe('blob:mock-url');
      expect(mockAnchor.download).toContain('test-plan');
      expect(appendChildSpy).toHaveBeenCalledWith(mockAnchor);
      expect(mockAnchor.click).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalledWith(mockAnchor);
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
  });

  describe('exportPlanToShare', () => {
    it('calls navigator.share with plan text if supported', async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, { share: mockShare });
      
      const success = await exportPlanToShare(dummyPlan, 'Share Plan');
      expect(success).toBe(true);
      expect(mockShare).toHaveBeenCalled();
      const shareArg = mockShare.mock.calls[0][0];
      expect(shareArg.title).toContain('Solochef Plan');
      expect(shareArg.text).toContain('Share Plan');
    });

    it('returns false if navigator.share throws or is unavailable', async () => {
      Object.assign(navigator, { share: vi.fn().mockRejectedValue(new Error('no share')) });
      const success = await exportPlanToShare(dummyPlan);
      expect(success).toBe(false);
    });
  });
});
