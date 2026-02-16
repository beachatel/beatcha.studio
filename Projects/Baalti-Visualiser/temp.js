
function drawAnim1(x, y, diam1, diam2) {
  push();
  translate(0, height / 2);
  scale(map(snare, 0, 1000, 0.1, 0.1));

  for (let i = 0; i < 10; i++) { // Loop to draw the custom shape multiple times
    let offsetX = map(i, 0, 10, -50, 50); // Adjust horizontal offset
    let offsetY = map(i, 0, 10, -50, 50); // Adjust vertical offset

    rotate(bassEnergy * 0.01); // Add rotation based on bass energy
    beginShape();
    vertex(x + offsetX, y + offsetY);
    vertex(x + offsetX + diam1, y + offsetY - diam2);
    vertex(x + offsetX + diam2, y + offsetY + diam1);
    vertex(x + offsetX - diam1, y + offsetY + diam2);
    endShape(CLOSE);
  }

  pop();
}



function drawAnim1(snare,bassEnergy,gridSize){
push();

  translate(width/2,height/2);
    scale(map(snare,0,1000,0.1,0.7));
  for(let x = 0; x < width;  x+= map(snare,0,100,1,100)){
    for(let y = 0; y < height; y += gridSize){
      rotate(bassEnergy);
     ellipse(x / bassEnergy,y,snare,bassEnergy)

    }
  }
  pop();
}