let green, purpleFlower, redFlower, butterfly;
let font;
let points = [];
let choice = 0;
let gridSize = 90;
let mic, fft;
let amplitude = 0;
let smoothAmp = 0;
let bassAmp = 0;
let trebleAmp = 0;
let sampleFactor;
let colorShift;

function preload() {
  green = loadImage("https://res.cloudinary.com/din8rv70n/image/upload/v1743678123/green_j4iti0.png");
  purpleFlower = loadImage("https://res.cloudinary.com/din8rv70n/image/upload/v1743678122/purple_flower_yhbem7.png");
  redFlower = loadImage("https://res.cloudinary.com/din8rv70n/image/upload/v1743678124/red_flower_xl2h6r.png");
  butterfly = loadImage("https://res.cloudinary.com/din8rv70n/image/upload/v1743678118/butterfly_yr5u6w.png");

  font = loadFont("https://res.cloudinary.com/din8rv70n/raw/upload/v1743678117/camera_ett6ql.ttf"); // Replace with your font file
}

function setup() {
  createCanvas(1536, 896);
  imageMode(CORNER);

  points = font.textToPoints("JOHN", width / 2 - 380, height / 2 - 50, 250, {
    sampleFactor: sampleFactor, // Keep density the same
    simplifyThreshold: 0,
  });

  let additionalPoints = font.textToPoints("GLACIER", 170, height / 2 + 180, 250, {
    sampleFactor: 0.07,
    simplifyThreshold: 0,
  });

  points = points.concat(additionalPoints);

  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw() {
  fft.analyze();
  let bass = fft.getEnergy("bass");
  let mid = fft.getEnergy("mid");
  let treble = fft.getEnergy("treble");
  
  amplitude = (bass * 0.6 + mid * 0.3 + treble * 0.1) * 0.015; // Weighted response  
  smoothAmp = lerp(smoothAmp, amplitude, 0.1); // Smooth transition  
  sampleFactor = map(bass,0,255,0.1,2);
  bassAmp = lerp(bassAmp, bass * 0.01, 0.1); // Separate bass tracking  
  trebleAmp = lerp(trebleAmp, treble * 0.01, 0.1); // Separate treble tracking  
  


    nameAnimation(smoothAmp, bassAmp, trebleAmp);
  
}

function nameAnimation(bass, treble, mid) {
  // background("#f3d333",10);
    background(0);



  for (let i = 0; i < points.length; i++) {
    let p = points[i];

    // Size pulsing effect from bass
    let size = map(sin(frameCount * 0.02 + i * 0.05) * bass, -1, 1, 15, 25);

    // Letter shaking effect from treble
    let shakeX = map(noise(frameCount * 0.01 + i * 0.05), 0, 1, -treble * 0.2, treble * 0.2);
    let shakeY = map(noise(frameCount * 0.02 + i * 0.05), 0, 1, -treble * 0.2, treble * 0.2);

    // Rotation effect from mid frequencies
    let rotation = map(sin(frameCount * 0.02 + i * 0.01) * mid, -1, 1, -PI / 4, PI / 4);

    push();
    noStroke();
  let t = frameCount * treble / 50; // Time-based variable for smooth color change
  let r = map(sin(t + i * 0.1), -1, 1, 200, 255);
  let g = map(sin(t + i * 0.2), -1, 1, 50, 150);
  let b = map(sin(t + i * 0.3), -1, 1, 100, 200);

  // fillGradient('radial', {
  //   from: [p.x, p.y, size * 2], // x, y, radius
  //   to: [p.x, p.y, size / 2], // x, y, radius
  //   steps: [
  //     color(100, g, 200),
  //     color(0, 0, b),
  //     color(r, g, b)
  //   ] // Array of p5.color objects or arrays containing [p5.color Object, Color Stop (0 to 1)]
  // });
  fill(r,g,b);
  // ellipse(p.x, p.y, size / 5, size / 5);
    pop();

    push();
    translate(p.x + shakeX, p.y + shakeY); // Apply shake effect
    rotate(rotation); // Apply rotation effect

    let images = [green, purpleFlower, redFlower, butterfly];
    let img = images[i % images.length];

    image(img, 0, 0, size, size);
    pop();
  }

}



