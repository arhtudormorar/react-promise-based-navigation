import type { ReactNode } from "react";

type PromiseResolver<T> = {
  resolve: (value: T) => void;
  reject: (reason?: Error) => void;
};

const pendingNavigations = new Map<string, PromiseResolver<unknown>>();
const routeComponents = new Map<string, ReactNode>();
// Store the navigate function so resolveNavigation can use it
let storedNavigate: ((to: string) => void) | null = null;

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

/**
 * Calculate the parent path by removing the last segment
 * Examples:
 * - "/approval/loader" → "/approval"
 * - "/approval" → "/"
 * - "/" → "/"
 */
const getParentPath = (pathname: string): string => {
  // Remove trailing slashes and split
  const segments = pathname.replace(/\/+$/, "").split("/").filter(Boolean);

  // If already at root or only one segment, return root
  if (segments.length <= 1) {
    return "/";
  }

  // Remove last segment and reconstruct path
  segments.pop();
  return "/" + segments.join("/");
};

export const createAwaitableNavigation = (navigate: (to: string) => void) => {
  // Store the navigate function for use in resolveNavigation
  storedNavigate = navigate;

  return <T>(to: string, component?: ReactNode): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
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

  // Automatically navigate to parent path
  if (storedNavigate) {
    const parentPath = getParentPath(pathname);
    storedNavigate(parentPath);
  }
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
