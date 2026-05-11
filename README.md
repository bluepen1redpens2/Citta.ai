# High-Performance Multi-Step Configuration Form

This project implements a high-performance, enterprise-grade multi-step configuration form in React and TypeScript. The architecture is driven by a custom-built global state management system using the Observer pattern, eliminating the need for external libraries like Redux or Zustand.

## Features

- **Custom State Management:** Global Form Store using the Observer pattern.
- **Efficient Subscriptions:** Components subscribe to specific slices of state via `useFormSelector`, preventing unnecessary re-renders when unrelated fields change.
- **Immutability & Derived Values:** State updates are immutable. Derived fields (e.g., `estimatedExecutionTime`) are auto-calculated at the Store level when relevant dependencies change, avoiding bloated `useEffect` chains in UI components.
- **Deferred Validation:** A powerful validation engine processes field-level, cross-field, and cross-tab rules strictly on form submission or tab switches, preventing UI blocking on every keystroke.
- **Dynamic Conditional Logic:** Complex dependencies (like `workflowType` governing trigger fields) are gracefully handled by resetting incompatible fields inside the store.
- **Premium Aesthetics:** Vibrant gradients, glassmorphism, and smooth animations using vanilla CSS.

## Architecture

### The Observer Pattern Store (`src/store/FormStore.ts`)

The `FormStore` class acts as the single source of truth. It manages the underlying state tree and a set of listener callbacks. 

1. **State Shape:** A flat/nested object defining all form variables, computed properties, and collected validation errors.
2. **Subscriptions:** Components invoke the `useFormSelector` hook (which leverages React's built-in `useSyncExternalStore`), extracting a slice of state. This prevents entire-form re-renders.
3. **Avoiding Circular Dependencies:** By separating the `FormStore` logic from UI components, derived state calculations (like estimating execution time) happen deterministically in a single pass during the `updateState` method. This eliminates cyclic reactive updates that often plague multi-store `useEffect` setups.
4. **Conditional Cleanup:** If `workflowType` changes, the `updateState` function safely clears irrelevant fields (e.g., wiping `eventSource` when switching to `scheduled`).

### Validation Engine (`src/validation/engine.ts`)

Validation is completely decoupled from rendering. Rules are defined in `rules.ts`. When a user navigates between tabs or submits, `validateForm` iterates over rules and populates an `errors` object inside the global state. 

- This ensures aggregation of errors across inactive tabs.
- Components only re-render if their specific `error` path changes.

## File Structure

- `src/store/`: The custom store, context provider, and custom hooks.
- `src/validation/`: The independent deferred validation logic.
- `src/components/`: Reusable input primitives (`TextInput`, `SelectInput`, `NumberInput`).
- `src/features/`: The specific tabs (`TabBasicInfo`, `TabTriggerConfig`, `TabActions`, `TabReview`).

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
