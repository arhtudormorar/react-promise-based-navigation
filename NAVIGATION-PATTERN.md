# Awaitable Navigation Pattern

## Overview

The awaitable navigation pattern allows you to navigate to a route and await user input before continuing execution. This provides a route-based alternative to the modal-based pattern for capturing user input in async functions.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│ Async Function                                      │
│  const result = await navigatePromise('/approval')  │
└─────────────────────────────────────────────────────┘
          │
          │ Navigates with navigationId in state
          ▼
┌─────────────────────────────────────────────────────┐
│ /approval Route                                      │
│  - Receives navigationId from location.state        │
│  - User interacts with UI                           │
│  - Calls resolveNavigation(id, result)             │
│  - Navigates back                                   │
└─────────────────────────────────────────────────────┘
          │
          │ Promise resolves
          ▼
┌─────────────────────────────────────────────────────┐
│ Async Function continues                            │
│  console.log(result)                                │
└─────────────────────────────────────────────────────┘
```

## Implementation

### 1. Navigation Promise Manager

The core utility that manages pending navigation promises:

```typescript
// src/utils/navigationPromiseManager.ts
const pendingNavigations = new Map<string, PromiseResolver>();

export const createAwaitableNavigation = (navigate) => {
  return (to: string, state?: any): Promise<any> => {
    const navigationId = Math.random().toString(36);
    
    return new Promise((resolve, reject) => {
      pendingNavigations.set(navigationId, { resolve, reject });
      navigate(to, { state: { ...state, __navigationId: navigationId } });
    });
  };
};

export const resolveNavigation = (navigationId: string, value: any) => {
  const resolver = pendingNavigations.get(navigationId);
  if (resolver) {
    resolver.resolve(value);
    pendingNavigations.delete(navigationId);
  }
};
```

### 2. React Hook

A convenient hook that wraps the navigation function:

```typescript
// src/hooks/useAwaitableNavigation.ts
import { useNavigate } from "react-router-dom";
import { createAwaitableNavigation } from "../utils/navigationPromiseManager";

export const useAwaitableNavigation = () => {
  const navigate = useNavigate();
  return useMemo(
    () => createAwaitableNavigation(navigate),
    [navigate]
  );
};
```

### 3. Usage in Components

```typescript
import { useAwaitableNavigation } from "../hooks/useAwaitableNavigation";

export const MyComponent = () => {
  const navigatePromise = useAwaitableNavigation();

  const handleAction = async () => {
    // Do some work
    const data = await fetchData();
    
    // Navigate and wait for user input
    const approved = await navigatePromise("/approval", { 
      text: "Approve this action?" 
    });
    
    // Continue with result
    if (approved) {
      await submitData(data);
    }
  };

  return <button onClick={handleAction}>Process</button>;
};
```

### 4. Destination Route

The route that receives the navigation and resolves the promise:

```typescript
// src/pages/ApprovalPage.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { resolveNavigation } from "../utils/navigationPromiseManager";

export const ApprovalPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { text, __navigationId } = location.state;

  const handleApprove = () => {
    resolveNavigation(__navigationId, true);
    navigate(-1); // Go back
  };

  const handleReject = () => {
    resolveNavigation(__navigationId, false);
    navigate(-1);
  };

  return (
    <div>
      <p>{text}</p>
      <button onClick={handleApprove}>Approve</button>
      <button onClick={handleReject}>Reject</button>
    </div>
  );
};
```

## Comparison: Modal vs Route-Based

### Modal-Based Pattern

```typescript
const approved = await getUserApproval("Approve this?");
```

**Pros:**
- ✅ Stays on current page (no navigation)
- ✅ Quick, in-context interactions
- ✅ Better for simple confirmations
- ✅ No URL changes
- ✅ Works well for sequential prompts

**Cons:**
- ❌ Limited screen space
- ❌ Can't bookmark/share state
- ❌ Not ideal for complex forms

### Route-Based Pattern

```typescript
const approved = await navigatePromise("/approval", { text: "Approve this?" });
```

**Pros:**
- ✅ Full page for complex UI
- ✅ URL-based state (bookmarkable)
- ✅ Browser back button works naturally
- ✅ Better for multi-step workflows
- ✅ Can be shared via URL

**Cons:**
- ❌ Changes URL (navigation)
- ❌ User can navigate away (breaks promise)
- ❌ More complex state management
- ❌ History pollution if overused

## When to Use Each

### Use Modal Pattern When:
- Quick confirmations
- Simple yes/no questions
- Multiple sequential prompts
- Context from current page is important
- You want to stay on the same page

### Use Route Pattern When:
- Complex forms requiring full page
- Multi-step wizards
- You want URL state
- Need bookmarkable/shareable state
- Better mobile experience for complex UI

## Advanced: Sequential Calls

Both patterns support sequential calls:

```typescript
const processWorkflow = async () => {
  // Step 1: First approval
  const step1 = await navigatePromise("/approval", { text: "Step 1?" });
  if (!step1) return;
  
  // Step 2: Second approval
  const step2 = await navigatePromise("/approval", { text: "Step 2?" });
  if (!step2) return;
  
  // Step 3: Final confirmation
  const step3 = await getUserApproval("Final confirmation?");
  if (step3) {
    await completeWorkflow();
  }
};
```

## Error Handling

Handle cases where user navigates away or closes:

```typescript
try {
  const result = await navigatePromise("/approval", { text: "Approve?" });
  // Handle result
} catch (error) {
  // User navigated away or closed
  console.error("Navigation cancelled:", error);
}
```

## Type Safety

Add TypeScript generics for type-safe results:

```typescript
const navigatePromise = useAwaitableNavigation();

// Type-safe result
const approved: boolean = await navigatePromise<boolean>("/approval", {
  text: "Approve?"
});
```

## Best Practices

1. **Always clean up**: Remove navigation IDs from Map after resolution
2. **Handle missing state**: Check if `__navigationId` exists in destination route
3. **Navigate back**: Use `navigate(-1)` after resolving to return user
4. **Error handling**: Wrap in try/catch for user cancellations
5. **State validation**: Validate state in destination route before using
6. **Type safety**: Use TypeScript generics for result types

## Complete Example

```typescript
// Component
const MyComponent = () => {
  const navigatePromise = useAwaitableNavigation();

  const processTransaction = async () => {
    try {
      // Fetch data
      const transaction = await fetchTransaction();
      
      // Get user approval via route
      const approved = await navigatePromise<boolean>("/approval", {
        text: `Approve transaction ${transaction.id}?`,
        amount: transaction.amount
      });
      
      if (approved) {
        // Process transaction
        await submitTransaction(transaction);
        console.log("Transaction completed!");
      }
    } catch (error) {
      console.error("User cancelled:", error);
    }
  };

  return <button onClick={processTransaction}>Process</button>;
};

// Approval Route
const ApprovalPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { text, amount, __navigationId } = location.state;

  const handleApprove = () => {
    resolveNavigation(__navigationId, true);
    navigate(-1);
  };

  return (
    <div>
      <h2>Transaction Approval</h2>
      <p>{text}</p>
      {amount && <p>Amount: ${amount}</p>}
      <button onClick={handleApprove}>Approve</button>
      <button onClick={() => {
        resolveNavigation(__navigationId, false);
        navigate(-1);
      }}>Reject</button>
    </div>
  );
};
```

## Conclusion

The awaitable navigation pattern provides a clean, promise-based API for route-based user input. Combined with the modal pattern, you have two complementary approaches for different use cases. Choose based on your specific needs: modals for quick confirmations, routes for complex interactions.

