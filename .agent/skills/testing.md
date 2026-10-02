# Skill: Testing

## Purpose
Establish, execute, and maintain automated verification strategies, covering unit tests, integration tests, end-to-end flows, and regression prevention.

## When to Use It
- Setting up testing frameworks for frontend or backend.
- Writing unit tests for utility functions, hooks, or model validations.
- Writing API integration tests for HTTP endpoints.
- Verifying code changes before marking tasks as complete.

## Required Context
- Existing test scripts (`backend/package.json`, `frontend/package.json`).
- Key application paths and critical business logic (task CRUD operations).
- Mocking strategy for external services and databases.

## Recommended Workflow
1. **Identify Test Targets**: Determine what needs verification (pure logic, HTTP status codes, UI state transitions).
2. **Setup Test Runner**: Install and configure an appropriate test runner (e.g. Vitest, Jest, Supertest) when instructed.
3. **Write Deterministic Tests**: Ensure tests are isolated, independent of network latency or shared database state, and cleanly tear down resources.
4. **Execute Verification**: Run the tests directly via CLI; inspect actual pass/fail outputs.
5. **Report Honestly**: Never claim a test passed without running it and inspecting real test runner output.

## Verification Checklist
- [ ] Were tests actually executed via CLI command?
- [ ] Did all tests pass with zero failures or uncaught errors?
- [ ] Are edge cases tested (empty inputs, invalid IDs, network failures)?
- [ ] Do tests clean up mock databases or state upon completion?

## Common Failure Modes
- Claiming tests passed without running them.
- Flaky tests dependent on real remote database availability or external networks.
- Testing implementation details rather than observable behavior and contracts.
- Leaving tests unmaintained when APIs evolve.

## Lessons Learned During This Project
*None yet. This section will be updated as testing strategies are introduced and executed.*
