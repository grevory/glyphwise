# Code Smell Guide — glyphcheck

When reviewing or editing files in this repo, flag the following smells. Cite
the source principle so the author understands the *why*, not just the *what*.

---

## packages/score (TypeScript, pure logic)

### Functions & naming
- **Long function** — any function over ~25 lines that mixes computation levels
  (e.g. raw font table access *and* score normalisation in the same body).
  *Ref: Clean Code ch. 3 — "Functions should do one thing."*
- **Flag argument** — a boolean param that makes the function behave differently
  (e.g. `scoreFont(font, ctx, includeContrast: boolean)`).
  *Ref: Clean Code ch. 3 — flag arguments are "truly awful".*
- **Mystery number** — a bare numeric literal with no named constant
  (e.g. `score * 0.35` instead of `DISAMBIGUATION_WEIGHT`).
  *Ref: Clean Code ch. 17 — G25 Replace Magic Numbers with Named Constants.*

### Data & types
- **Primitive obsession** — passing raw `number` or `string` where a small
  value-type or branded type would prevent misuse (e.g. a raw `number` for a
  0..1 score vs a `Score` type).
  *Ref: Refactoring 2e — "Replace Primitive with Object".*
- **Data clump** — two or more params that always travel together (e.g.
  `foreground` + `background` + `fontSizePx`) that should be one object.
  *Ref: Refactoring 2e — "Introduce Parameter Object".*
- **Mutable shared state** — any module-level `let` or exported mutable array
  that accumulates across calls (could cause scoring bugs on repeated use).
  *Ref: Clean Code ch. 10 — classes should hide mutable state.*

### Error handling
- **Swallowed error** — a `catch` block that only `return null` or does nothing,
  masking font-parsing failures silently.
  *Ref: Clean Code ch. 7 — "Don't Return Null", "Don't Ignore Exceptions".*

---

## packages/app (React + TypeScript)

### Components
- **God component** — a component over ~150 lines that owns state, data
  fetching, and rendering. Split into a container + presentational pair.
  *Ref: Clean Code ch. 10 — Single Responsibility Principle.*
- **Prop drilling beyond 2 levels** — passing a prop through 3+ components that
  don't use it themselves. Introduce a context or lift the data source.
  *Ref: Refactoring 2e — "Hide Delegate".*
- **Inline anonymous callbacks** — arrow functions defined inside JSX (e.g.
  `onClick={() => set({ tab: i })}`) inside lists or expensive renders without
  `useCallback`. Creates needless re-renders.
  *Ref: Pragmatic Programmer — avoid unnecessary work.*

### State & effects
- **useEffect with too many concerns** — a single `useEffect` that fetches data,
  sets multiple pieces of state, and has an implicit cleanup dependency. Split
  into focused effects.
  *Ref: Clean Code ch. 3 — one thing per unit.*
- **Derived state stored in useState** — any value that can be computed from
  existing state/props but is stored separately and kept in sync manually.
  *Ref: Refactoring 2e — "Remove Redundant Variable".*
- **Stale-closure bug pattern** — reading state or props inside a `useCallback`
  or `useEffect` without listing it in the dependency array.
  *Ref: Pragmatic Programmer ch. 28 — "Decoupling and the Law of Demeter"
  (indirect: know your dependencies explicitly).*

### Naming & structure
- **Inconsistent abstraction level** — a component that mixes MUI layout
  primitives (`<Box sx=…>`) with business language (`<ScoreCard>`) in the same
  render, making the intent hard to read.
  *Ref: Clean Code ch. 3 — "One Level of Abstraction per Function".*
- **Boolean prop that encodes state** — a prop like `isLoading`, `hasError`,
  `isEmpty` when the parent already holds a status enum or union type that would
  make the condition explicit.
  *Ref: Refactoring 2e — "Replace Type Code with State/Strategy".*

---

## Both packages

- **Dead code** — commented-out code blocks, unused imports, unreachable
  branches. Delete them; git history is the backup.
  *Ref: Clean Code ch. 4 — "Commented-Out Code".*
- **Comment that restates the code** — `// increment counter` above `count++`.
  Only keep comments that explain *why*, not *what*.
  *Ref: Clean Code ch. 4 — "Explain Yourself in Code".*
- **Asymmetric error paths** — a function that returns a value on success but
  throws on failure (or vice versa) without documenting the contract.
  *Ref: Clean Code ch. 7 — "Use Exceptions Rather Than Return Codes" (choose
  one convention per module and stick to it).*
