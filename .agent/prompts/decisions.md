# Architectural & Technical Decisions

## Decision 1 — Establish Persistent Agentic Development Documentation in `.agent/`

### Context
As the project progresses through analysis, refactoring, feature work, and potential architectural evolution, a consistent, reproducible, and transparent development workflow is required. Without structured documentation, context is easily lost between sessions and prompt cycles.

### Options considered
1. **Ad-hoc in-chat instructions**: Rely only on chat context without persistent workspace files.
2. **Standard documentation in README**: Append workflow instructions directly to the user-facing `README.md`.
3. **Dedicated isolated workflow directory (`.agent/`)**: Maintain persistent context, status, skill references, and prompt records in a separate, isolated root folder.

### Decision
Adopt the dedicated `.agent/` folder structure containing `context.md`, `status.md`, `skills/*.md`, and `prompts/*.md`. Application code will remain strictly isolated and never import anything from `.agent/`.

### Reason
Provides clear separation between runtime application code and agent workflow tracking. Preserves an auditable record of instructions, architectural decisions, and repository status across sessions without polluting production assets.

### Consequences
- All subsequent prompts and architectural decisions must be recorded in `prompt-history.md` and `decisions.md`.
- Runtime code must never import or reference `.agent/`.
- Documentation remains auditable, version-controlled, and easily referenced.

---

## Decision 2 — Target Architecture & Product Evolution to NestJS, Prisma, PostgreSQL, and Kanban Experience

### Context
The baseline application is a minimal demonstration MERN app with a single flat task list, untyped JavaScript, inline Express routes, and MongoDB persistence. To evolve into an enterprise-ready, maintainable task management platform with rich workflow capabilities (To Do, In Progress, Done, priorities, tags, due dates, and analytics), the architecture requires robust type safety, modular boundaries, relational data integrity, and a TaskFlow-inspired user experience.

### Options considered
1. **Keep MERN Stack and expand features incrementally**: Continue with Express, JavaScript, and MongoDB, adding extra fields to Mongoose.
   - *Pros*: Familiarity, minimal architectural disruption.
   - *Cons*: Weak typing, unstructured business logic, lack of relational schema enforcement, prone to regressions.
2. **Migrate to Next.js Fullstack Monolith**: Consolidate backend and frontend into Next.js App Router with Server Actions.
   - *Pros*: Single framework, unified deployment.
   - *Cons*: Violates the clear decoupled client-server architecture established for the project and complicates independent backend scaling.
3. **Adopt NestJS + Prisma + PostgreSQL Backend and React + TypeScript + Tailwind Kanban Frontend (Selected)**:
   - Modernize backend into a modular NestJS service with TypeScript, DTO validation, and Prisma ORM backed by PostgreSQL.
   - Evolve frontend into a React 19 + TypeScript Kanban board with native HTML5 drag-and-drop, category tags, priority levels, due date tracking, and a Task Insights analytics dashboard.

### Decision
Adopt Option 3:
- **Backend**: NestJS (TypeScript, modular dependency injection, class-validator DTOs, global exception filters).
- **ORM / Database**: Prisma ORM with PostgreSQL.
- **Frontend**: React 19 + TypeScript + Tailwind CSS v4, transforming the UI into a 3-column Kanban workflow with Task Insights analytics.
- **Entity Identification**: Transition from MongoDB `_id` to standard UUID string `id` across the database, API DTOs, and frontend components.

### Reason
NestJS provides clear separation of concerns (Controllers, Services, Modules) and out-of-the-box validation pipelines. PostgreSQL + Prisma ensures relational integrity, type-safe queries, and deterministic schema migrations. The TaskFlow-inspired Kanban workflow dramatically upgrades user productivity and UX while preserving core CRUD capabilities.

### Consequences
- Backend codebase must be restructured into TypeScript and NestJS conventions.
- Data access layer will use Prisma Client instead of Mongoose.
- Frontend components must be typed with TypeScript and updated to use `task.id` instead of `task._id`.
- The frontend API client must dynamically configure its baseURL via `VITE_API_URL` to support local and Render cloud deployments.

---

## Decision 3 — Staged Backend Replacement: Establish NestJS Foundation Before Introducing Database Layer

### Context
Migrating directly from Express + MongoDB to NestJS + Prisma + PostgreSQL in a single step creates compound risk where framework issues, TypeScript compilation errors, and database connection/migration failures occur simultaneously.

### Options considered
1. **Big-Bang Migration**: Introduce NestJS, Prisma, and PostgreSQL simultaneously in a single phase.
2. **Staged Replacement (Selected)**: First replace the Express runtime with a clean NestJS TypeScript foundation, establish the `/api/tasks` boundary, verify compilation and HTTP boot, and defer Prisma + PostgreSQL persistence to Phase 2.

### Decision
Adopt Staged Replacement. Phase 1 establishes the NestJS foundation, `main.ts`, `AppModule`, `TasksModule`, `TasksController`, and `TasksService`, with dead Express code removed. Mutations return `501 NotImplemented` with explicit persistence deferral rather than introducing mock in-memory database arrays.

### Reason
Reduces variables during verification, ensures the NestJS runtime and build pipeline work flawlessly, and cleanly establishes the HTTP resource boundary before tackling database migrations and schema definitions.

### Consequences
- The NestJS build, start, and HTTP routing are verified independently of database health.
- No dead Express code remains.
- Phase 2 can focus exclusively on Prisma schema, PostgreSQL connection, migrations, and repository integration.

---

## Decision 4 — Adopt Prisma 7 with Native Driver Adapter (`@prisma/adapter-pg`) and `prisma.config.ts`

### Context
Phase 2 requires integrating Prisma with PostgreSQL. While Prisma 8 is currently in pre-release (`8.0.0-rc`), Prisma 7 is the stable, production-ready major line (`7.10.0`). In Prisma 7, schema files no longer support `url` inside `datasource db`, requiring `prisma.config.ts` for migration configuration and native driver adapters (such as `@prisma/adapter-pg` with `pg.Pool`) for runtime database connections.

### Options considered
1. **Prisma 8 (RC / Latest)**: Upgrade to Prisma 8 release candidate.
   - *Pros*: Latest features.
   - *Cons*: Unstable release candidate, breaking changes, against explicit project constraints.
2. **Prisma 7 with `@prisma/adapter-pg` and `prisma.config.ts` (Selected)**:
   - Pin `@prisma/client`, `prisma`, and `@prisma/adapter-pg` strictly to stable `7.10.0`.
   - Configure migration datasource in `prisma.config.ts`.
   - Pass `PrismaPg` adapter with `pg.Pool` to `PrismaClient` in `PrismaService`.

### Decision
Adopt Option 2. Pin `prisma`, `@prisma/client`, and `@prisma/adapter-pg` strictly to version `7.10.0`. Establish `backend/prisma.config.ts` for migration tooling and initialize `PrismaClient` using `PrismaPg(new Pool({ connectionString }))`.

### Reason
Provides complete stability and production maintainability, conforms to Prisma 7 architectural standards (removing legacy Rust binary query engines in favor of JavaScript driver adapters), and satisfies all project constraints.

### Consequences
- All Prisma CLI commands (migrate, validate, studio) read configuration from `prisma.config.ts`.
- Runtime queries execute through `pg.Pool` with connection reuse and pool lifecycle hooks in `PrismaService`.
- Packages are strictly pinned without `^` to prevent unintended Prisma 8 upgrades.

---

## Decision 5 — Enforce Request Validation at the HTTP Boundary via DTOs, Global ValidationPipe, and ParseUUIDPipe

### Context
In Phase 2, request bodies and path parameters were loosely typed in controller handlers. Malformed payloads (e.g. empty titles, non-boolean completion flags, unknown malicious properties) or malformed UUID route parameters would either pass through unchecked or trigger database errors. A production-ready API requires strict validation and sanitization at the HTTP boundary before business logic or data layers are invoked.

### Options considered
1. **Manual Validation in Controllers/Services**: Write procedural checks (`if (!body.title) throw ...`) in controllers or services.
   - *Pros*: No external libraries.
   - *Cons*: Verbose, repetitive, inconsistent error formats, violates separation of concerns.
2. **NestJS ValidationPipe with class-validator/class-transformer and ParseUUIDPipe (Selected)**:
   - Define declarative DTO classes (`CreateTaskDto`, `UpdateTaskDto`) with decorators (`@IsNotEmpty`, `@IsString`, `@IsBoolean`, `@Transform`).
   - Register a global `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true`.
   - Apply `ParseUUIDPipe` to all `:id` route parameters.

### Decision
Adopt Option 2. Install `class-validator` and `class-transformer`, configure `app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))` in `main.ts`, bind `CreateTaskDto` and `UpdateTaskDto` to request bodies, and attach `new ParseUUIDPipe()` to `:id` parameters in `TasksController`.

### Reason
- Keeps controllers thin and declarative.
- Rejects unexpected/malicious fields immediately with HTTP 400 (`forbidNonWhitelisted: true`).
- Trims whitespace from user inputs reliably via `@Transform`.
- Distinguishes syntax errors (malformed UUIDs -> HTTP 400 via `ParseUUIDPipe`) from domain errors (non-existent records -> HTTP 404 via `NotFoundException`).
- Ensures zero database queries are executed for structurally invalid requests.

### Consequences
- Incoming HTTP requests must strictly adhere to DTO contracts.
- Any unwhitelisted payload property causes an immediate 400 Bad Request.
- Controllers remain purely HTTP orchestrators while services focus on database and business domain operations.

---

## Decision 6 — Frontend TypeScript Migration and Dynamic Environment API Client

### Context
The baseline frontend consisted of untyped JavaScript and JSX files (`main.jsx`, `App.jsx`, `AddTask.jsx`, `TaskList.jsx`, `api.js`) that hardcoded a remote Render backend URL and assumed MongoDB `_id` identity keys. Migrating to TypeScript and updating the network client to dynamically target local or cloud environments via `VITE_API_URL` while consuming standard UUID `id` keys is required before evolving the interface into the TaskFlow Kanban board.

### Options considered
1. **Gradual In-Place Typing with JSDoc**: Add JSDoc annotations to existing `.js`/`.jsx` files.
   - *Pros*: No file renaming.
   - *Cons*: Weak type safety, lack of strict build-time type checking, awkward interface definitions.
2. **Complete TypeScript Conversion with Strict Typecheck in Build Pipeline (Selected)**:
   - Convert all `.jsx`/`.js` files to `.tsx`/`.ts` (`main.tsx`, `App.tsx`, `AddTask.tsx`, `TaskList.tsx`, `api.ts`, `vite.config.ts`).
   - Define shared `Task` interface (`id`, `title`, `completed`, `createdAt`, `updatedAt`) in `types/task.ts`.
   - Configure dynamic `baseURL` in Axios using `import.meta.env.VITE_API_URL`.
   - Update `package.json` build script to `"tsc && vite build"`.

### Decision
Adopt Option 2. Fully migrate all frontend source files to TypeScript, eliminate all references to MongoDB `_id` in favor of UUID `id`, remove hardcoded backend URLs, provide `frontend/.env.example`, and enforce type safety through `tsc` during the Vite build.

### Reason
- Eliminates silent runtime errors caused by mismatched property names (`_id` vs `id`).
- Decouples the frontend from a single hardcoded backend URL, enabling local development and flexible cloud deployment via environment variables.
- Establishes a solid, typed foundation for subsequent TaskFlow Kanban state management and modal interactions.
- Preserves the existing UI and component hierarchy without introducing premature redesign risks or heavyweight dependencies.

### Consequences
- Frontend codebase is 100% TypeScript with strict compile-time verification.
- Components cleanly consume `task.id`.
- Build fails fast if any prop or API shape regression is introduced.

---

## Decision 7 — Expand Task Domain with PostgreSQL Enums for Status and Priority with Two-Way State Synchronization

### Context
To support the upcoming TaskFlow Kanban board (columns: `TODO`, `IN_PROGRESS`, `DONE`, priority badges: `LOW`, `MEDIUM`, `HIGH`, and optional deadlines) while preserving existing clients and database integrity, the domain model requires explicit enumerated fields and nullable date types without breaking current API consumers that toggle the boolean `completed` field.

### Options considered
1. **String Columns with Loose Validation**: Store `status` and `priority` as plain `VARCHAR` or `TEXT` columns in PostgreSQL.
   - *Pros*: Flexible.
   - *Cons*: Weak data integrity at the database layer, prone to invalid state insertion.
2. **PostgreSQL Native ENUM Types with Two-Way Completed Synchronization (Selected)**:
   - Create native PostgreSQL `TaskStatus` (`TODO`, `IN_PROGRESS`, `DONE`) and `TaskPriority` (`LOW`, `MEDIUM`, `HIGH`) enums via Prisma schema.
   - Add nullable `dueDate DateTime?`.
   - Provide defaults (`status: TODO`, `priority: MEDIUM`) ensuring all existing rows remain valid.
   - Harmonize `status` and `completed` in `TasksService` (`status === DONE` <-> `completed === true`).
   - Validate input with `@IsEnum` and `@IsISO8601` in DTOs.

### Decision
Adopt Option 2. Create PostgreSQL enums `TaskStatus` and `TaskPriority` via migration `20261002195351_add_task_status_priority_due_date`, configure `@IsEnum` and `@IsISO8601` in DTOs, and implement two-way synchronization in `TasksService` between `completed` and `status`.

### Reason
- Enforces relational data integrity at the database level.
- Guarantees backward compatibility: existing frontend components toggling `{ completed: !task.completed }` automatically update `status` to `DONE` or `TODO`.
- Sets a reliable foundation for the Kanban board columns without requiring a breaking change to the REST API.

### Consequences
- Database schema strictly validates status and priority values.
- New task creation defaults to `TODO` status and `MEDIUM` priority with `dueDate: null`.
- API responses include full Kanban metadata (`status`, `priority`, `dueDate`).

---

## Decision 8 — 3-Column TaskFlow Kanban UI with Pure React State and Presentational Component Segregation

### Context
Phase 5B requires replacing the flat single-column task list with a clean, responsive 3-column Kanban board (`TODO` → "To Do", `IN_PROGRESS` → "In Progress", `DONE` → "Done"). The application needs to support task creation with backend defaults, status transitions, inline metadata editing (title, priority, due date), and task deletion without introducing complex external state libraries (Redux, Zustand, React Query) or drag-and-drop libraries prematurely.

### Options considered
1. **Third-Party Drag-and-Drop / Kanban State Libraries**: Install libraries such as `@hello-pangea/dnd` or `zustand`.
   - *Pros*: Pre-packaged gestures and animations.
   - *Cons*: Bloats bundle size, violates phase constraints, adds unnecessary abstraction before core board layout and data flow are verified.
2. **Modular Presentational Component Tree with Local React State (Selected)**:
   - Root `App.tsx` coordinates API communication via `api.ts` and holds tasks state in React `useState`.
   - `KanbanBoard.tsx` filters tasks by status into 3 distinct column groups.
   - `KanbanColumn.tsx` presents column headers with badges and renders card lists with empty states.
   - `TaskCard.tsx` encapsulates card presentation, priority badges, formatted due dates, fast status dropdowns, and inline editing.
   - `AddTask.tsx` handles task creation using backend defaults with an expandable options drawer.

### Decision
Adopt Option 2. Build the Kanban board using a clean modular hierarchy (`App` -> `KanbanBoard` -> `KanbanColumn` -> `TaskCard`), responsive Tailwind CSS grid (`grid-cols-1 md:grid-cols-3`), and pure React state handlers.

### Reason
- Keeps the architecture lightweight, fast, and easy to maintain.
- Ensures strict separation of concerns: API calls remain inside `api.ts`, orchestration remains in `App.tsx`, and presentational components remain pure and reusable.
- Fully satisfies all Phase 5B constraints without introducing external state libraries or altering backend code.

### Consequences
- Status transitions are immediately functional via the card status dropdown selector or inline editor.
- The UI is fully prepared for future phases (Phase 5C native drag-and-drop and Phase 6 analytics dashboard) without architectural refactoring.

---

## Decision 9 — Native HTML5 Drag-and-Drop with Optimistic Updates & Failure Rollback

### Context
Phase 5C requires enabling users to drag task cards between Kanban columns (`TODO`, `IN_PROGRESS`, `DONE`) and persist the status change via the existing REST API. The solution must strictly use native HTML5 drag-and-drop APIs without external libraries, provide responsive visual feedback, suppress duplicate requests when dropped in the current column, and optimistically update the UI with robust error rollback if the network or server fails.

### Options considered
1. **Third-Party Drag-and-Drop Libraries (`dnd-kit`, `@hello-pangea/dnd`)**:
   - *Pros*: Built-in physics, animations, and touch abstractions.
   - *Cons*: Introduces substantial bundle weight, complex DOM wrapping, potential React 19 compatibility friction, and violates the explicit constraint against installing drag-and-drop libraries.
2. **Native HTML5 Drag and Drop with Drag Counter Ref & Optimistic State Machine (Selected)**:
   - Make `TaskCard` draggable with `draggable={!isEditing}`, `onDragStart`, and `onDragEnd`.
   - Make `KanbanColumn` a drop target using `onDragOver`, `onDragEnter`, `onDragLeave`, and `onDrop`.
   - Use a `dragCounter` ref in `KanbanColumn` to reliably track hover state without flickering over child card elements.
   - Orchestrate state in `App.tsx` via `handleDropTask`:
     - Discard drops in the same column (zero network calls).
     - Snapshot task state.
     - Optimistically mutate UI state and clear errors.
     - Dispatch `PUT /api/tasks/:id` with `{ status: targetStatus }`.
     - Reconcile with server response or revert to snapshot on failure while alerting the user.

### Decision
Adopt Option 2. Implement native HTML5 Drag and Drop across `TaskCard` and `KanbanColumn`, with centralized optimistic update and rollback logic in `App.tsx`.

### Reason
- Zero new bundle dependencies or runtime overhead.
- Native browser performance with standard drag data transfer.
- Clean separation between drag UI events and API persistence logic.
- Guarantees immediate UI responsiveness (optimistic update) with foolproof recovery (state rollback) if the backend is unreachable.

### Consequences
- Dragging cards between columns immediately re-sorts them into the destination column.
- Backend status-completed synchronization (`DONE` <-> `completed: true`) works automatically.
- Dropping into the current column produces zero network overhead.
- Accidental dragging during inline card editing is fully disabled.

---

## Decision 10 — Unified Task CRUD Modal and Client-Side Search/Filter Architecture

### Context
In Phase 5B and 5C, task creation used an inline form at the top of the board, and card editing used an inline form within the card. As the application evolved, inline forms became cramped, duplicated logic, and complicated card dragging. Additionally, users needed client-side search and filtering capabilities (by title, priority, and status) without making redundant network requests per keystroke.

### Options considered
1. **Third-Party Modal & Table/Filter Libraries**:
   - Use headless UI libraries (e.g. Radix UI, TanStack Table) for modals and filtering.
   - *Pros*: Pre-built accessibility primitives.
   - *Cons*: Adds external dependencies, increases bundle size, and violates strict phase constraints.
2. **Unified Custom TaskModal & Client-Side Memoized FilterBar (Selected)**:
   - Create a reusable `TaskModal` for both Create and Edit modes with title validation and inline API error handling.
   - Replace the legacy `AddTask` form and inline card edit mode entirely with the modal.
   - Implement `TaskFilterBar` with title search (case-insensitive) and priority/status dropdowns.
   - Execute search and filtering in `App.tsx` via `useMemo` (zero API requests per keystroke) while preserving the 3-column Kanban board structure.

### Decision
Adopt Option 2. Consolidate create and edit workflows into a reusable `TaskModal`, eliminate obsolete inline forms, and implement client-side memoized search and filtering in `TaskFilterBar`.

### Reason
- Eliminates UI duplication and simplifies `TaskCard` presentation.
- Provides immediate, responsive filtering without server round-trips or debouncing latency.
- Guarantees that API failures during creation or editing keep the modal open with clear error explanations.
- Fully respects the Kanban board structure and responsive layout.

### Consequences
- `AddTask.tsx` is completely removed; new tasks are created via the prominent "+ Add Task" button.
- `TaskCard` no longer manages complex inline form state.
- Empty states clearly communicate whether the board has zero tasks or no tasks matching active filters.

---

## Decision 11 — Client-Side Derived Analytics Dashboard (Task Insights) via Memoization

### Context
Phase 6 requires adding a comprehensive Task Insights analytics dashboard calculating total tasks, completed tasks, in-progress tasks, to-do tasks, completion rate (%), overdue tasks, and priority distribution (Low, Medium, High). The dashboard must be responsive, maintain a clean light design matching TaskFlow, avoid external charting/state libraries, and update dynamically across all CRUD and drag/drop mutations.

### Options considered
1. **Server-Side Analytics Endpoint (`GET /api/tasks/analytics`)**:
   - Implement database aggregations via Prisma in the backend.
   - *Pros*: Server calculates counts.
   - *Cons*: Violates the strict constraint against modifying backend code in this phase, introduces extra HTTP round-trips and polling requirements, and adds unnecessary latency.
2. **External Charting/Analytics Library (`recharts`, `chart.js`, `lucide-react`)**:
   - Install an external visualization library.
   - *Pros*: Pre-made graphical charts.
   - *Cons*: Adds heavyweight dependencies, potential React 19 peer-dependency conflicts, and breaks the lightweight zero-dependency constraint.
3. **Pure Client-Side In-Memory Derivation with `useMemo` & Tailwind UI (Selected)**:
   - Compute metrics directly from the existing `tasks` state inside `calculateTaskMetrics` wrapped in `useMemo`.
   - Implement clean HTML5/Tailwind cards, status badges, and an animated CSS progress bar for the completion rate.
   - Enforce exact overdue logic: `task.dueDate && new Date(task.dueDate).getTime() < Date.now() && task.status !== 'DONE'`.

### Decision
Adopt Option 3. Derive all analytics client-side using `useMemo`, render them via responsive Tailwind CSS cards in `TaskInsights.tsx`, and preserve the existing backend boundaries intact.

### Reason
- Zero network overhead and zero database load.
- Instant, synchronous updates whenever tasks are created, edited, deleted, or moved via drag-and-drop.
- Guaranteed mathematical consistency: `priorityCounts.low + priorityCounts.medium + priorityCounts.high === totalTasks`.
- Completed tasks (`status === 'DONE'`) are cleanly excluded from overdue counts regardless of their historical due date.

### Consequences
- No new packages, chart libraries, or backend endpoints are required.
- The UI remains snappy and desktop-class with instant metric reactivity.
- Future phases (such as tag filtering) can seamlessly feed into the same computation without refactoring.

---

## Decision 12 — Normalized Tag Model with Implicit Many-to-Many Association in Prisma 7 and Multi-Filter Composition

### Context
Phase 7 introduces task tags, labels, and category management. Tasks need to support multiple customizable tags with unique names and color codes. The architecture requires a normalized Tag model in Prisma 7 with full CRUD REST APIs, database integrity (cascade disassociation on deletion), tag selection/creation in the task modal, color-coded badges on cards, and unified client-side filtering composed with existing search, status, and priority filters using consistent AND logic.

### Options considered
1. **Scalar Array of Strings on Task (`tags String[]`)**:
   - Store tag names or JSON directly as an array column on the Task table.
   - *Pros*: Quick schema definition.
   - *Cons*: Denormalized, cannot enforce color consistency, renaming a tag requires migrating all tasks, and breaks normalization standards.
2. **Normalized Tag Model with Implicit Many-to-Many Relation (Selected)**:
   - Define a `Tag` model (`id` UUID, `name` unique string, `color` hex string with default `#3B82F6`, `createdAt` timestamp).
   - Establish `tags Tag[]` on `Task` and `tasks Task[]` on `Tag`. Prisma generates the join table `_TagToTask` with PostgreSQL foreign key cascading on delete.
   - Implement dedicated `TagsModule` (`/api/tags`) for tag CRUD with duplicate prevention (409 Conflict) and hex color validation.
   - Update `TasksService` to validate tag IDs, include tags on retrieval, and connect/set associations during task creation/updates.
   - Maintain client-side tag state, multi-tag filtering with AND logic, and lightweight modal management in the frontend without external state libraries.

### Decision
Adopt Option 2. Implement a normalized `Tag` model with Prisma 7 implicit many-to-many relationship, complete RESTful CRUD APIs, validated tag associations on tasks, color-coded UI badges, and integrated AND filtering in `TaskFilterBar`.

### Reason
- Preserves relational data integrity and 3rd normal form (3NF).
- Allows renaming or recoloring tags without mutating task records.
- Deleting a tag cleanly disassociates it from tasks via PostgreSQL foreign key cascade (`ON DELETE CASCADE`), ensuring zero orphaned join records.
- Guarantees instant client-side tag filtering that smoothly intersects with search text, status, and priority filters.

### Consequences
- Migration `20261002205250_add_tags_model` created table `tags` and join table `_TagToTask`.
- All task API responses include the `tags: Tag[]` relationship payload.
- Deleting a tag immediately disassociates it from all affected tasks in the UI state and database without deleting the tasks themselves.


