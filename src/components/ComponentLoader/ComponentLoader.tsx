import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { findShadowDOMTarget } from "./helpers/findShadowDOMTarget.ts";

let guardianUtility: React.ReactNode = null;
let triggerUpdate: (() => void) | null = null;

export const setComponentLoader = (node: React.ReactNode | null) => {
  guardianUtility = node;
  triggerUpdate?.();
};

export const ComponentLoader = () => {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    triggerUpdate = () => forceUpdate((v) => v + 1);
    return () => {
      triggerUpdate = null;
    };
  }, []);

  // Memoize portal creation - only recreate when guardianUtility or portalTarget changes
  const portal = useMemo(() => {
    if (guardianUtility) {
      const target = findShadowDOMTarget();

      return createPortal(guardianUtility, target);
    }
    return null;
  }, [guardianUtility]);

  return portal;
};
