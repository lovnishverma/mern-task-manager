# Skill: Backend Development

## Purpose
Guide backend architecture, NestJS module design, controllers, services, middleware, validation pipes, exception handling, and runtime configuration across the Node.js/TypeScript application.

## When to Use It
- Designing and implementing new NestJS modules, controllers, or services.
- Implementing DTOs, request validation, or custom exception filters.
- Refactoring routing or business logic boundaries.
- Configuring CORS, global prefixes, or environment-driven port bindings.

## Required Context
- Backend entry point (`backend/src/main.ts`).
- Root application module (`backend/src/app.module.ts`).
- Feature modules (`backend/src/tasks/tasks.module.ts`, `tasks.controller.ts`, `tasks.service.ts`).
- Backend configuration (`backend/package.json`, `tsconfig.json`, `nest-cli.json`).
- Expected HTTP status codes and RESTful design conventions (`/api/tasks`).

## Recommended Workflow
1. **Module Scaffolding**: Create domain-specific modules encapsulating controllers and providers (`TasksModule`).
2. **Controller Definition**: Define explicit REST decorators (`@Get()`, `@Post()`, `@Put()`, `@Patch()`, `@Delete()`) and parameter decorators (`@Param()`, `@Body()`, `@Query()`).
3. **Service Encapsulation**: Keep controllers thin by delegating all business logic, data transformation, and persistence access to Injectable services.
4. **Validation Pipes & DTOs**: Define strongly typed classes with `class-validator` annotations and enforce validation via global or controller-level `ValidationPipe`.
5. **Runtime Verification**: Verify TypeScript compilation (`npm run build`) and test endpoints using HTTP clients (`curl`, `Invoke-WebRequest`) inspecting status codes and response bodies.

## Verification Checklist
- [ ] Does `npm run build` succeed with zero TypeScript or NestJS compilation errors?
- [ ] Are all routes mounted under the global prefix `api` (e.g. `/api/tasks`)?
- [ ] Is CORS configured with appropriate origins and credentials handling?
- [ ] Does the server bind to dynamic `process.env.PORT` with fallback to 5000 and listen on `0.0.0.0`?
- [ ] Are HTTP status codes explicit (e.g. 201 for POST creation, 200 for updates/deletions, 501 for unintegrated persistence)?
- [ ] Have obsolete Express source files been completely eliminated to prevent dual-server dead code?

## Common Failure Modes
- Leaving obsolete Express code (`server.js`, `routes/`) in the repository alongside NestJS.
- Forgetting `app.setGlobalPrefix('api')`, breaking existing `/api/tasks` frontend integrations.
- Implementing fake in-memory persistence when deferring database migrations, masking actual data-layer contracts.
- Missing `@Injectable()` decorator on NestJS services, causing dependency injection resolution failures.

## Lessons Learned During This Project
- **Eliminate Obsolete Source Files Decisively**: During framework migration, leaving old Express entrypoints (`server.js`, `routes/taskRoutes.js`) causes confusion and risks executing the wrong server during deployment. Deleting them cleanly establishes NestJS as the single source of truth.
- **Explicit NotImplemented Responses for Staged Migrations**: When migrating in phases without a database yet in place, throwing `NotImplementedException` (HTTP 501) for mutations is vastly superior to fake mock arrays. It clearly establishes the API boundary while being honest about system capabilities.
- **Global API Prefix Consistency**: Setting `app.setGlobalPrefix('api')` in `main.ts` preserves existing consumer routes (`/api/tasks`) cleanly without having to prefix individual controller decorators.
