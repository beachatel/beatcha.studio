let squares = [];
let newGrid = [];

let sz = 100;
let szIncrement = 1; // Ensure this is non-zero to see the animation
let growing = true;
let t = 0;

let lastUpdateTime;
let updateInterval;
let fr;
let display;

let colorPick1, colorPick2, colorPick3;
let sliderai,
  sliderbi,
  slidermi,
  slidern1i,
  slidern2i,
  slidern3i,
  slidervi,
  sliderti;
// let slideraiLabel
let img;
let button;

//

function setup() {
  createCanvas(windowWidth - windowWidth / 5, windowHeight - windowHeight / 9);

  ui();

  // Initialize DisplayGrid
  display = new DisplayGrid();

  // Populate the initial squares grid
  populateGrid();
  lastUpdateTime = millis(); // Initialize the last update time
}

function draw() {
  let str = colorPick1.color(); //Total Stroke color
  let overlay = colorPick3.color(); //fill color?
  let secondary = colorPick2.color(); //Minority square color

  // let speed = slider1.value();
  // let fr = slider2.value();
  // let x = slider3.value();

  // slideraiLabel.html('Slider Value: ' + slider.value());
  background(20);
  stroke(str);

  fill(overlay);

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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function populateGrid() {
  squares = [];
  newGrid = [];

  for (let x = 0; x < width; x += sz) {
    for (let y = 0; y < height; y += sz) {
      squares.push(new GridSquare(x, y, sz, sz));
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
      let sz = sqr.w / 2;
      let s1 = new GridSquare(this.x, this.y, sz, sz);
      let s2 = new GridSquare(this.x + sz, this.y, sz, sz);
      let s3 = new GridSquare(this.x, this.y + sz, sz, sz);
      let s4 = new GridSquare(this.x + sz, this.y + sz, sz, sz);

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
  constructor() {
    // Constructor can remain empty or be omitted if no initialization is needed
  }

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
    this.t = 0;
  }

  display() {
    // Update the slider values dynamically inside the display method
    let ai = sliderai.value();
    let bi = sliderbi.value();
    let mi = slidermi.value();
    let n1i = slidern1i.value();
    let n2i = slidern2i.value();
    let n3i = slidern3i.value();
    let vi = slidervi.value();
    let ti = sliderti.value();
    let posXi = sliderposXi.value();
    let posYi = sliderposYi.value();

    beginShape();
    // Add interactive variables a, b, m, n1, n2, n3 to the shape
    for (let theta = ti; theta <= TWO_PI; theta += vi) {
      let radius = this.r(theta, sin(this.t) + ai, bi, mi, n1i, n2i, n3i);

      // Map radius to fit within the grid square
      let maxRadius = max(this.w, this.h) / 10; // Max radius to fit within the smallest dimension
      let adjustedRadius = radius * maxRadius;

      // Calculate the x and y positions relative to the center of the grid square
      let posX = this.x + this.w / 2 + adjustedRadius * cos(theta * posXi);
      let posY = this.y + this.h / 2 + adjustedRadius * sin(theta * posYi);

      // Draw the vertex for the shape
      vertex(posX, posY);
    }

    endShape(CLOSE);
    this.t += 0.03; // Increment time for animation
  }

  r(theta, a, b, m, n1, n2, n3) {
    let cosPart = pow(abs(cos((m * theta) / 4.0) / a), n2);
    let sinPart = pow(abs(sin((m * theta) / 4.0) / b), n3);

    return pow(cosPart + sinPart, -1.0 / n1);
  }
}

function saveImage() {
  save("custom.jpg");
}

function randomise() {}

function ui() {
  // interactivity sliders and color picker

  colorPick1 = createColorPicker("deeppink");
  colorPick1.position(windowWidth - windowWidth / 6, windowHeight / 6);

  colorPick2 = createColorPicker("rgb(110, 231, 144)");
  colorPick2.position(windowWidth - windowWidth / 6, windowHeight / 4);

  colorPick3 = createColorPicker("rgb(82, 26, 225)");
  colorPick3.position(windowWidth - windowWidth / 6, windowHeight / 3);

  //intenisty
  sliderai = createSlider(0, 5, 0.1, 0.2);
  sliderai.position(windowWidth - windowWidth / 6, 300);
  sliderai.size(200);
  let slideraiLabel = createDiv(`A: ${sliderai.value()}`);
  slideraiLabel.position(windowWidth - windowWidth / 6, 330);
  slideraiLabel.style("color", "black");
  sliderai.input(() => slideraiLabel.html(`A: ${sliderai.value()}`));

  sliderbi = createSlider(0.1, 1, 0.1, 0.1);
  sliderbi.position(windowWidth - windowWidth / 6, 350);
  sliderbi.size(200);
  let sliderbiLabel = createDiv(`B: ${sliderbi.value()}`);
  sliderbiLabel.position(windowWidth - windowWidth / 6, 380);
  sliderbiLabel.style("color", "black");
  sliderbi.input(() => sliderbiLabel.html(`B: ${sliderbi.value()}`));

  slidermi = createSlider(0, 2, 0.1, 0.1);
  slidermi.position(windowWidth - windowWidth / 6, 400);
  slidermi.size(200);

  slidern1i = createSlider(0, 10);
  slidern1i.position(windowWidth - windowWidth / 6, 450);
  slidern1i.size(200);

  slidern2i = createSlider(0, 10);
  slidern2i.position(windowWidth - windowWidth / 6, 500);
  slidern2i.size(200);

  //scale
  slidern3i = createSlider(0, 10);
  slidern3i.position(windowWidth - windowWidth / 6, 550);
  slidern3i.size(200);

  //theta times by variable
  slidervi = createSlider(0.1, 1, 0.1, 0.1);
  slidervi.position(windowWidth - windowWidth / 6, 600);
  slidervi.size(200);

  //theta interaction
  sliderti = createSlider(0, 5, 0.1, 0.1);
  sliderti.position(windowWidth - windowWidth / 6, 650);
  sliderti.size(200);

  sliderposXi = createSlider(0, 100, 1, 0.1);
  sliderposXi.position(windowWidth - windowWidth / 6, 700);
  sliderposXi.size(200);

  sliderposYi = createSlider(0, 100, 1, 0.1);
  sliderposYi.position(windowWidth - windowWidth / 6, 750);
  sliderposYi.size(200);

  button = createButton("Save Image");
  button.mousePressed(saveImage);

  randomiseButton = createButton("Randomise");
  randomiseButton.mousePressed(randomise);
}
