# glyphcheck

Monorepo with two packages:
- `packages/score` — pure TS library, heuristic font legibility scoring
- `packages/app` — React + MUI front-end that uses the score library

## Code review

When reviewing or editing any file in this repo, consult
`.Codex/code-smells.md` and flag any smells that apply to the changed code.
Cite the smell name and book principle, then suggest the minimal fix.

Only flag smells that are clearly present — don't invent issues.
