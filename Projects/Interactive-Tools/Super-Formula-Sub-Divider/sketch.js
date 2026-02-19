let params = {
  sz: 75,
  a: 1,
  b: 1,
  m: 8,
  n1: 0.5,
  n2: 0.5,
  n3: 8,
  v: 1,
  t: 1,
  xp: 1,
  yp: 1,
  fill: "#001001",
  sfill: "#ff00dd",
  stroke: "#0077ff",
  preset: "",
};

let squares = [];
let newGrid = [];

let sz = 50;
let szIncrement = 1; // Ensure this is non-zero to see the animation
let growing = true;
let t = 0;

let lastUpdateTime;
let updateInterval;
let fr;
let display;

//

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize DisplayGrid
  display = new DisplayGrid();

  // Populate the initial squares grid
  populateGrid();
  lastUpdateTime = millis(); // Initialize the last update time
  setupGUI();
}

function draw() {
  background(0);
  pane.refresh(); // update the information in the GUI
  console.log(sz);

  // let str = colorPick1.color(); //Total Stroke color
  // let overlay = colorPick3.color(); //fill color?
  // let secondary = colorPick2.color(); //Minority square color

  // let speed = slider1.value();
  // let fr = slider2.value();
  // let x = slider3.value();

  // slideraiLabel.html('Slider Value: ' + slider.value());
  stroke(params.stroke);

  fill(params.fill);

  let currentTime = millis();

  if (currentTime - lastUpdateTime >= updateInterval) {
    lastUpdateTime = currentTime;

    // if (growing) {
    //   sz += szIncrement;
    //   if (sz >= 100) {  // Max size before shrinking
    //     growing = false;
    //   }
    // } else {
    //   sz -= szIncrement;
    //   if (sz <= 100) {  // Min size before growing
    //     growing = true;
    //   }
    // }
    populateGrid();
  }

  display.grid();
}

function populateGrid() {
  squares = [];
  newGrid = [];

  for (let x = 0; x < width; x += params.sz) {
    for (let y = 0; y < height; y += params.sz) {
      squares.push(new GridSquare(x, y, params.sz, params.sz));
    }
  }

  for (let i = 0; i < squares.length; i++) {
    let sqr = squares[i];
    sqr.subDiv(sqr);
  }
}

//gridsquare tab
class GridSquare {
  constructor(xTemp, yTemp, wTemp, hTemp) {
    this.x = xTemp;
    this.y = yTemp;
    this.w = wTemp;
    this.h = hTemp;
    this.subSquares = [];
    this.superForm = new SuperForm(this.x, this.y, this.w, this.h); // Initialize SuperForm with the grid square's position and size
  }

  display() {
    // Display the Superformula within this grid square

    rect(this.x, this.y, this.w, this.h); // Draw the rectangle outline
    this.superForm.display();

    // Draw second-level subdivisions
    for (let sub of this.subSquares) {
      push();

      // fill(255, 0, 9, 50);
      rect(sub.x, sub.y, sub.w, sub.h);
      pop();

      sub.superForm.display();
    }
  }

  subDiv(sqr) {
    // First level of subdivision
    if (random(1) > 0.25) {
      params.sz = sqr.w / 2;

      let s1 = new GridSquare(this.x, this.y, params.sz, params.sz);
      let s2 = new GridSquare(this.x + params.sz, this.y, params.sz, params.sz);
      let s3 = new GridSquare(this.x, this.y + params.sz, params.sz, params.sz);
      let s4 = new GridSquare(
        this.x + params.sz,
        this.y + params.sz,
        params.sz,
        params.sz,
      );

      // Add first level subdivisions to the subSquares array
      this.subSquares.push(s1);
      this.subSquares.push(s2);
      this.subSquares.push(s3);
      this.subSquares.push(s4);

      // Second level of subdivision
      if (random(1) > 0.5) {
        for (let subSquare of this.subSquares) {
          let subSz = subSquare.w / 2;
          subSquare.subSquares.push(
            new GridSquare(subSquare.x, subSquare.y, subSz, subSz),
          );
          subSquare.subSquares.push(
            new GridSquare(subSquare.x + subSz, subSquare.y, subSz, subSz),
          );
          subSquare.subSquares.push(
            new GridSquare(subSquare.x, subSquare.y + subSz, subSz, subSz),
          );
          subSquare.subSquares.push(
            new GridSquare(
              subSquare.x + subSz,
              subSquare.y + subSz,
              subSz,
              subSz,
            ),
          );
        }
      }
    } else {
      this.subSquares.push(sqr);
    }

    // Add all the subdivisions to the newGrid array
    for (let s of this.subSquares) {
      newGrid.push(s);
    }
  }
}

//new grid tab

class DisplayGrid {
  grid() {
    // Display squares from the newGrid array
    for (let i = 0; i < newGrid.length; i++) {
      let s = newGrid[i];
      s.display();
    }
  }
}

//superform tab

class SuperForm {
  constructor(xTemp, yTemp, wTemp, hTemp) {
    this.x = xTemp;
    this.y = yTemp;
    this.w = wTemp;
    this.h = hTemp;
  }

  display() {
    // Update the slider values dynamically inside the display method

    // let ai = params.a;
    // let bi = params.b;
    // let mi = params.m;
    // let n1i = params.n1;
    // let n2i = params.n2;
    // let n3i = params.n3;
    // let vi = params.v;
    // let ti = params.t;
    // let posXi = params.xp;
    // let posYi = params.yp;
    push();
    fill(params.sfill);

    beginShape();

    // Add interactive variables a, b, m, n1, n2, n3 to the shape
    for (let theta = params.t; theta <= TWO_PI; theta += params.v) {
      // let c = [
      //   2, // a size /bottom of the shape/ one half of the spikes in m
      //   2, // b    top of the shape or one half of the spikes
      //   8, // m amount of rotation semetrie spikes 1 spiral 2 teardrop more spikes
      //   1, // n1 larger amount smooths out form of inner spikes
      //   cos(t), // n2 form from one side od the spikes
      //   sin(t), // n3 form from one side od the spikes
      // ];
      let radius = r(
        theta,
        params.a,
        params.b,
        params.m,
        params.n1,
        params.n2 + cos(t),
        params.n3 + cos(t),
      );

      // Map radius to fit within the grid square
      let maxRadius = max(this.w, this.h) / 4; // Max radius to fit within the smallest dimension
      let adjustedRadius = radius * maxRadius;

      // Calculate the x and y positions relative to the center of the grid square
      let posX = this.x + this.w / 2 + adjustedRadius * cos(theta * params.xp);
      let posY = this.y + this.h / 2 + adjustedRadius * sin(theta * params.yp);

      // Draw the vertex for the shape

      vertex(posX, posY);
    }

    endShape(CLOSE);
    this.t += 0.03; // Increment time for animation
    pop();
  }
}

function r(theta, a, b, m, n1, n2, n3) {
  // let cosPart = pow(abs(cos((m * theta) / 4.0) / a), n2);
  // let sinPart = pow(abs(sin((m * theta) / 4.0) / b), n3);

  // return pow(cosPart + sinPart, -1.0 / n1);
  return pow(
    pow(abs(cos((m * theta) / 4.0) / a), n2) +
      pow(abs(sin((m * theta) / 4.0) / b), n3),
    -1.0 / n1,
  );
}

function saveImage() {
  saveCanvas("custom.jpg");
}

function randomise() {}

function setupGUI() {
  pane = new Pane({
    title: "Parameters",
  });

  console.log(pane);

  pane.addBlade({ view: "separator" });
  pane.addBinding(params, "sz", { min: 40, max: 120, step: 1 });
  pane.addBinding(params, "a", { min: 0.1, max: 0.9, step: 0.01 });
  pane.addBinding(params, "b", { min: 0.7, max: 1, step: 0.01 });
  pane.addBinding(params, "m", { min: 0.1, max: 2, step: 0.01 });
  pane.addBinding(params, "n1", { min: 0.8, max: 4, step: 0.01 });
  pane.addBinding(params, "n2", { min: 0.1, max: 1, step: 0.01 });
  pane.addBinding(params, "n3", { min: 1, max: 40, step: 0.1 });
  pane.addBinding(params, "v", { min: 0.1, max: 0.64, step: 0.001 });
  pane.addBinding(params, "t", { min: 0.01, max: 3, step: 0.01 });
  pane.addBinding(params, "xp", { min: 1, max: 40, step: 0.1 });
  pane.addBinding(params, "yp", { min: 1, max: 40, step: 0.1 });

  pane.addBlade({ view: "separator" });
  pane.addBinding(params, "fill");
  pane.addBinding(params, "sfill");
  pane.addBinding(params, "stroke");
  pane.addBlade({ view: "separator" });

  // adding a button
  let save = pane.addButton({
    title: "ExportImage",
    label: "", // optional
  });
  save.on("click", function saveImage() {
    saveCanvas("image.png");
  });

  let randomise = pane.addButton({
    title: "Randomise",
    label: "", // optional
  });
  randomise.on("click", function saveImage() {
    saveCanvas("image.png");
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
