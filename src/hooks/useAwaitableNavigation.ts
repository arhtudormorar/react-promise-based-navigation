import { useMemo } from "react";
import { createAwaitableNavigation } from "../utils/navigationPromiseManager";
import { useLocation } from "wouter";

/**
 * Hook that provides an awaitable navigation function
 * Uses wouter's memory location so flows don't affect browser URL
 *
 * @example
 * const navigatePromise = useAwaitableNavigation();
 * const result = await navigatePromise<boolean>(
 *   '/approval',
 *   <ApprovalPage text="Approve?" />
 * );
 */
export const useAwaitableNavigation = () => {
  const [, navigate] = useLocation(); // Wouter for flow navigation

  return useMemo(() => createAwaitableNavigation(navigate), [navigate]);
};
