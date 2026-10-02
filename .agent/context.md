# Project Context

## Project Goal
A modern, production-grade task management system evolved from a basic MERN demonstration into a TaskFlow-inspired Kanban workflow platform with real-time analytics, robust type safety, and relational data persistence.

## Original Repository & Source
- Current Workspace Repository: `https://github.com/vedant48/mern-task-manager.git`
- Upstream Reference / Original Source: `https://github.com/lovnishverma/mern-task-manager.git`
- Baseline Tag: `baseline-original` (created on branch `main` at commit `2e4ccdc`)
- Active Feature Branch: `feat/taskflow-migration`
- Product Reference: TaskFlow (`https://github.com/parthlashkari/taskflow`) for Kanban UX, native drag-and-drop, priority tags, and clean modal interactions.

## Current Architecture (Post Phase 2)
- **Monorepo Structure**: Two decoupled subprojects in a single repository:
  - `frontend/`: React 19 Single Page Application (untouched, awaiting frontend modernization).
  - `backend/`: NestJS TypeScript application with Prisma 7 ORM and PostgreSQL persistence.
- **Backend Architecture (NestJS + Prisma 7 + PostgreSQL)**:
  - Runtime: Node.js `v24.21.0` with TypeScript `^5.7.2` compiled via `@nestjs/cli`.
  - Server Entry Point: `backend/src/main.ts` listening on `0.0.0.0` at `process.env.PORT || 5000` with global prefix `api`.
  - CORS: Configured in `main.ts` with `credentials: true` and all standard REST methods enabled.
  - Module Structure:
    - `AppModule` (`backend/src/app.module.ts`): Imports `PrismaModule` and `TasksModule`.
    - `PrismaModule` & `PrismaService` (`backend/src/prisma/`): Global database access layer using Prisma 7 with `@prisma/adapter-pg` and `pg.Pool`.
    - `TasksModule`, `TasksController`, `TasksService` (`backend/src/tasks/`): Full CRUD resource layer querying PostgreSQL via `PrismaService`.
  - Database Layer:
    - Engine: PostgreSQL 17.
    - ORM: Prisma 7 (`7.10.0` pinned, strictly avoiding Prisma 8).
    - Configuration: `backend/prisma.config.ts` configures migrations and datasource URL via `env("DATABASE_URL")`.
    - Client Driver: `@prisma/adapter-pg` driver adapter.
    - Active Schema (`backend/prisma/schema.prisma`):
      - Model `Task`: `id` (UUID string `@id @default(uuid())`), `title` (String), `completed` (Boolean `@default(false)`), `createdAt` (DateTime `@default(now())`), `updatedAt` (DateTime `@updatedAt`).
    - Migrations: `prisma/migrations/20261002161001_init/migration.sql` applied to PostgreSQL database `taskmanager`.
- **Frontend Architecture**:
  - Runtime/Bundler: Vite 7 (`7.1.2`).
  - Framework: React 19 (`19.1.1`), React DOM (`19.1.1`).
  - Styling: Tailwind CSS v4 (`4.1.13`) via `@tailwindcss/vite` and `@import "tailwindcss";` in `frontend/src/index.css`.
  - State Management: Component-local state via React `useState` hooks in `App.jsx` and `AddTask.jsx`.
  - Client Networking: Axios (`1.11.0`) in `frontend/src/api.js`.
  - Component Tree:
    - `main.jsx` (mounts `App` into `#root` inside `StrictMode`)
    - `App.jsx` (holds `tasks` state; manages CRUD callbacks)
      - `AddTask.jsx` (controlled form with title input)
      - `TaskList.jsx` (renders list, toggles completion, handles deletion)
- **Active Communication Protocol**:
  - RESTful JSON API over HTTP on `/api/tasks`.
  - Live Endpoints:
    - `GET /api/tasks`: Returns array of tasks ordered by `createdAt desc`.
    - `GET /api/tasks/:id`: Returns single task by UUID.
    - `POST /api/tasks`: Creates task with `{ title, completed? }`, returns 201 Created.
    - `PUT /api/tasks/:id`: Updates task fields `{ title?, completed? }`, returns 200 OK.
    - `DELETE /api/tasks/:id`: Deletes task by UUID, returns `{ message: "Task deleted" }`.

---

## Target Architecture (Planned Evolution)

### 1. Technology Stack
- **Frontend**: React 19 + TypeScript + Vite 7 + Tailwind CSS v4.
- **Backend**: NestJS (TypeScript, modular dependency injection, class-validator DTOs, global exception filter).
- **ORM / Data Layer**: Prisma ORM v7 with declarative schema migrations and `@prisma/adapter-pg`.
- **Database**: PostgreSQL (relational database).
- **Hosting / Deployment Target**: Render (Backend Web Service running NestJS Node runtime; Frontend Static Site on Render CDN).

### 2. Product Experience & Features
- **Kanban Board**: 3 workflow columns: `To Do` (`TODO`), `In Progress` (`IN_PROGRESS`), and `Done` (`DONE`).
- **Native HTML5 Drag-and-Drop**: Fluid card movement between columns without external bulky DnD libraries.
- **Task Attributes**: Title, optional description, priority levels (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), category tags (`String[]`), and due dates (`DateTime`).
- **Search & Filter Bar**: Real-time title search, priority filtering, and tag filtering.
- **Task Insights / Analytics Dashboard**:
  - Total tasks count
  - Completed tasks count
  - In-progress tasks count
  - Overdue tasks count
  - Completion percentage progress indicator
  - Task counts broken down by priority level
- **Full Modal CRUD**: Modal-driven creation, inline/modal editing, and safe deletion confirmation.

---

## Important Constraints
- **Zero Premature Code Changes**: Application source code must not be modified outside the current authorized phase.
- **Strict Documentation Isolation**: `.agent/` documentation must remain strictly isolated from application code. Application code must never import anything from `.agent/`.
- **Security & Privacy**: Secrets, environment credentials, database connection URIs with credentials, passwords, and API keys must never be committed or written to documentation.
- **Verification Integrity**: No verification, test, or build may be documented as passing unless it has actually been executed.
- **Platform**: Windows environment with PowerShell shell.

## Deployment Target
- Documented Target: Render (Backend Web Service + Frontend Static Site).
  - Backend Web Service: NestJS app (`npm run build`, `npm run start:prod`, running on dynamic `PORT`).
  - Frontend Static Site: React + Vite (`npm run build`, output: `dist`).
  - Database: Hosted PostgreSQL on Render or compatible cloud PostgreSQL provider (`DATABASE_URL`).
