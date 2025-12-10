import type { ReactNode } from "react";

type PromiseResolver<T> = {
  resolve: (value: T) => void;
  reject: (reason?: Error) => void;
};

const pendingNavigations = new Map<string, PromiseResolver<unknown>>();
const routeComponents = new Map<string, ReactNode>();

export const registerRouteComponent = (
  pathname: string,
  component: ReactNode
) => {
  routeComponents.set(pathname, component);
};

export const getRouteComponent = (pathname: string) => {
  return routeComponents.get(pathname) || null;
};

export const clearRouteComponent = (pathname: string) => {
  routeComponents.delete(pathname);
};

export const createAwaitableNavigation = (navigate: (to: string) => void) => {
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

      // Navigate in memory router (doesn't affect browser URL)
      navigate(to);
    });
  };
};

export const resolveNavigation = <T = unknown>(value: T, pathname: string) => {
  const resolver = pendingNavigations.get(pathname);

  if (!resolver) {
    return;
  }

  resolver.resolve(value as unknown);
  pendingNavigations.delete(pathname);
  clearRouteComponent(pathname);
};

export const rejectNavigation = (pathname: string, reason?: unknown) => {
  const resolver = pendingNavigations.get(pathname);

  if (!resolver) {
    return;
  }

  resolver.reject(reason as Error | undefined);
  pendingNavigations.delete(pathname);
  clearRouteComponent(pathname);
};
