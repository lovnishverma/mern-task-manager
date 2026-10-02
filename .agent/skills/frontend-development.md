# Skill: Frontend Development

## Purpose
Standardize frontend feature development, component architecture, state management, styling, and API integration within the React/Vite client application.

## When to Use It
- Adding, updating, or refactoring React components.
- Integrating backend REST API endpoints via HTTP client.
- Managing client state, input handling, or UI error/loading indicators.
- Styling components with Tailwind CSS and ensuring responsive, accessible design.

## Required Context
- Frontend directory structure (`frontend/src/`).
- Package configurations (`frontend/package.json`, `vite.config.js`).
- Component tree: `App.jsx`, `components/AddTask.jsx`, `components/TaskList.jsx`.
- API layer: `frontend/src/api.js`.
- Styling configuration: Tailwind CSS v4 setup via `@tailwindcss/vite` and `index.css`.

## Recommended Workflow
1. **Component Design**: Break UI requirements into focused, reusable components with distinct props and clear responsibilities.
2. **State & Effects Hygiene**: Keep state minimal and colocated; handle async states (loading, error, empty) explicitly.
3. **API Integration**: Use centralized API helper functions rather than direct ad-hoc fetch/axios calls inside UI components. Avoid hardcoded backend URLs.
4. **Styling & Accessibility**: Apply consistent design tokens, responsive layouts, accessible semantic HTML elements, and keyboard navigation.
5. **Linting & Validation**: Run linting (`npm run lint` in `frontend/`) and build verification (`npm run build`) to ensure zero syntax or bundling errors.

## Verification Checklist
- [ ] Does the UI cleanly handle loading, error, and empty states?
- [ ] Are API endpoints parameterized via environment variables rather than hardcoded URLs?
- [ ] Does `npm run build` succeed in `frontend/` without build warnings or errors?
- [ ] Does `npm run lint` pass cleanly?
- [ ] Are component props validated and appropriately typed?

## Common Failure Modes
- Hardcoding backend URLs inside frontend source code instead of using environment configuration (`import.meta.env`).
- Neglecting error handling on failed network requests, causing silent failures or broken UI state.
- Inconsistent state synchronization where local state diverges from backend data.
- Introducing heavy UI dependencies when lightweight native solutions suffice.

## Lessons Learned During This Project
*None yet. This section will be updated as frontend development tasks proceed.*
