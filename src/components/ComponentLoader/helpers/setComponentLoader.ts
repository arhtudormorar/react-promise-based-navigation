const components = new Map<string, React.ReactNode>();
const triggerUpdates = new Map<string, (() => void) | null>();

const DEFAULT_ID = "default";

export const setComponentLoader = (
  node: React.ReactNode | null,
  id: string = DEFAULT_ID
) => {
  if (node === null) {
    components.delete(id);
  } else {
    components.set(id, node);
  }
  triggerUpdates.get(id)?.();
};

export const getCustomComponent = (id: string = DEFAULT_ID) => {
  return components.get(id) || null;
};

export const setTriggerUpdate = (id: string, fn: (() => void) | null) => {
  if (fn === null) {
    triggerUpdates.delete(id);
  } else {
    triggerUpdates.set(id, fn);
  }
};
