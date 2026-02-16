let img, song, Balance, ZuumeBlackItalic;
let fft;
let peakDetect;
let pulseSize = 0;
let cols, rows;
let gridCounter = 0; // Tracks the current logo position
let cellSize = 100; // Size of each grid cell
let reversing = false; // Tracks the direction of the grid filling
let letters = ['B', 'A', 'L', 'A', 'N', 'C', 'E']; // The word BALANCE
let letterIndex = 0; // Tracks which letter is currently displayed
let displayBalance = false; // Whether to replace the letters in the top rows

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
    background("black");
    // Analyze the sound spectrum
    fft.analyze();
    peakDetect.update(fft);
    
    if (peakDetect.isDetected) {
        if (!reversing) {
            // Increment gridCounter while filling
            gridCounter = min(gridCounter + 2, cols * rows); // how many logos get added/removed per beat
            if (gridCounter === cols * rows) {
                reversing = true; // Start reversing when grid is full
            }
        } else {
            // Decrement gridCounter while reversing
            gridCounter = max(gridCounter - 1, 0);
            if (gridCounter === 0) {
                reversing = false; // Start filling again when grid is empty
            }
        }
        pulseSize = 150; // Trigger pulse size
        // Start replacing letters when the reversal reaches the 5th row
        if (reversing && gridCounter <= rows * 5) {
            displayBalance = true; // Enable replacing letters
            letterIndex = min(letterIndex + 1, letters.length); // Progressively reveal letters
        }
    }
    
    pulseSize = max(pulseSize - 20, 0); // Gradually reduce pulse size
    
    // Draw dynamic grid - modified to skip top two rows when BALANCE is displaying
    for (let i = 0; i < gridCounter; i++) {
        let row = floor(i / cols);
        let col = i % cols;
        let x = 675 + col * cellSize; // X position
        let y = row * cellSize + 40; // Y position
        
        // Skip drawing 'A' letters in the first two rows if BALANCE is displaying
        if (displayBalance && row < 2 && col < letterIndex) {
            // Position the letters 'B', 'A', 'L', 'A', 'N', 'C', 'E' in top rows
            let letter = letters[col]; // Get the letter based on the column index
            textFont(Balance);
            textSize(100);
            fill("#deaacf");
            noStroke();
            text(letter, x, y + cellSize / 2); // Draw each letter in its respective column
            continue; // Skip this iteration for the letters
        }
        
        textFont(Balance);
        textSize(100);
        fill("#deaacf");
        noStroke();
        text('A', x, y + cellSize / 2); // Draw logo, vertically centered in cell
    }
    
    // Draw single large "BALANCE" text spanning two rows
    if (displayBalance) {
        textFont(ZuumeBlackItalic);
        textSize(200); // Increased text size to span two rows
        fill("#deaacf");
        noStroke();
        
        // Calculate the starting position for the full word
        let balanceX = 675;
        let balanceY = cellSize + cellSize; // Position in the middle of the two rows
        
        // Calculate spacing for each letter to fit within the columns
        let letterSpacing = (cellSize * 2) / (letters.length - 1); // Spread letters evenly across the width of 7 columns
        
        // Draw each letter progressively with adjusted spacing
        for (let i = 0; i < letterIndex; i++) {
            text(letters[i], balanceX + i * letterSpacing, balanceY); // Evenly spaced letters
        }
    }
    
    // Dynamic text for 'A'
    textFont(Balance);
    let dynamicSize = map(pulseSize, 0, 250, 150, 300); // Map pulse size to text size
    textSize(dynamicSize);
    fill("#deaacf");
    noStroke();
    text('A', 50, 670);
    text('B', 100, 670);
    
    // Info
    textFont(ZuumeBlackItalic);
    textSize(400);
    fill("#deaacf");
    noStroke();
    text('DVS1', 70, 300);
    textSize(70);
    text('MPC-TRAX', 70, 400);
    text('NICKY MANN', 60, 480);
    textSize(100);
    stroke('#deaacf');
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
