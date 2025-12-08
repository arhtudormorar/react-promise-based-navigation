import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { findDOMTarget } from "./helpers/findDOMTarget.ts";
import {
  getCustomComponent,
  setTriggerUpdate,
} from "./helpers/setComponentLoader.ts";

export const ModalLoader = () => {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    setTriggerUpdate(() => forceUpdate((v) => v + 1));
    return () => {
      setTriggerUpdate(null);
    };
  }, []);

  const portal = useMemo(() => {
    const customComponent = getCustomComponent();
    if (customComponent) {
      const target = findDOMTarget();

      return createPortal(customComponent, target);
    }
    return null;
  }, []);

  return portal;
};
