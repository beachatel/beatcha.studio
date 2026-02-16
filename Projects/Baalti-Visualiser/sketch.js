let mic, sound;
let baalti, ear, system, earG;
let gridSize = 50;
let angle = 360;
let spectrum, snare, midEnergy, bassEnergy, level;
let baaltiTextGrid = 200;
let choice;
let imgArray = [];

function preload() {
  earG = loadImage('https://res.cloudinary.com/din8rv70n/image/upload/v1743083126/earG_dtjtpq.png');
  ear = loadImage('https://res.cloudinary.com/din8rv70n/image/upload/v1743083126/ear_alone_jx7ra5.png');
  baalti = loadImage('https://res.cloudinary.com/din8rv70n/image/upload/v1743083125/baalti_qdfngo.jpg');
  system = loadImage('https://res.cloudinary.com/din8rv70n/image/upload/v1743083129/system_xzrdqr.jpg');
  purple = loadImage('https://res.cloudinary.com/din8rv70n/image/upload/v1743083129/purple_mmvc0m.png');
  lime = loadImage('https://res.cloudinary.com/din8rv70n/image/upload/v1743083127/lime_wyorcy.png');
  blue = loadImage('https://res.cloudinary.com/din8rv70n/image/upload/v1743083125/blue_rdzzdk.png');
  orange = loadImage('https://res.cloudinary.com/din8rv70n/image/upload/v1743083128/orange_ruxvqf.png');
  pink = loadImage('https://res.cloudinary.com/din8rv70n/image/upload/v1743083128/pink_ffxaar.png');

  sound = loadSound('https://res.cloudinary.com/din8rv70n/video/upload/v1743083192/Baalti_-_Buttons_fstqt4.mp3'); 

  imgArray = [system, purple, lime, pink, blue, orange]; // Create an array of images

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // mic = new p5.AudioIn();
  // mic.start(); // picks up your Mac’s selected input
  fft = new p5.FFT();
  fft.setInput(sound); // Set FFT input to the loaded sound
  amplitude = new p5.Amplitude();
  amplitude.setInput(sound); // Set amplitude input to the loaded sound

  frameRate(10);
  imageMode(CENTER);
  choice = 0;

  sound.loop(); // Play the sound in a loop
}

function draw() {
  background(0, 100);
  spectrum = fft.analyze();
  bassEnergy = fft.getEnergy("bass"); // 20–140 Hz
  midEnergy = fft.getEnergy("mid"); // 400–2,600 Hz
  snare = fft.getEnergy("treble"); // snare

  level = amplitude.getLevel(); //* 50;


  if (choice === 0) {
    visual1();
  }  if (choice === 1) {
  visual2();
  } else if (choice === 2) {
  visual3();
  } else if (choice === 3){
    visual4();
  } else if (choice === 4){
    visual5();
  } else if (choice === 5){
    visual6();
  }
}

function visual1(){ // orange circle rotation animation
  push();
    fill("#fc4100")
  strokeWeight(snare / 3);
  stroke("orange")


  translate(width/2,height/2);
    scale(map(snare,0,1000,0.2,1.5));
  for(let x = 0; x < width;  x+= map(snare,0,100,1,100)){
    for(let y = 0; y < height; y += gridSize){
      rotate(bassEnergy);
     ellipse(x / bassEnergy,y,snare,bassEnergy)


    }
  }
  pop();
}


function visual2(){ // for loop grid of baalti text
  push();
  for(let x = 0; x < width; x += baaltiTextGrid){
    for(let y = 0; y < height; y += baaltiTextGrid){
      let stretchX = random(1) > 0.5; // 50% chance to stretch in X
      let stretchY = random(1) > 0.5; // 50% chance to stretch in Y
      let stretchFactorX = stretchX ? map(midEnergy, 0, 255, 1, 10) : 1;
      let stretchFactorY = stretchY ? map(midEnergy, 0, 255, 1, 5) : 1;
      image(baalti, x, y, 80 * stretchFactorX, 80 * stretchFactorY);
    }
  }
  pop();
}

function visual3(){
  push();
  let noiseValue = noise(bassEnergy); 
  let imgIndex = floor(map(noiseValue, 0, 1, 0, imgArray.length));  
  let img = imgArray[imgIndex];  

  // let alphaValue = map(bassEnergy, 0, 255, 50, 200); // Dynamic transparency


  image(img, width/7, height/1.4,width/4,height/1.9);
  image(img, width/7, height/4,width/4,height/1.9);
  image(img, width/2, height/2,width/2,height/1.1);
  image(img, width/1.15, height/4,width/4,height/1.9);
  image(img, width/1.15, height/1.4,width/4,height/1.9);
  

  
  pop(); 
}

  

function visual4(){
    push();
  let cols = 5; // Number of columns
  let rows = 5; // Number of rows
  let cellWidth = width / cols;
  let cellHeight = height / rows;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      push();
      translate(i * cellWidth + cellWidth / 2, j * cellHeight + cellHeight / 2);
      scale(map(snare, 0, 1000, 0.2, 1.5));
      fill("#fc4100");
      strokeWeight(snare / 3);
      stroke("orange");

      for (let x = 0; x < cellWidth; x += map(snare, 0, 100, 1, 50)) {
        for (let y = 0; y < cellHeight; y += gridSize) {
          rotate(bassEnergy);
          ellipse(x / bassEnergy, y, snare, bassEnergy);
        }
      }
      pop();
    }
  }
  pop();
}
function visual5() {
  push();

  let time = frameCount * 0.09; // Adjust speed
  let baseRadius = 100;
  let amplitude = map(midEnergy, 0, 255, 20, 100); // Make amplitude sound-reactive
  let radius = baseRadius + sin(time) * amplitude * 2;

  let numCopies = 5; // Number of ear images in the circular pattern
  let angleStep = TWO_PI / numCopies;

  translate(width / 2, height / 2);

  for (let i = 0; i < numCopies; i++) {
    let angle = i * angleStep + time;
    let scaleFactor = abs(sin(angle)) * map(snare, 0, 255, 0.5, 2); // Vary size based on snare energy

    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    push();
    translate(x, y);
    rotate(angle);
    // scale(scaleFactor);
    image(earG, 0, 0, 500, 200); // Adjusted size for better visibility
    pop();
  }

  pop();
}

function visual6() {
  push();
  let spacing = width / 5; // Adjust spacing between images
  for (let i = 0; i < 10; i++) {
    let stretchFactorX = map(midEnergy, 0, 255, 1, 5); // Stretch based on midEnergy
    let stretchFactorY = map(snare, 0, 255, 1, 3); // Stretch based on snare energy
    let x = i * spacing + spacing / 2; // Position along x-axis
    let y = height / 2; // Center vertically

    // Top row
    image(ear, x, y / 2, 100 * stretchFactorX, 100 * stretchFactorY);
    // Middle row
    image(ear, x, y, 100 * stretchFactorX, 100 * stretchFactorY);
    // Bottom row
    image(ear, x, y * 1.5, 100 * stretchFactorX, 100 * stretchFactorY);
  }
  pop();
}



function keyPressed() {
  if (key === '1') {
    choice = 0;
  } else if (key === '2') {
 choice = 1;
  } else if (key === '3'){
    choice = 2;
  }
  else if (key === '4'){
  choice = 3;
} else if (key === '5'){
  choice = 4;
} else if (key === '6'){
  choice = 5;
}
}

