# Occupancy Heatmap Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a tested HACS-compatible Home Assistant card that aggregates numeric or categorical entity history into a configurable hourly heatmap.

**Architecture:** A Lit custom card retrieves a single entity's recorder history, passes it to a pure timezone-aware aggregation layer, and renders the resulting day/hour matrix. A separate Lit editor manages the public configuration contract.

**Tech Stack:** TypeScript, Lit 3, Rollup, npm, Vitest, Playwright, ESLint, Prettier, GitHub Actions, HACS.

---

### Task 1: Repository and scaffold

- [x] Configure the package, strict TypeScript, Rollup, linting, formatting, Vitest, and Playwright.
- [x] Add MIT license, HACS metadata, CI/release workflows, README, and contribution guidance.
- [x] Test and register a minimal loadable custom card, build the distribution asset, and commit the scaffold.
- [x] Create and push the public GitHub repository before feature work.

### Task 2: Configuration

- [x] Write failing tests for defaults, range validation, required entity, mode selection, and excluded states.
- [x] Implement the typed public configuration and mode detection.
- [x] Run focused and full tests, then commit.

### Task 3: History and aggregation

- [x] Write failing tests for request parameters, deduplication, stale results, boundary carry-forward, thresholds, categorical winners, ties, future slots, 1/7/31-day ranges, and DST.
- [x] Implement the history service, timezone slots, and pure aggregator.
- [x] Run focused and full tests, then commit.

### Task 4: Card and editor

- [x] Write failing component tests for loading, empty, error, numeric, categorical, editor, and config-change states.
- [x] Implement the reference-inspired responsive card and visual editor.
- [x] Run focused and full tests, then commit.

### Task 5: Browser verification and release

- [x] Build a mocked Home Assistant browser harness with numeric/categorical and light/dark fixtures.
- [x] Verify desktop and mobile screenshots, overflow, focus, tap details, and text bounds with Playwright.
- [x] Complete README examples, run the entire verification suite, commit `dist`, and publish `v0.1.0`.
