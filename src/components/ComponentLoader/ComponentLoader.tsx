import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { findDOMTarget } from "./helpers/findDOMTarget.ts";
import {
  getCustomComponent,
  setTriggerUpdate,
} from "./helpers/setComponentLoader.ts";

interface ComponentLoaderProps {
  id?: string;
}

export const ComponentLoader = ({ id = "default" }: ComponentLoaderProps) => {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    setTriggerUpdate(id, () => forceUpdate((v) => v + 1));
    return () => {
      setTriggerUpdate(id, null);
    };
  }, [id]);

  const customComponent = getCustomComponent(id);
  if (customComponent) {
    const target = findDOMTarget();
    return createPortal(customComponent, target);
  }
  return null;
};
