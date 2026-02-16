let img;
let time = 0;

function preload() {
  img = loadImage('https://res.cloudinary.com/din8rv70n/image/upload/v1742652194/likearibbon_pmnpre.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  img.resize(600, 600);
}

function draw() {
  background('#ffd409');
  time += 0.099 - 0.085; // sine wave speed

  push();

  translate(width / 2, height / 2);
  scale(0.5);
  let baseRadius = 300;
  let amplitude = 50;
  let radius = baseRadius + sin(time) * amplitude * 2;

  let numCopies = 8;
  let angleStep = TWO_PI / numCopies;

  for (let i = 0; i < numCopies; i++) {
    let angle = i * angleStep + time;
    let scaleFactor = abs(sin(angle));

    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    push();
    translate(x, y);
    rotate(angle);
    scale(scaleFactor);
    image(img, 0, 0);
    pop();
  }

  pop();
}
