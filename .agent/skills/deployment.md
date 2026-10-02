# Skill: Deployment

## Purpose
Guide deployment configuration, production builds, hosting environment requirements, runtime configuration injection, and service health verification.

## When to Use It
- Preparing frontend or backend builds for deployment.
- Configuring cloud platforms (e.g. Render, Vercel, Netlify, Fly.io, GitHub Pages).
- Setting up build commands, start scripts, and static asset publishing rules.
- Diagnosing production deployment failures or environment misconfigurations.

## Required Context
- Build scripts (`npm run build` in `frontend/`, startup script in `backend/`).
- Deployment guides and configurations documented in `README.md` and `.agent/context.md`.
- Hosting target specifications (e.g., Render Web Services, Render Static Sites, or alternative platforms).
- Required runtime environment variables (PORT, MONGO_URI, API endpoints).

## Recommended Workflow
1. **Local Build Validation**: Validate production build locally (`npm run build` for frontend, start simulation for backend) before pushing.
2. **Environment Variable Configuration**: Document all required environment variables clearly without storing actual secret values.
3. **SPA Routing & Rewrites**: Ensure single-page application routing rewrite rules (e.g., `/*` -> `/index.html`) are configured for static hosts.
4. **CORS Alignment**: Verify backend CORS settings allow the deployed production frontend origin.
5. **Post-Deployment Smoke Test**: Verify health endpoints and live CRUD functionality on deployed URLs.

## Verification Checklist
- [ ] Does `npm run build` succeed locally without warnings or bundle errors?
- [ ] Are production environment variables documented in `.env.example` or deployment guides?
- [ ] Is backend CORS configured to allow the production frontend origin?
- [ ] Does the server bind to dynamic port (`process.env.PORT`) and listen on `0.0.0.0`?
- [ ] Are SPA redirect/rewrite rules in place for static hosting?

## Common Failure Modes
- Hardcoding `localhost` or dev endpoints into production bundles.
- Missing SPA rewrite rules, causing 404 errors on deep routes or refreshes.
- Mismatched CORS configuration blocking API calls between frontend and backend hosts.
- Hardcoding the port number rather than accepting platform-injected `PORT`.

## Lessons Learned During This Project
*None yet. This section will be updated as deployments and deployment configurations are executed.*
