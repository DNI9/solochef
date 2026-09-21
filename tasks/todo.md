# Phase 1 Implementation Tasks: Curated Dabba Presets & Quick-Start Onboarding

- [x] **Task 1: Create Curated Presets Data Engine** (`src/data/presets.ts`)
  - [x] Define `PresetMeta` interface with `id`, `title`, `description`, `emoji`, `tag`, `prepTime`, `highlights`, and `data` (`MealPlanData`).
  - [x] Implement Preset 1: ⚡ Anti-Slump High Energy (7 days, 3 meals/day, quantified ingredients, step-by-step recipes, full grocery haul).
  - [x] Implement Preset 2: 🥬 Solo Vegetarian Express (7 days, 3 meals/day, quantified ingredients, step-by-step recipes, full grocery haul).
  - [x] Implement Preset 3: 🍳 One-Pan Minimal Cleanup (7 days, 3 meals/day, quantified ingredients, step-by-step recipes, full grocery haul).
  - [x] Implement Preset 4: 🌏 Global Solo Classics (7 days, 3 meals/day, quantified ingredients, step-by-step recipes, full grocery haul).
  - [x] Export `PRESETS` array and `PRESET_MAP`.

- [x] **Task 2: Preset Data Validation Test Suite** (`src/data/__tests__/presets.test.ts`)
  - [x] Verify each preset passes `validateMealPlan(JSON.stringify(preset.data))` without errors.
  - [x] Verify each preset contains all 7 days with 3 meals per day.
  - [x] Verify all recipe steps are non-empty arrays and ingredients are non-empty strings.
  - [x] Verify grocery categories and items are valid.

- [x] **Checkpoint 1: Data Integrity Verified**
  - [x] Run `pnpm test src/data/__tests__/presets.test.ts` to confirm 100% green validation (18/18 tests passed).

- [x] **Task 3: Curated Presets in ImportTab** (`src/components/ImportTab.tsx`, `src/components/__tests__/ImportTab.test.tsx`)
  - [x] Add "Chef-Crafted Starter Plans" section with preset cards.
  - [x] Wire 1-click load buttons to call `onImport(preset.data)` with success state.
  - [x] Add unit tests verifying card renders and `onImport` triggers with preset payload (7/7 tests passed).

- [x] **Task 4: Transform Home Screen Empty State** (`src/app/page.tsx`, `src/app/__tests__/page.test.tsx`)
  - [x] Replace lonely empty state with Quick-Start Dabba preset cards gallery.
  - [x] Wire 1-click loading to `handleImportPlan`.
  - [x] Ensure $\ge 44\text{px}$ touch targets and responsive mobile ergonomics.
  - [x] Update `page.test.tsx` for preset rendering and click-to-load flow (12/12 tests passed).

- [x] **Checkpoint 2: UI & User Flows Verified**
  - [x] Run `pnpm test src/app/__tests__/page.test.tsx` and `src/components/__tests__/ImportTab.test.tsx`.

- [x] **Task 5: End-to-End Regression & Quality Gate**
  - [x] Run `pnpm test` (all 14 test files and 123 tests passed, 0 failures).
  - [x] Run `pnpm lint` (0 errors, 0 warnings).
  - [x] Run `pnpm build` & `tsc --noEmit` (Next.js production build and TypeScript check passed cleanly).
  - [x] Code and Security Reviews conducted and all feedback resolved.
