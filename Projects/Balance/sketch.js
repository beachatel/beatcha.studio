// Global Variables
let img, song, Balance, ZuumeBlackItalic;
let fft, peakDetect, pulseSize = 0;
let cols, rows, gridCounter = 0, cellSize = 100;
let letters = ['B', 'A', 'L', 'A', 'N', 'C', 'E'];
let letterIndex = 0, displayBalance = false;
let phase = 0, marchSeventhIndex = 0;
let marchSeventhWords = ["March", "Seventh", "WHQ"];
let displayedWords = [false, false, false];
let beatCounter = 0;
let flashCounter = 0;

// Preload Assets
function preload() {
    img = loadImage("img/logo.jpg");
    song = loadSound("src/Test.m4a");
    Balance = loadFont('/Fonts/Balance.ttf');
    ZuumeBlackItalic = loadFont('/Fonts/ZuumeBlackItalic.ttf');
}

// Setup Canvas and Sound
function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(displayDensity());
    song.loop();
    fft = new p5.FFT(0.1, 1024);
    peakDetect = new p5.PeakDetect(20, 20000, 0.1, 10);
    cols = floor((width / 2) / cellSize);
    rows = 7; // Set rows to 7
}

// Draw Function
function draw() {
    background("white");
    fft.analyze();
    peakDetect.update(fft);

    // Handle Peak Detection
    if (peakDetect.isDetected) {
        pulseSize = 150;
        beatCounter++;
        flashCounter++;
        if (phase === 0) { // Initial Grid Fill
            gridCounter = min(gridCounter + 5, cols * rows);
            if (gridCounter === cols * rows) phase = 1;
        } else if (phase === 1) { // Reverse Grid
            gridCounter = max(gridCounter - 5, 0);
            if (gridCounter <= cols * 3) {
                phase = 2;
                displayBalance = true;
            }
        } else if (phase === 2) { // Show Text
            if (displayBalance && letterIndex < letters.length) {
                letterIndex = min(letterIndex + 1, letters.length);
            } else if (letterIndex >= letters.length && marchSeventhIndex < marchSeventhWords.length) {
                if (beatCounter % 3 === 0) {
                    displayedWords[marchSeventhIndex] = true;
                    marchSeventhIndex++;
                }
            }
        }
    }

    pulseSize = max(pulseSize - 20, 0);

    // Draw Grid
    const startY = 40;
    const balanceStartX = 675 + (cols - letters.length) * cellSize / 2; // Center BALANCE horizontally
    const textColor = "black";

    for (let i = 0; i < gridCounter; i++) {
        let row = floor(i / cols), col = i % cols;
        let x = 675 + col * cellSize, y = startY + row * cellSize;

        // Clear Top Three Rows When Displaying BALANCE
        if (displayBalance && row < 3) {
            continue;
        }

        textFont(Balance);
        textSize(100);
        fill(textColor);
        noStroke();
        text('A', x, y + cellSize / 2);
    }

    // Draw Text
    if (displayBalance) {
        textFont(ZuumeBlackItalic);
        fill(textColor);
        noStroke();
        textSize(200);
        for (let i = 0; i < letterIndex; i++) {
            let x = balanceStartX + i * cellSize, y = 40 + cellSize;
            text(letters[i], x, y + cellSize / 2);
        }

        // Draw "March", "Seventh", "WHQ" flashing around on rows 3, 4, and 5
        for (let i = 0; i < displayedWords.length; i++) {
            if (displayedWords[i]) {
                textSize(100);
                let word = marchSeventhWords[i];
                let wordX = 675 + (cols - word.length) * cellSize / 2 + (beatCounter % 2 === 0 ? -20 : 20); // Flash left and right
                let wordY = 40 + cellSize * (2 + i) + cellSize / 2;
                text(word, wordX, wordY);
            }
        }

        // Draw right angle pattern after "WHQ" appears
        if (displayedWords[2]) {
            textFont(Balance);
            textSize(100);
            fill(textColor);
            noStroke();

            let startX = 675 + 6 * cellSize; // Column 6 (starting X position)
            let startY = 40 + 6 * cellSize; // Row 6 (starting Y position)
            let pulseRadius = (flashCounter % 5) * (cellSize / 2); // Pulse expands over time

            // Limit radius to avoid touching the central text
            pulseRadius = min(pulseRadius, cellSize * 3); // Stop radius at a safe distance

            for (let r = 0; r <= pulseRadius; r += cellSize) { // Increase step size to cellSize
                let points = [
                    { x: startX - r, y: startY }, // Move left from starting point
                    { x: startX, y: startY - r }, // Move up from starting point
                ];

                // Fill diagonals for a diamond-like effect
                for (let i = 1; i <= r / cellSize; i++) { // Increase step size to cellSize
                    points.push({ x: startX - i * cellSize, y: startY - i * cellSize }); // Top-left diagonal
                }

                // Draw all points in the current radius
                for (let point of points) {
                    text('A', point.x, point.y + cellSize / 2);
                }
            }
        }
    }

    // Info Text
    textFont(ZuumeBlackItalic);
    textSize(400);
    fill(textColor);
    noStroke();
    text('DVS1', 70, 300);
    textSize(70);
    text('MPC-TRAX', 70, 400);
    text('NICKY MANN', 60, 480);
    textSize(100);
    stroke(textColor);
    strokeWeight(2);
    noFill();
    textSize(50);
    text('[4HR SET]', 450, 350);
    textSize(200);
    strokeWeight(4);
    text('07', 430, 520);
    text('03', 410, 670);

    // Dynamic text for 'A'
    textFont(Balance);
    let dynamicSize = map(pulseSize, 0, 250, 150, 300); // Map pulse size to text size
    textSize(dynamicSize);
    fill(textColor);
    noStroke();
    text('A', 50, 670);
    text('B', 100, 670);
}

// Toggle Play/Pause on Mouse Press
function mousePressed() {
    if (song.isPlaying()) song.pause();
    else song.play();
}