export const findDOMTarget = (): HTMLElement => {
  // add new element to the body
  const newElement = document.createElement("div");
  document.body.appendChild(newElement);
  return newElement;
};
