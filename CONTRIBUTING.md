# Contributing to ts-enverify

Thanks for your interest in contributing to ts-enverify.
This guide explains how to set up the project, make changes safely, and open high-quality pull requests.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Project Goals](#project-goals)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Guidelines](#coding-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Commit Message Suggestions](#commit-message-suggestions)
- [Release Notes](#release-notes)
- [Reporting Issues](#reporting-issues)
- [Security](#security)

## Code of Conduct

Please be respectful and constructive in all interactions.
Assume good intent, give actionable feedback, and keep discussion focused on improving the project.

## Project Goals

ts-enverify is intentionally small and focused.
Core goals:

- Validate environment variables at startup.
- Keep runtime behavior explicit and predictable.
- Provide strong TypeScript inference without extra boilerplate.
- Stay dependency-light and easy to audit.

When proposing a change, prefer solutions that preserve these goals.

## Tech Stack

- Language: TypeScript
- Test runner: Vitest
- Build tool: tsup
- Code quality: Ultracite
- Output: CJS + ESM + type declarations

## Getting Started

### 1. Prerequisites

- Node.js 18+ (recommended)
- npm

### 2. Clone and install

```bash
git clone https://github.com/aradhyacp/ts-enverify.git
cd ts-enverify
npm install
```

### 3. Useful commands

```bash
npm run build       # build dist artifacts with tsup
npm run typecheck   # run TypeScript checks without emitting files
npm run check       # run Ultracite checks
npm run fix         # auto-fix issues with Ultracite
npm test            # run tests once
npm run test:watch  # run tests in watch mode
npm run dev         # tsup watch build
```

## Project Structure

```text
src/
  index.ts       # public exports
  validator.ts   # main validation logic
  types.ts       # schema and inference types
  errors.ts      # custom error formatting

tests/
  validator.test.ts
```

Guideline:

- Keep runtime validation behavior in `src/validator.ts`.
- Keep type-level behavior in `src/types.ts`.
- Keep user-facing error text centralized in `src/errors.ts`.

## Development Workflow

1. Create a branch from `main`.
2. Make focused changes (one concern per PR where possible).
3. Add or update tests with your change.
4. Run checks locally:

```bash
npm run typecheck
npm test
npm run check
npm run build
```

5. Open a pull request with a clear summary and rationale.

## Coding Guidelines

- Follow existing code style and naming conventions.
- Keep functions small and readable.
- Avoid introducing dependencies unless clearly justified.
- Prefer explicit behavior over implicit coercion.
- Preserve public API stability (`enverify` import and current schema style) unless a breaking change is intentional.

Type and API safety:

- Do not weaken type inference for convenience.
- When changing schema typing, validate both runtime and inferred TypeScript behavior.
- If behavior changes, update README examples where relevant.

## Testing Guidelines

Tests should be behavior-focused and easy to read.

For validator changes, include tests for:

- Valid input path
- Invalid input path (error expectations)
- Edge cases (missing values, defaults, enum mismatch, invalid booleans/numbers)
- Error aggregation behavior where applicable

Tips:

- Use custom `source` inputs in tests instead of mutating global environment state.
- Keep test names descriptive and outcome-oriented.

## Pull Request Process

Please include the following in your PR description:

- What changed
- Why it changed
- Any backward compatibility concerns
- How it was tested

PR checklist:

- [ ] Tests added or updated
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes
- [ ] `npm run build` passes
- [ ] Docs updated when behavior or API changed

Review expectations:

- Small, focused PRs are reviewed faster.
- Maintainers may request changes for API consistency, type safety, or long-term maintainability.

## Commit Message Suggestions

Conventional commits are encouraged (not required), for example:

- `feat: add enum default narrowing test`
- `fix: improve boolean parser error message`
- `docs: clarify custom source usage`
- `refactor: simplify infer field utility`

## Release Notes

Publishing is currently handled through npm.
The project has a `prepublishOnly` script that runs build before publish.

If you are preparing a release:

1. Ensure all checks pass.
2. Bump the package version in `package.json`.
3. Verify changelog/release notes are accurate.
4. Publish with npm credentials configured.

## Reporting Issues

Please open issues with enough detail to reproduce.
A strong issue report includes:

- Node.js version
- Package version
- Minimal reproduction
- Expected behavior
- Actual behavior
- Error output (if any)

Use the repository issues page:

- https://github.com/aradhyacp/ts-enverify/issues

## Security

If you discover a security issue, avoid public disclosure in a normal issue.
Contact the maintainer privately first so a fix can be prepared responsibly.

Thanks again for contributing.
