# Skill: Database

## Purpose
Manage data modeling, schema design, database connection lifecycle, migrations, query performance, and data integrity across the persistence layer.

## When to Use It
- Creating or updating schema models (e.g., Mongoose schemas or relational data models).
- Modifying indexes, validation constraints, or default fields.
- Establishing or debugging database connection management and retry logic.
- Planning data migration, seeding, or schema versioning.

## Required Context
- Active database engine and ODM/ORM (currently MongoDB via Mongoose).
- Model definitions (`backend/models/Task.js`).
- Database connection configuration (`backend/server.js` using `process.env.MONGO_URI`).
- Target persistence architecture if migrations are planned.

## Recommended Workflow
1. **Schema Design**: Define explicit fields, types, required flags, default values, and timestamps.
2. **Connection Management**: Ensure clean connection error handling, disconnect events, and avoidance of multiple open connection pools.
3. **Query Optimization**: Keep queries scoped and efficient; select only needed fields; leverage indexes on queried columns.
4. **Data Validation**: Apply validation at both schema level and application controller level.
5. **Migration Planning**: When changing schemas, plan backward compatibility for existing records in the database.

## Verification Checklist
- [ ] Are schema validations strict (types, required fields, constraints)?
- [ ] Are timestamps (`createdAt`, `updatedAt`) tracked if needed?
- [ ] Is connection failure handled gracefully without silently failing server startup?
- [ ] Are connection strings stored strictly in `.env` and never logged or committed?

## Common Failure Modes
- Committing database connection strings containing credentials to version control.
- Omitting indexes on frequently queried or sorted attributes.
- Unhandled connection failures causing unhandled exceptions during boot.
- Mutating documents without validating against schema constraints.

## Lessons Learned During This Project
*None yet. This section will be updated as database operations and modeling evolve.*
