let pane;
let params = {
  y: 300,
  angle: 0,
  rotSpeed: 0.5,
  fillColor: "#FFFFFF",
  strokeColor: { r: 255, g: 255, b: 255, a: 255 },
  preset: "",
};

function setup() {
  setupGUI();
}

function draw() {
  // update GUI
  params.fps = frameRate();
  params.angle += params.rotSpeed;
  pane.refresh(); // update the information in the GUI
}

function setupGUI() {
  pane = new Pane();

  pane.addBlade({ view: "separator" });

  pane.addBinding(params, "y", { min: 0, max: height, step: 10 });
  pane.addBlade({ view: "separator" });

  pane.addBinding(params, "angle");
  pane.addBinding(params, "rotSpeed", { min: -10, max: 10, step: 0.01 });
  pane.addBlade({ view: "separator" });

  pane.addBinding(params, "fillColor");
  pane.addBinding(params, "strokeColor");
  pane.addBlade({ view: "separator" });

  // adding a button
  let button = pane.addButton({
    title: "Move",
    label: "", // optional
  });
  button.on("click", function () {
    params.x = params.target.x;
    params.y = params.target.y;
  });
  pane.addBlade({ view: "separator" });

  pane.addBinding(params, "preset", {
    options: {
      None: "",
      Preset1: "Preset 1",
      Preset2: "Preset 2",
      Preset3: "Preset 3",
    },
  });
}
