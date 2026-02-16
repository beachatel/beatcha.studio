let img, song, Balance, ZuumeBlackItalic;
let fft;
let peakDetect;
let pulseSize = 0;

let cols, rows;
let gridCounter = 0; // Tracks the current logo position
let cellSize = 100; // Size of each grid cell
let reversing = false; // Tracks the direction of the grid filling

function preload() {
  img = loadImage("img/logo.jpg");
  song = loadSound("src/BlackRussian.mp3");

  Balance = loadFont('/Fonts/Balance.ttf');
  ZuumeBlackItalic = loadFont('/Fonts/ZuumeBlackItalic.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  song.loop();

  // Initialize FFT with higher resolution and reduced smoothing
  fft = new p5.FFT(0.1, 1024);

  // Configure peak detection with a smaller threshold for faster response
  peakDetect = new p5.peakDetect(20, 20000, 0.1, 10); // Frequency range and sensitivity

    cols = floor((width / 2) / cellSize); // Grid columns on the right half
  rows = floor(height / cellSize); // Grid rows
}

function draw() {
  background("white");

  // Analyze the sound spectrum
  fft.analyze();
  peakDetect.update(fft);

 if (peakDetect.isDetected) {
    if (!reversing) {
      // Increment gridCounter while filling
      gridCounter = min(gridCounter + 2, cols * rows);
      if (gridCounter === cols * rows) {
        reversing = true; // Start reversing when grid is full
      }
    } else {
      // Decrement gridCounter while reversing
      gridCounter = max(gridCounter - 2, 0);
      if (gridCounter === 0) {
        reversing = false; // Start filling again when grid is empty
      }
    }

    pulseSize = 150; // Trigger pulse size
  }

  pulseSize = max(pulseSize - 20, 0); // Gradually reduce pulse size

  // // Draw dynamic ellipse based on pulse size
  // ellipse(width / 2, height / 2, pulseSize);

  for (let i = 0; i < gridCounter; i++) {
    let x = 675 + (i % cols) * cellSize; // X position
    let y = floor(i / cols) * cellSize + 40; // Y position
    textFont(Balance)
    textSize(100);
    fill("black")
    noStroke();
    text('A', x, y + cellSize / 2); // Draw logo, vertically centered in cell
  }


  // Dynamic text for 'A'
  textFont(Balance);
  let dynamicSize = map(pulseSize, 0, 250, 150, 300); // Map pulse size to text size
  textSize(dynamicSize);
  fill("black");
  noStroke();
  text('A', 50, 670);
  text('B', 100, 670);
  // text('A A A A A ', 700, 500);
  // text('A A A A A ', 700, 650);

  // Info
  textFont(ZuumeBlackItalic);
  textSize(400);
  fill("black");
  noStroke();
  text('DVS1', 70, 300);
  textSize(70);
  text('MPC-TRAX', 70, 400);
  text('NICKY MANN', 60, 480);
  textSize(100);
  stroke('black');
  strokeWeight(2);
  noFill();
  textSize(50);
  text('[4HR SET]', 450, 350);
  textSize(200);
  strokeWeight(4);
  text('07', 430, 520);
  text('03', 410, 670);
  
}

function mousePressed() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}
