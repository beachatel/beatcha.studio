import { Pane } from "tweakpane";

// Create a fixed UI container on left of the screen
// Figure out styling for mobile
export function createUi() {
  const UiContainer = createElement("div");
  UiContainer.id = "ui-container";

  const PARAMS = {
    factor: 123,
    title: "hello",
    color: "#ff0055",
  };

  const pane = new Pane();

  pane.addBinding(PARAMS, "factor");
  pane.addBinding(PARAMS, "title");
  pane.addBinding(PARAMS, "color");

  return UiContainer;
}
