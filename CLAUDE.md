# Solochef Development Guide

## Build & Test Commands
- **Install**: `pnpm install`
- **Dev**: `pnpm dev`
- **Build**: `pnpm build`
- **Test**: `pnpm test` (Uses Vitest)
- **Lint**: `pnpm lint`

## Tech Stack
- **Framework**: Next.js 16.3.5 (App Router)
- **UI**: React 19.2, Tailwind CSS 4, Framer Motion, Lucide React
- **Testing**: Vitest, React Testing Library, jsdom
- **Package Manager**: pnpm 12

## Code Conventions
- Use `pnpm` exclusively (do not use npm or yarn).
- Use TypeScript for all new files.
- Place tests in `__tests__` directories adjacent to the code they test.
- Use `@/` for absolute imports resolving to `./src`.
- Use functional components and modern React 19 patterns.
- Style components using Tailwind CSS 4 utility classes.
- Follow Test-Driven Development (TDD) principles and ensure high test coverage.
