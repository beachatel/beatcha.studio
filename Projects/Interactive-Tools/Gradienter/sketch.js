let gridSize = 50;
let colorPicker = 50;
let colors;
let value = 0.25;
let interA;
let x1 = 10;
  let v1,v2,v3,v4;
  let from,to;
  let noiseFrom,noiseTo;
  let r1,r2,r3,r4; 
  let r;

let tanCheckBox,sinCheckBox,check1,check2,check3,check4,rectCheckBox,rectSinCheckBox;
let translateSlider,gridSizeSlider,gridSizeMultSlider;  
let tanEllipseAnimation,sinEllipseAnimation;
let bgColorPicker;
let saveImageButton;
let colorInputs = [];

function setup() {
  createCanvas(windowWidth / 1.25 , windowHeight);

//  frameRate(1);
  translateSlider = createSlider(1,20,10,0.01);
    translateSlider.position(10, 10);
    translateSlider.style("font-family", "wanpaku-rera, sans-serif");
  translateSlider.size(80)

  // Label for translateSlider
  let translateLabel = createDiv("Translate");
  translateLabel.position(translateSlider.x + translateSlider.width + 20, translateSlider.y);
  translateLabel.style("font-family", "wanpaku-rera, sans-serif");
  translateLabel.style("color", "white");

  gridSizeSlider = createSlider(10,100,50,1);
    gridSizeSlider.position(10, 40);
    gridSizeSlider.style("font-family", "wanpaku-rera, sans-serif");
  gridSizeSlider.size(80);

  // Label for gridSizeSlider
  let gridSizeLabel = createDiv("Grid Size");
  gridSizeLabel.position(gridSizeSlider.x + gridSizeSlider.width + 20, gridSizeSlider.y);
  gridSizeLabel.style("font-family", "wanpaku-rera, sans-serif");
  gridSizeLabel.style("color", "white");

   gridSizeMultSlider = createSlider(1,4,1,0.1);
    gridSizeMultSlider.position(10, 70);
        gridSizeMultSlider.style("font-family", "wanpaku-rera, sans-serif");
  gridSizeMultSlider.size(80);

  // Label for gridSizeMultSlider
  let gridSizeMultLabel = createDiv("Grid Mult");
  gridSizeMultLabel.position(gridSizeMultSlider.x + gridSizeMultSlider.width + 20, gridSizeMultSlider.y);
  gridSizeMultLabel.style("font-family", "wanpaku-rera, sans-serif");
  gridSizeMultLabel.style("color", "white");

  tanCheckBox = createCheckbox("Tan", false);
   tanCheckBox.position( 10, 100)
    tanCheckBox.style("font-family", "wanpaku-rera, sans-serif")
    .style("color", "white");

  tanEllipseAnimation = createCheckbox("Tan Ellipse Animation", false);
   tanEllipseAnimation.position( 70, 100)
    .style("color", "white")
.style("font-family", "wanpaku-rera, sans-serif");

  sinCheckBox = createCheckbox("Sin", false);
   sinCheckBox.position( 10, 120)
    .style("color", "white")
    .style("font-family", "wanpaku-rera, sans-serif");

    sinEllipseAnimation = createCheckbox("Sin Ellipse Animation", false);
   sinEllipseAnimation.position( 70, 120)
    .style("color", "white")
    .style("font-family", "wanpaku-rera, sans-serif");


  check1 = createCheckbox("check 1", false);
   check1.position( 10, 140)
    .style("color", "white")
    .style("font-family", "wanpaku-rera, sans-serif");


  check2 = createCheckbox("check 2", false);
   check2.position( 10, 160)
    .style("color", "white")
    .style("font-family", "wanpaku-rera, sans-serif");


  check3 = createCheckbox("check 3", false);
   check3.position( 10, 180)
    .style("color", "white")
        .style("font-family", "wanpaku-rera, sans-serif");



  check4 = createCheckbox("check 4", false);
   check4.position( 10, 200)
    .style("color", "white")
        .style("font-family", "wanpaku-rera, sans-serif");

    rectCheckBox = createCheckbox("Display rectangles ", true);
   rectCheckBox.position( 90, 200)
    .style("color", "white")
        .style("font-family", "wanpaku-rera, sans-serif");

     rectSinCheckBox = createCheckbox("Affect rectangle position with sin", false);
   rectSinCheckBox.position( 10, 220)
    .style("color", "white")
    .style("font-family", "wanpaku-rera, sans-serif");

  
 bgColorPicker = createColorPicker("#000000");
   bgColorPicker.style("border","none")
  bgColorPicker.position(10, 280);
  createDiv("Background Color")
    .position(10, 260)

  
    .style("color", "white")
    .style("font-family", "wanpaku-rera, sans-serif")
    .style("border","none");

 
 // color pallete picker

createDiv("Color Palette")
  .position(10, 350)
  .style("color", "white")
  .style("font-family", "wanpaku-rera, sans-serif");

colorDiv = createDiv("")
  .position(10, 370)
  .style("padding", "10px")
  .style("background-color", "black");

    saveImageButton = createButton('Save Image');
  saveImageButton.mousePressed(saveImage);
  saveImageButton.position(10, 700);
  saveImageButton.style("background-color", "white")
  saveImageButton.style("border","none")
  saveImageButton.style("font-family", "wanpaku-rera, sans-serif");

colorDiv = createDiv("").position(10, 370).style("padding", "10px").style("background-color", "black");

for (let i = 0; i < 5; i++) {
  let colorInput = createColorPicker(i === 0 ? '#e53723' : i === 1 ? '#3d85d8' : i === 2 ? '#e66e95' : i === 3 ? '#3c8253' : '#e58136');
  colorInput.style("width", "3vw").style("height", "40px"); // Adjust size of color pickers
   colorInput.style("font-family", "wanpaku-rera, sans-serif")
   colorInput.style("border","1px solid black")
  colorInput.parent(colorDiv);
  colorInputs.push(colorInput);
}
  

  r = random(1);
}


function draw() {
  colors = [];

  colors = colorInputs.map(input => input.color());

      let s1 = translateSlider.value();
      let gridSize = gridSizeSlider.value();
      let s2 = gridSizeMultSlider.value();
 
  let baseNoise = frameCount * 0.002;
  r1 = map(noise(baseNoise), 0, 1, 0.3, 0.9);

  let nOffset = 0.1;

  // Declare interpolation variables here
  let interA, interB, interC, interD;

  // Set up noise-based from/to colors; the last iteration will set final values
  let nVal = baseNoise;
  let fromIndex = floor(noise(nVal) * colors.length);
  let toIndex = floor(noise(nVal + 10) * colors.length);
  let from = colors[fromIndex];
  let to = colors[toIndex];

  //tan animation var
  let e1 = 1;
    e1 -= 0.5;

//sin animation var
    let e2 = 1;
    e2 -= v2 * 2;

    v1 = abs(sin(frameCount * 0.01));
    v2 = abs(sin(frameCount * 0.02));
    v3 = abs(sin(frameCount * 0.03));
    v4 = abs(sin(frameCount * 0.04));
    v5 = abs(sin(frameCount * 0.05));

    interA = lerpColor(from, to, v1); 
    interB = lerpColor(from, to, v2);
    interC = lerpColor(from, to, v4);
    interD = lerpColor(from, to, v5);

  noStroke();
  // background("#140208");
    background(bgColorPicker.color());
  rectMode(CENTER);
  ellipseMode(CENTER);


  for (let x =  0; x < width; x += gridSize * s2) {
    for (let y = 0; y < height; y += gridSize * s2) {
     
      push();

      translate(x / s1,y / s1);
     
      stroke(interC)
      strokeWeight(r1 * gridSize / 4)
      fill(interD);
      

      if (rectCheckBox.checked()){
   rect(x, y, gridSize * r1, gridSize * r1);
      }
   

   if (rectSinCheckBox.checked()){ // effect rectangles with sin
 rect(x / sin(2), y / sin(2), gridSize * r1, gridSize * r1);
   }

    noStroke();
      fill(interB);




   if (tanCheckBox.checked()) {
         ellipse(x * tan (1), y * tan(1), gridSize * tan(1), gridSize * tan(1));
   }

if (sinCheckBox.checked()) {
         ellipse(x , y , gridSize * sin(1), gridSize * sin(1));
   }


   // animate circles checkbox


    if (tanEllipseAnimation.checked()) {     
   ellipse(x, y, gridSize * tan(1) * e1, gridSize * tan(1) * e1);
   }

   if (sinEllipseAnimation.checked()) {
         ellipse(x, y, gridSize * sin(1) * e2, gridSize * sin(1) * e2);
   }
      //  ellipse(x * sin (2), y * sin(2), gridSize, gridSize);

          // ellipse(x * tan(1), y * tan(1), gridSize, gridSize);
       

      //  boolean checkbox to include this

    //   if (r < 0.25 && x < width / 2){
    //        ellipse(x * sin (2), y / sin(2), gridSize, gridSize);
    //   } else if (r < 0.5 && x > width / 2 ){
    //            ellipse(x / sin (2), y * sin(2), gridSize, gridSize);
    //   } else if (r < 0.75 && y < height / 2){
    //     ellipse(x / sin (2) , y * sin(2),gridSize,gridSize);
    //     } else if (r < 1 && y > height / 2) {
    //  ellipse(x / sin (2) , y * sin(2),gridSize,gridSize);
        
    //     }


        // check boxes 

           if (check1.checked() && width < 2){
           ellipse(x * sin(2), y / sin(2), gridSize, gridSize);
      } else if (check2.checked()){
               ellipse(x / sin (2), y * sin(2), gridSize, gridSize);
      } else if (check3.checked()){
        ellipse(x / sin (2) , y * sin(2),gridSize,gridSize);
        } else if (check4.checked()) {
     ellipse(x / sin (2) , y * sin(2),gridSize,gridSize);
        
        }
 

      fill(interC);
      //  ellipse(x * sin (2), y * sin(2), gridSize / 2.5, gridSize / 2.5);
     
      stroke(interD);
      strokeWeight(2);
      //  line(x,y * 2,x,y,x,y);
      //  line(x,y,x * 2,y,x,y);
    

      pop();
    
    }
  }
}


function saveImage(){
  save("image.png");
}

// function lerp(colors,value){

//  return [
//         lerp(colors[0][0] + (colors[1][0] - colors[0][0]) * value
//         ,
//         colors[0][1] + (colors[1][1] - colors[0][1]) * value)
//         // colors[0][2] + (colors[1][2] - colors[0][2]) * value
//     ];

// }
