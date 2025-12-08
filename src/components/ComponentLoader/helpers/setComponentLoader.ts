let customComponent: React.ReactNode = null;
let triggerUpdate: (() => void) | null = null;

export const setComponentLoader = (node: React.ReactNode | null) => {
  customComponent = node;
  triggerUpdate?.();
};

export const getCustomComponent = () => customComponent;

export const setTriggerUpdate = (fn: (() => void) | null) => {
  triggerUpdate = fn;
};
