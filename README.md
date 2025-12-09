# Promise-Based Navigation: Managing Business Logic Without useEffect

This document explains how this application manages business logic flow through promise-based navigation instead of relying on `useEffect` hooks for state synchronization and side effects.

## Core Concept

Instead of using `useEffect` to react to route changes or state updates, this application uses **promise-based navigation** where:

1. Navigation is **awaitable** - it returns a Promise that resolves when the user completes an action
2. Business logic flows **linearly** through async/await chains
3. Components are **dynamically registered** at navigation time with props
4. State management happens **explicitly** in event handlers, not reactively

## Architecture Overview

### Key Components

1. **Navigation Promise Manager** (`src/utils/navigationPromiseManager.ts`)
   - Manages pending navigation promises
   - Registers and retrieves dynamic route components
   - Provides `resolveNavigation` and `rejectNavigation` functions

2. **Awaitable Navigation Hook** (`src/hooks/useAwaitableNavigation.ts`)
   - Wraps React Router's `navigate` function
   - Returns a function that navigates and returns a Promise

3. **Dynamic Route Component** (`src/components/DynamicRoute.tsx`)
   - Renders components registered for specific routes
   - Enables passing props to route components

## How It Works

### 1. Initiating Navigation with a Promise

When you want to navigate and wait for user input, you call `navigatePromise`:

```typescript
const navigatePromise = useAwaitableNavigation();

const authenticateUser = async () => {
  const response = await fetch(`${url}/todos/1`);
  const data: { title: string } = await response.json();

  // Navigate to approval page and wait for user decision
  const approved = await navigatePromise<boolean>(
    "/approval",
    <ApprovalPage.Component text={data.title} />
  );

  // Business logic continues here after user responds
  setApproved(approved);
};
```

**What happens:**
1. A Promise is created and stored in `pendingNavigations` map
2. The component (`ApprovalPage`) is registered for the route path
3. Navigation occurs (with `replace: true` to avoid history pollution)
4. The Promise remains pending until `resolveNavigation` is called

### 2. Resolving Navigation with Business Logic

When the user completes an action, the destination component calls `resolveNavigation`:

```typescript
const handleApprove = async () => {
  // Navigate to loader (another promise-based navigation)
  const isApproved = await navigatePromise(
    "/approval/loader",
    <Loader isApproving={true} />
  );
  
  // Resolve the parent navigation with the result
  resolveNavigation(isApproved);
  navigate("/", { replace: true });
};
```

**What happens:**
1. The loader navigation completes and returns a value
2. `resolveNavigation` finds the pending promise for the current route
3. The promise resolves with the value
4. Control returns to the original `await` statement
5. Business logic continues with the resolved value

### 3. Component Registration Pattern

Components are registered dynamically at navigation time, allowing props to be passed:

```typescript
// Register component with props
await navigatePromise<boolean>(
  "/approval",
  <ApprovalPage.Component text={data.title} />
);
```

The `DynamicRoute` component then retrieves and renders it:

```typescript
export const DynamicRoute = ({ lookupPath }: DynamicRouteProps) => {
  const { pathname } = useLocation();
  const pathToLookup = lookupPath || pathname;
  const component = getRouteComponent(pathToLookup);
  
  return <>{component}</>;
};
```

## Business Logic Flow Example

Here's a complete flow through the authentication example:

```
1. User clicks "Authenticate User"
   ↓
2. authenticateUser() async function starts
   ↓
3. Fetch data from API
   ↓
4. navigatePromise("/approval", <ApprovalPage />)
   ├─ Promise created and stored
   ├─ Component registered
   └─ Navigation occurs
   ↓
5. [Promise pending - waiting for user]
   ↓
6. User clicks "Approve" button
   ↓
7. handleApprove() async function starts
   ↓
8. navigatePromise("/approval/loader", <Loader />)
   ├─ Another promise created
   └─ Loader shows for 2 seconds
   ↓
9. Loader's useEffect resolves after timeout
   ↓
10. resolveNavigation(isApproving) called
    ↓
11. Parent promise resolves with value
    ↓
12. resolveNavigation(isApproved) called in ApprovalActions
    ↓
13. Original promise in authenticateUser() resolves
    ↓
14. setApproved(approved) executes
    ↓
15. UI updates based on approved state
```

## Key Benefits

### 1. **Linear, Readable Code Flow**

Business logic reads top-to-bottom like synchronous code:

```typescript
// Clear, linear flow
const result = await fetchData();
const userDecision = await navigatePromise("/approval", <Page />);
const processed = await processResult(userDecision);
updateState(processed);
```

Instead of scattered `useEffect` hooks:

```typescript
// ❌ Traditional approach - logic scattered
useEffect(() => {
  if (data) {
    navigate("/approval");
  }
}, [data]);

useEffect(() => {
  if (approved !== null) {
    processResult(approved);
  }
}, [approved]);
```

### 2. **Explicit State Management**

State updates happen explicitly in event handlers, making it clear when and why state changes:

```typescript
const handleApprove = async () => {
  const result = await navigatePromise(...);
  resolveNavigation(result);  // Explicit resolution
  setState(result);           // Explicit state update
};
```

### 3. **Type-Safe Navigation**

TypeScript can infer return types from promises:

```typescript
const approved: boolean = await navigatePromise<boolean>(
  "/approval",
  <ApprovalPage />
);
```

### 4. **No Race Conditions**

Since navigation is awaited, you can't have race conditions from multiple rapid navigations. Each navigation completes before the next begins.

### 5. **Clean Component Lifecycle**

Components don't need to manage cleanup or handle unmounting scenarios. The promise system handles component registration and cleanup automatically.

## Comparison: Promise-Based vs useEffect-Based

### Promise-Based (This App)

```typescript
const authenticateUser = async () => {
  const data = await fetchData();
  const approved = await navigatePromise("/approval", <Page />);
  setApproved(approved);  // Direct, explicit
};
```

**Pros:**
- Linear, easy to follow
- No dependency arrays to manage
- Type-safe
- No race conditions
- Explicit control flow

### useEffect-Based (Traditional)

```typescript
const [data, setData] = useState(null);
const [approved, setApproved] = useState(null);

useEffect(() => {
  fetchData().then(setData);
}, []);

useEffect(() => {
  if (data) {
    navigate("/approval");
  }
}, [data]);

useEffect(() => {
  if (approved !== null) {
    // Handle approval
  }
}, [approved]);
```

**Cons:**
- Logic scattered across multiple effects
- Dependency arrays can cause bugs
- Hard to trace execution flow
- Race conditions possible
- Requires careful cleanup

## Implementation Details

### Navigation Promise Manager

The core system uses two Maps:

1. **`pendingNavigations`**: Stores Promise resolvers keyed by route path
2. **`routeComponents`**: Stores React components keyed by route path

```typescript
// Creating a navigation promise
const promise = new Promise<T>((resolve, reject) => {
  pendingNavigations.set(routePath, { resolve, reject });
  registerRouteComponent(routePath, component);
  navigate(routePath, { replace: true });
});

// Resolving a navigation promise
const resolver = pendingNavigations.get(pathname);
resolver?.resolve(value);
pendingNavigations.delete(pathname);
clearRouteComponent(pathname);
```

### Route Replacement Strategy

All dynamic routes use `replace: true` to avoid polluting browser history:

```typescript
navigate(to, { replace: true });
```

This means:
- Back button skips intermediate approval/loader routes
- History stays clean
- User can't accidentally navigate back to a dynamic route

## When to Use This Pattern

**Use promise-based navigation when:**
- You need to wait for user input before continuing
- Business logic depends on navigation outcomes
- You want explicit, linear control flow
- Type safety is important

**Don't use when:**
- Simple navigation without waiting for results
- Navigation is purely presentational
- You need deep linking to intermediate states

## Edge Cases Handled

1. **User closes modal**: `rejectNavigation()` is called with an error
2. **Component not registered**: `DynamicRoute` shows an error message
3. **Multiple navigations**: Each has its own promise, no conflicts
4. **Component unmounting**: Cleanup happens automatically via `clearRouteComponent`

## Conclusion

This promise-based navigation pattern provides a clean, type-safe way to manage business logic flow without relying on `useEffect`. It makes code more readable, maintainable, and less prone to bugs from reactive state management.

The key insight is: **navigation becomes a first-class async operation** that you can await, just like API calls or other async work. This transforms navigation from a side effect into a controllable part of your business logic flow.

