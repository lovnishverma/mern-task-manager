# Skill: Repository Analysis

## Purpose
Provide a standardized method for understanding project structure, dependencies, configuration, entry points, and code patterns across the monorepo without introducing accidental modifications.

## When to Use It
- At the start of new tasks, refactorings, or migrations.
- When investigating unfamiliar areas of the codebase.
- Before proposing dependency changes, architectural shifts, or structural file reorganizations.

## Required Context
- Workspace root directory path (`d:/project/mern-task-manager`).
- Directory hierarchy: `backend/`, `frontend/`, and root documentation.
- Project manifest files (`package.json`, `package-lock.json`, configuration files).
- Git repository state (branches, remotes, status, and tags).

## Recommended Workflow
1. **Directory Reconnaissance**: Check the directory structure, identify sub-projects, build artifacts, and ignored files.
2. **Dependency & Configuration Audit**: Inspect `package.json` scripts, dependencies, devDependencies, and bundler configurations (`vite.config.js`, ESLint configs).
3. **Data Flow & Entry Points**: Trace server entry (`backend/server.js`), API routes (`backend/routes/`), models (`backend/models/`), client root (`frontend/src/main.jsx`), and API client layers (`frontend/src/api.js`).
4. **Environment & Secrets Check**: Identify environment variable requirements (`.env`, `dotenv`, Vite environment conventions) without reading or leaking sensitive credential values.
5. **State Synthesis**: Document findings into `.agent/context.md` or `.agent/status.md` as appropriate.

## Verification Checklist
- [ ] Has every subfolder (`backend`, `frontend`, etc.) been accounted for?
- [ ] Are runtimes and versions identified (`node`, `npm`)?
- [ ] Have entry points and dependency graphs been confirmed?
- [ ] Are missing configurations noted (e.g. absent `.gitignore` files, missing test scripts)?
- [ ] Have all observed facts been verified against actual files rather than assumptions?

## Common Failure Modes
- Assuming dependencies or configurations exist without inspecting `package.json`.
- Exposing or logging sensitive credentials found in environment files.
- Modifying files during what was intended to be a read-only analysis phase.
- Overlooking monorepo boundary issues (e.g., assuming frontend and backend share dependencies).

## Project-Specific Findings
- **Monorepo Layout**: Completely separate frontend and backend directories with no root `package.json` or shared workspaces.
- **Backend Architecture**: Single Express 5 app (`backend/server.js`) with Mongoose 8. Handlers are written directly inside `routes/taskRoutes.js` without controller or service layers.
- **Frontend Architecture**: React 19 SPA bundled with Vite 7 and styled with Tailwind CSS v4 (`@tailwindcss/vite`). All application state is lifted to `App.jsx` with local `useState` hooks.
- **Documentation vs. Code Discrepancy**: `README.md` documents `VITE_API_URL` environment variable support on Render, but `frontend/src/api.js` hardcodes `baseURL: "https://mern-task-manager-b89p.onrender.com/api"`.
- **Missing Infrastructure**: No root or backend `.gitignore` (only `frontend/.gitignore` exists). No testing framework configured.
- **Dead Assets**: `frontend/src/App.css` is an unreferenced leftover from default Vite template initialization.

## Lessons Learned During This Project
- **Verify Claims in README Against Implementation**: Documentation can easily drift from code. The README stated that frontend uses `VITE_API_URL`, but inspection showed a hardcoded URL string in `api.js`. Always verify configuration claims directly in code.
- **Inspect Primary Key Assumptions Early**: Frontend components (`TaskList.jsx`, `App.jsx`) are tightly coupled to MongoDB's `_id` attribute. When planning migration to Prisma/PostgreSQL, this contract mapping must be handled explicitly.
- **Map Out Unhandled Async Boundaries**: Express 5 does not crash on rejected async promises, but without custom error middleware or try/catch blocks, failures return opaque internal errors rather than structured JSON.
