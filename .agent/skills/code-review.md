# Skill: Code Review

## Purpose
Systematically review changes for correctness, security vulnerabilities, edge cases, performance bottlenecks, design consistency, and compliance with project standards.

## When to Use It
- After making code modifications and before completing a task.
- When reviewing pull requests or diffs across the repository.
- When refactoring existing components or modules.
- Before committing changes to git.

## Required Context
- Git diff of proposed changes (`git diff` or `git status`).
- Guidelines and constraints in `.agent/context.md`.
- Active architectural decisions in `.agent/prompts/decisions.md`.

## Recommended Workflow
1. **Diff Inspection**: Inspect git diff thoroughly line by line to verify only intended changes are included.
2. **Security & Secrets Review**: Ensure no secrets, API keys, passwords, or connection strings have been introduced.
3. **Correctness & Edge Cases**: Verify input validation, boundary values, error branches, and null/undefined handling.
4. **Style & Conventions**: Check for unused variables, console statements, dead code, formatting issues, and lint violations.
5. **Impact Analysis**: Ensure changes do not break downstream consumers or existing contracts.

## Verification Checklist
- [ ] Has `git diff` been inspected completely?
- [ ] Are all added lines necessary and free of debugging artifacts (`console.log`)?
- [ ] Are secrets completely absent from code and commit histories?
- [ ] Do linter and build commands pass cleanly without errors?
- [ ] Are comments meaningful and preserving existing documentation integrity?

## Common Failure Modes
- Committing temporary debugging code, console logs, or commented-out blocks.
- Overlooking unhandled errors in modified asynchronous functions.
- Introducing regressions in unreviewed dependent modules.
- Failing to verify that git status contains only the intended modified files.

## Lessons Learned During This Project
*None yet. This section will be updated as code review cycles occur.*
