let bgPicker,fPicker,rPicker;
let angle = 360;
let angle1 = 360;
let angleVel = 0.00001
let gridSize = 1000;
let gridSize1 = 700;
let gridSize2 = 100;
let x1 = 0;
let r,r1,r2,r3,rX,rY,rVal;
let angle2 = 0;
let font,aFont;
let scaleFactor;

function preload(){
  font = loadFont("Fonts/RealTextPro-Regular.ttf");
  aFont = loadFont("Fonts/ABCFavoritArabic-Bold-Trial copy.otf");
}
function setup() {
  createCanvas(windowWidth/2, windowHeight);

  // bgPicker = createColorPicker("white");
  // bgPicker.position(10,10);

  // fPicker = createColorPicker("#f1ad5c");
  // fPicker.position(10,50);

  //   rPicker = createColorPicker("#e33189");
  // rPicker.position(10,90);

  r = random(100);
    r1 = random(500,1000);
      r2 = random(100);
        r3 = random(100);
  rX = random(width / 2);
  rY = random(height / 2);
  rVal = random(1);
  // background("#893df5");
  // background("#white");
}

function draw() {
  background(255);
// stroke(255,0,0);




fill("#4c1f8c")
 stroke("#eb4125");



//   stroke(fPicker.value()); 

//   fill(rPicker.value());
 textFont(font);

// push();
// translate(width/2,height / 4);
// scale(0.09);
// x1 += 0.1 ;
// if (x1 > 200){
//   x1 = 0;
// }

// for (let x = x1; x < width; x += gridSize1){
//   for (let y = x1; y < height; y += gridSize1){
//   for (let j = 0; j < 10  ; j++) {  
//     // rect(x,y,0,j * 3000);
//     strokeWeight(j * 4);
//     rotate(angle1);

//       drawShape(x,y,500,1000);
    
//     textSize(200);

    
//   }
//   }
// }
//  pop();

//  push();
// translate(width/2,height / 1.2);
// scale(0.08);
x1 += 10;
if (x1 > 2000){
  x1 *= -1;
}

// for (let x = x1; x < width; x += gridSize1){
//   for (let y = x1; y < height; y += gridSize1){
//   for (let j = 0; j < 10  ; j++) {  
//     // rect(x,y,0,j * 3000);
//     strokeWeight(j * 4);
//     rotate(angle1);

//       drawShape(x,y,500,1000);
    
//     textSize(200);

    
//   }
//   }
// }
//  pop();

//   push();
// translate(width/1.2,height / 4);
// scale(0.08);

// if (x1 > 200){
//   x1 = 0;
// }

// for (let x = x1; x < width; x += gridSize1){
//   for (let y = x1; y < height; y += gridSize1){
//   for (let j = 0; j < 10  ; j++) {  
//     // rect(x,y,0,j * 3000);
//     strokeWeight(j * 4);
//     rotate(angle1);

//       drawShape(x,y,500,1000);
    
//     textSize(200);

    
//   }
//   }
// }
//  pop();

//  push();
// translate(width/6,height / 4);
// scale(0.08);

// if (x1 > 200){
//   x1 = 0;
// }

// for (let x = x1; x < width; x += gridSize1){
//   for (let y = x1; y < height; y += gridSize1){
//   for (let j = 0; j < 10  ; j++) {  
//     // rect(x,y,0,j * 3000);
//     strokeWeight(j * 4);
//     rotate(angle1);

//       drawShape(x,y,500,1000);
    
//     textSize(200);

    
//   }
//   }
// }
//  pop();\

push();
  textAlign(CENTER);
scale(0.95);
translate(20,0);
stroke(0);
strokeWeight(5);
fill(0);
textSize(130);
  textAlign(CENTER);
text("40Mustaqel ",width/2 + 10,100);  
text("40Mustaqel ",width/2+ 10,200);  
text("40Mustaqel ",width/2+ 10,300);  
text("40Mustaqel ",width/2+ 10,400);  
text("40Mustaqel ",width/2+ 10,500);  
text("40Mustaqel ",width/2+ 10,600);  
text("40Mustaqel ",width/2+ 10,700);  

noStroke();
fill(255);
textSize(130);
  textAlign(CENTER);
text("40Mustaqel ",width/2 + 20,100);  
text("40Mustaqel ",width/2 - 3,200);  
text("40Mustaqel ",width/2 + 20,300);  
text("40Mustaqel ",width/2 - 3,400);  
text("40Mustaqel ",width/2+ 20,500);  
text("40Mustaqel ",width/2 - 3,600);  
text("40Mustaqel ",width/2 + 20,700);  



 
pop();

  


   push();    
  
translate(width/2,height/2);
 scale(0.21)
// fill(200,100,255);
fill(255);
// stroke(0,255,100);
stroke(0);
for (let x = 0; x < width; x += gridSize){
  for (let y = 0; y < height; y += gridSize){

  for (let j = 0; j < 10  ; j++) {  
    rect(x,y,j * 3,j);
    strokeWeight(j * 6);

    ellipse(x,y,x1,1000 * x1 / x1);
    rotate(angle);

      drawShape(x,y,500,x1);
    

ellipse(x ,y ,290,290);

// text("CENTRAL CENTRAL",x * j,y * j );
angle += angleVel

  }
  }
}
pop();
textFont();
stroke(0,255,100);
strokeWeight(10);
fill(0);
textFont(aFont);

 scaleFactor = (sin(frameCount * 0.01) + 0.5); // Growing effect
  let centerX = width / 2;
  let centerY = height / 2;
  let radius = 150; // Adjust the radius as needed
  drawTextOnCircle("40معقل40معقل40معقل", 50, radius, centerX, centerY, scaleFactor);
  push();
fill(0);
   stroke(0);
   strokeWeight(10);

  //  ellipse(width/2,height/1.8,400,400);

  noFill();
    ellipse(width/2,height/2,500,500);
pop();

noStroke();
text("Independent graphic design studio based in Cairo",40,height/1.045);
text("Independent graphic design studio based in Cairo",40,height/1.03);
text("Independent graphic design studio based in Cairo",40,height/1.015);

text("استوديو مُستقل للتصميم الجرافيكي بالقاهرة",width/2,height/1.045);
text("استوديو مُستقل للتصميم الجرافيكي بالقاهرة",width/2,height/1.035);
text("استوديو مُستقل للتصميم الجرافيكي بالقاهرة",width/2,height/1.02);

rect(width/2.2,height/1.06,2,35);
rect(width/2.1,height/1.06,2,35);


  //  saveFrames("frame", "png");
}

  


    
  


function drawShape(x1, y1, x2, y2){
  beginShape();

  curveVertex(x1 - 200, y1);  
  curveVertex(x1 , y1);
  curveVertex((x1 + x2) / 2, y1 + 600);  // Control point at the top
  curveVertex(x2, y2);
  curveVertex(x2 + 10000, y2); 

  endShape();
  
    
}
function drawTextOnCircle(txt, segments, radius, centerX, centerY, scaleFactor) {
  push();
  textFont(aFont);
  textSize(44 * scaleFactor);
  textAlign(CENTER, CENTER);

  for (let i = 0; i < txt.length; i++) {
    let angle = map(i, 0, txt.length, PI, -PI); // Adjusting for inside curve placement
    let x = centerX + cos(angle) * radius * scaleFactor;
    let y = centerY + sin(angle) * radius * scaleFactor;
    
    push();
    translate(x, y);
    rotate(angle + HALF_PI); // Align text inside the circle
    text(txt.charAt(i), 0, 0);
    pop();
  }
  pop();
}
