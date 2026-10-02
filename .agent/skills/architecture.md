# Skill: Architecture

## Purpose
Guide architectural evaluation, structural design, interface boundary management, and system evolution across frontend and backend services while preserving maintainability, separation of concerns, and clean contracts.

## When to Use It
- When planning architectural transitions (e.g., modularization, framework migrations, layering).
- When introducing new application layers (services, repositories, controllers, DTOs).
- When altering API schemas, contracts, or data models.
- Before making irreversible technical or system design decisions.

## Required Context
- Current system architecture documented in `.agent/context.md`.
- Active architectural decisions recorded in `.agent/prompts/decisions.md`.
- Target stack specifications: NestJS, Prisma ORM, PostgreSQL, React 19 + TypeScript, Tailwind CSS v4.
- Communication contracts between client and server (REST endpoints, payload schemas).
- Scalability, maintainability, and domain constraints.

## Target Architectural Blueprint

### 1. Layer Responsibilities & Data Flow
```
[ Frontend: React 19 + TypeScript ]
               │
               ▼ HTTP (REST JSON)
┌────────────────────────────────────────────────────────┐
│ NestJS Backend                                         │
│                                                        │
│  [ Controllers ]      <-- HTTP routing, status codes,  │
│        │                  request mapping              │
│        ▼                                               │
│  [ ValidationPipe ]   <-- Request validation via DTOs  │
│        │                  (class-validator)            │
│        ▼                                               │
│  [ Services ]         <-- Pure business logic,         │
│        │                  orchestration, analytics     │
│        ▼                                               │
│  [ PrismaService ]    <-- Database access layer &      │
│        │                  type-safe queries            │
└────────┼───────────────────────────────────────────────┘
         ▼
[ PostgreSQL Database ] <-- Relational persistence, indexes,
                            constraints, enums
```

- **Validation Layer**: Handled exclusively at the API boundary via NestJS `ValidationPipe` and strongly typed DTOs using `class-validator` and `class-transformer`. Rejects invalid payloads with HTTP 400 before service code executes. Client-side form validation provides instant user feedback.
- **Business Logic Layer**: Handled exclusively in NestJS Services (`TasksService`, `AnalyticsService`). Controllers remain thin and only orchestrate request/response translation.
- **Database Access Layer**: Encapsulated within `PrismaService` injecting the generated Prisma Client. No direct SQL or raw driver calls.
- **Error Representation**: Standardized JSON error envelope using NestJS global exception filters:
  ```json
  {
    "statusCode": 400,
    "message": ["title must not be empty"],
    "error": "Bad Request",
    "timestamp": "2026-10-02T20:30:00.000Z",
    "path": "/api/tasks"
  }
  ```

### 2. Primary Key Strategy (`_id` to `id`)
- MongoDB generated hexadecimal string `_id` (`65f...`).
- PostgreSQL target model uses UUID `id` (`String @id @default(uuid())`).
- Target API contracts will return standard `id`.
- The frontend will be upgraded to TypeScript interfaces using `id`.
- During any transition phase, backend DTO serializers can optionally alias `_id` to `id` if backward compatibility with legacy consumers is required.

## Recommended Workflow
1. **Analyze Current Boundaries**: Review current coupling between frontend components, API clients, Express routes, and Mongoose models.
2. **Identify Trade-offs**: Contrast proposed architectural patterns against current simplicity, team capacity, and project goals.
3. **Formalize Decision**: Formulate proposals with context, alternatives considered, pros/cons, and record them in `.agent/prompts/decisions.md`.
4. **Define Clean Contracts**: Define explicit types/interfaces and payload validation schemas before writing implementation code.
5. **Phase the Migration**: Break architectural changes into incremental, independently verifiable steps.

## Verification Checklist
- [ ] Is there a clear separation of concerns (presentation, business logic, data access)?
- [ ] Are contract boundaries (API endpoints, request/response structures) documented and backward-compatible or clearly migrated?
- [ ] Has the decision been recorded with rationale and consequences in `.agent/prompts/decisions.md`?
- [ ] Does the architecture avoid unnecessary over-engineering while remaining extensible?
- [ ] Are validation rules, error handling envelopes, and DTO contracts explicitly typed?

## Common Failure Modes
- Leaking database entities directly into API responses without DTO transformation.
- Putting business logic (e.g. overdue calculation, analytics aggregation) inside controllers or frontend components.
- Changing API contracts without updating both client and server coordinated plans.
- Implementing architectural rewrites in a single unmanageable step rather than incremental milestones.

## Lessons Learned During This Project
- **Contract Decoupling**: Hardcoding database-specific primary keys (`_id`) into frontend UI components creates friction when switching database backends. Standardizing on `id` in both DTOs and client TypeScript models ensures long-term portability.
- **Unified Validation Boundary**: In Express + Mongoose, validation was split ambiguously between client form submit logic and Mongoose schema constraints, leading to unhandled 500 errors. NestJS DTO validation pipes resolve this by enforcing a single, strict schema gate at the HTTP boundary.
