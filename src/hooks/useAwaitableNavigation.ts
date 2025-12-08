import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { createAwaitableNavigation } from "../utils/navigationPromiseManager";

/**
 * Hook that provides an awaitable navigation function
 *
 * @example
 * const navigatePromise = useAwaitableNavigation();
 * const navigationId = Date.now().toString();
 * const result = await navigatePromise<boolean>(
 *   '/approval',
 *   navigationId,
 *   <ApprovalPage text="Approve?" />
 * );
 */
export const useAwaitableNavigation = () => {
  const navigate = useNavigate();

  return useMemo(() => createAwaitableNavigation(navigate), [navigate]);
};
