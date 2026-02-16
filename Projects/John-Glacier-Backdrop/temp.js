// let img;
// let time = 0;


// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   imageMode(CENTER);
//   img.resize(600, 600);
// }

// function draw() {
//   background('#ffd409');
//   time += 0.099 - 0.085; // sine wave speed

//   push();

//   translate(width / 2, height / 2);
//   scale(0.5);
//   let baseRadius = 300;
//   let amplitude = 50;
//   let radius = baseRadius + sin(time) * amplitude * 2;

//   let numCopies = 8;
//   let angleStep = TWO_PI / numCopies;

//   for (let i = 0; i < numCopies; i++) {
//     let angle = i * angleStep + time;
//     let scaleFactor = abs(sin(angle));

//     let x = cos(angle) * radius;
//     let y = sin(angle) * radius;

//     push();
//     translate(x, y);
//     rotate(angle);
//     scale(scaleFactor);
//     image(img, 0, 0);
//     pop();
//   }

//   pop();
// }

  let time = frameCount * 0.01 + amp; // Make motion responsive to audio
  let baseRadius = 100 + amp * 30; // Amplitude affects radius
  let numCopies = 50;
  let angleStep = TWO_PI / numCopies;

  let xOffset = (time * 250) % width;
  let yOffset = height / 1.35 + amp * 50; // Vertical movement based on amplitude

  for (let i = 0; i < numCopies; i++) {
    let angle = i * angleStep;
    let scaleFactor = abs(sin(angle + time) * amp); // More dynamic scaling

    let x = xOffset + cos(angle) * baseRadius;
    let y = yOffset + sin(angle) * baseRadius * scaleFactor;

    push();
    translate((x % width) * 1.2, y);
    rotate(angle + time * amp);
    scale(scaleFactor + 0.5);

    let images = [green, purpleFlower, redFlower, butterfly];
    let img = images[i % images.length];
    image(img, 0, 0, 120, 120);
    pop();
  }