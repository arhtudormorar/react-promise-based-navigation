import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { createAwaitableNavigation } from "../utils/navigationPromiseManager";

/**
 * Hook that provides an awaitable navigation function
 *
 * @example
 * const navigatePromise = useAwaitableNavigation();
 * const result = await navigatePromise('/approval', { text: "Approve?" });
 */
export const useAwaitableNavigation = () => {
  const navigate = useNavigate();

  return useMemo(() => createAwaitableNavigation(navigate), [navigate]);
};
