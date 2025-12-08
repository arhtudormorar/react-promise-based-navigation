export const findShadowDOMTarget = (): HTMLElement => {
  // 1. Get the top-level host
  const host = document.querySelector("mvx-sign-transactions-panel");

  if (!host || !host.shadowRoot) {
    throw new Error("mvx-sign-transactions-panel or its shadowRoot not found");
  }

  // 2. From its shadow root, get mvx-side-panel
  const sidePanelHost = host.shadowRoot.querySelector("mvx-side-panel");

  if (!sidePanelHost || !sidePanelHost.shadowRoot) {
    throw new Error("mvx-side-panel or its shadowRoot not found");
  }

  // Inject CSS into the shadow root
  if (!sidePanelHost.shadowRoot.querySelector("style[data-guardian-styles]")) {
    const style = document.createElement("style");
    style.setAttribute("data-guardian-styles", "true");

    // Copy all styles from the main document
    let cssText = "";
    try {
      const styleSheets = Array.from(document.styleSheets);
      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules || sheet.rules || []);
          cssText += rules.map((rule) => rule.cssText).join("\n") + "\n";
        } catch (e) {
          // Cross-origin stylesheets will throw, skip them
          console.warn("Could not access stylesheet:", e);
        }
      }
    } catch (e) {
      console.error("Error copying styles:", e);
    }

    style.textContent = cssText;
    sidePanelHost.shadowRoot.appendChild(style);
  }

  // 3. Inside that shadow root, search directly for #side-panel
  const sidePanel = sidePanelHost.shadowRoot.querySelector(
    "#side-panel"
  ) as HTMLElement;

  if (!sidePanel) {
    throw new Error("#side-panel not found inside mvx-side-panel shadowRoot");
  }

  // clear the side panel
  sidePanel.innerHTML = "";

  return sidePanel;
};
