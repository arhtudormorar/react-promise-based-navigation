type PromiseResolver<T> = {
  resolve: (value: T) => void;
  reject: (reason?: Error) => void;
};

const pendingNavigations = new Map<string, PromiseResolver<unknown>>();

/**
 * Creates an awaitable navigation function that returns a promise
 * which resolves when the destination route calls resolveNavigation
 */
export const createAwaitableNavigation = (
  navigate: (to: string, options?: { state?: unknown }) => void
) => {
  return <T>(to: string, state?: unknown): Promise<T> => {
    const navigationId = Math.random().toString(36).substring(2, 15);

    return new Promise<T>((resolve, reject) => {
      // Store the resolver
      pendingNavigations.set(navigationId, {
        resolve,
        reject,
      } as PromiseResolver<unknown>);

      // Navigate with the ID in state
      navigate(to, {
        state: {
          ...(state && typeof state === "object" ? state : {}),
          __navigationId: navigationId,
        },
      });
    });
  };
};

/**
 * Resolves a pending navigation promise with a value
 */
export const resolveNavigation = <T = unknown>(
  navigationId: string,
  value: T
) => {
  const resolver = pendingNavigations.get(navigationId);
  if (resolver) {
    resolver.resolve(value as unknown);
    pendingNavigations.delete(navigationId);
  }
};

/**
 * Rejects a pending navigation promise
 */
export const rejectNavigation = (navigationId: string, reason?: unknown) => {
  const resolver = pendingNavigations.get(navigationId);
  if (resolver) {
    resolver.reject(reason as Error | undefined);
    pendingNavigations.delete(navigationId);
  }
};
