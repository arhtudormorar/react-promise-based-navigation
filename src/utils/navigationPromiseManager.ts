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
  navigationId: string,
  component: ReactNode
) => {
  routeComponents.set(navigationId, component);
};

/**
 * Get the registered component for a navigation ID
 */
export const getRouteComponent = (navigationId: string) => {
  return routeComponents.get(navigationId) || null;
};

/**
 * Clear the registered component
 */
export const clearRouteComponent = (navigationId: string) => {
  routeComponents.delete(navigationId);
};

/**
 * Creates an awaitable navigation function that returns a promise
 * which resolves when the destination route calls resolveNavigation
 */
export const createAwaitableNavigation = (navigate: (to: string) => void) => {
  return <T>(
    to: string,
    navigationId: string,
    component?: ReactNode
  ): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      // Store the resolver
      pendingNavigations.set(navigationId, {
        resolve,
        reject,
      } as PromiseResolver<unknown>);

      // Register the component if provided
      if (component) {
        registerRouteComponent(navigationId, component);
      }

      // Navigate without state
      navigate(to);
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
    clearRouteComponent(navigationId);
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
    clearRouteComponent(navigationId);
  }
};
