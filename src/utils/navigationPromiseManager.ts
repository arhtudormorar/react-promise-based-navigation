import type { ReactNode } from "react";

type PromiseResolver<T> = {
  resolve: (value: T) => void;
  reject: (reason?: Error) => void;
};

const pendingNavigations = new Map<string, PromiseResolver<unknown>>();
const routeComponents = new Map<string, ReactNode>();

/**
 * Register a component to be rendered at a route
 */
export const registerRouteComponent = (
  pathname: string,
  component: ReactNode
) => {
  routeComponents.set(pathname, component);
};

/**
 * Get the registered component for a pathname
 */
export const getRouteComponent = (pathname: string) => {
  return routeComponents.get(pathname) || null;
};

/**
 * Clear the registered component
 */
export const clearRouteComponent = (pathname: string) => {
  routeComponents.delete(pathname);
};

/**
 * Creates an awaitable navigation function that returns a promise
 * which resolves when the destination route calls resolveNavigation.
 * Navigation uses replace to avoid polluting browser history.
 */
export const createAwaitableNavigation = (
  navigate: (to: string, options?: { replace?: boolean }) => void
) => {
  return <T>(to: string, component?: ReactNode): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      // Use the route path as the navigation ID

      // Store the resolver
      pendingNavigations.set(to, {
        resolve,
        reject,
      } as PromiseResolver<unknown>);

      // Register the component if provided
      if (component) {
        registerRouteComponent(to, component);
      }

      // Navigate without adding to history so back button skips dynamic routes
      navigate(to, { replace: true });
    });
  };
};

/**
 * Resolves a pending navigation promise with a value
 */
export const resolveNavigation = <T = unknown>(
  value: T,
  pathname = window.location.pathname
) => {
  const resolver = pendingNavigations.get(pathname);

  if (!resolver) {
    return;
  }

  resolver.resolve(value as unknown);
  pendingNavigations.delete(pathname);
  clearRouteComponent(pathname);
};

/**
 * Rejects a pending navigation promise
 */
export const rejectNavigation = (
  reason?: unknown,
  pathname = window.location.pathname
) => {
  const resolver = pendingNavigations.get(pathname);

  if (!resolver) {
    return;
  }

  resolver.reject(reason as Error | undefined);
  pendingNavigations.delete(pathname);
  clearRouteComponent(pathname);
};
