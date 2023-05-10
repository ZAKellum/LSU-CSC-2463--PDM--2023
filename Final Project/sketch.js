let joySwitch, joyX, joyY;
let sensorData = {};
let port, writer, reader;

let sound, gain, osc, squareOsc;
let buttonState = false;

let hue, saturation, brightness;
let currentColor, nextColor;
let lerpAmt = 0.05;




const synth = new Tone.Synth().toDestination();
const envelope = {
  attack: 0.1,
  decay: 0.1,
  sustain: 0.5,
  release: 0.5
};

synth.envelope = envelope;
synth.volume.value = -12;

let button;
let speedSlider;

function setup() {
  createCanvas(800, 500);
  background(250);
  frameRate(100);

  speedSlider = createSlider(0, 10, 5);
  speedSlider.position(525, 300);
  button = createButton('Toggle Rose');
  button.position(550, 325);
  button.mousePressed(toggleRose);


  
    
  startColor = color(255,255,255);
  newColor = color(random(255),random(255),random(255));
  amt = 0;


  synth.toDestination();

  targetColor = color(random(255), random(255), random(255));
  currentColor = color(0, 0, 0);
  colorAmount = 0;


 if ("serial" in navigator) {
   // The Web Serial API is supported
   connectButton = createButton("connect");
   connectButton.position(725, 10);
   connectButton.mousePressed(connect);
 }
}



let n = 5;
let d = 4;
let angle = 0;
let angleStep = 0.1;
let radius = 100;
let xPos = 600;
let yPos = 150;

let roseVisible = false;

function drawRose() {
  push();
  translate(xPos, yPos);
  rotate(angle);
  noFill();
  stroke(currentColor);
  strokeWeight(2);
  beginShape();
  for (let a = 0; a < TWO_PI * d; a += 0.01) {
    let r = radius * cos(n/d * a);
    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x, y);
  }
  endShape(CLOSE);
  pop();
  angle += angleStep;
  if (colorAmount >= 1) {
    currentColor = targetColor;
    targetColor = color(random(255), random(255), random(255));
    colorAmount = 0;
  } else {
    colorAmount += 0.01;
    currentColor = lerpColor(currentColor, targetColor, colorAmount);
  }
}

function toggleRose() {
  roseVisible = !roseVisible; // Toggle the visibility of the rose
}

let isUpdatingOscillator = false;

function draw() {
  background(50); 
  
  angleStep = speedSlider.value() / 50;
  if (roseVisible) {
    drawRose();
  }

  

  push();
  stroke(200);
  strokeWeight(4);
  
  const rectX = 168;
  const rectY = 90;
  const rectWidth = 271;
  const rectHeight = 275;
  const cornerRadius = 10;
  
  const buttonState = sensorData.Button;
  const joyX = sensorData.Xaxis;
  const joyY = sensorData.Yaxis;

 
  if (sensorData.Button == 1){
    fill(lerpColor(startColor, newColor, amt));
    amt += 0.01;
    if(amt >= 1){
       amt = 0.0;
       startColor = newColor;
       newColor = color(random(255),random(255),random(255));
      }
    }


    if (sensorData.Button == 1) {
      if (!isUpdatingOscillator) {
        const updateOscillator = () => {
          detune = map(joyY, 0, 255, -100, 100); 
          frequency = map(joyX, 0, 255, 220, 880); 
          synth.set({ detune: detune, frequency: frequency });
          if (synth.triggered && isUpdatingOscillator) {
            requestAnimationFrame(updateOscillator);
          }
        };
      
        synth.triggerAttack(20);
        synth.triggered = true;
        isUpdatingOscillator = true;
        updateOscillator();
      } else {
        detune = map(joyY, 0, 255, -100, 100); 
        frequency = map(joyX, 0, 255, 220, 880); 
        synth.set({ detune: detune, frequency: frequency });
      }
    } else if (sensorData.Button == 0 && synth.triggered) {
      synth.triggerRelease();
      synth.triggered = false;
      isUpdatingOscillator = false;
    }
    
    


  rect(rectX, rectY, rectWidth, rectHeight, cornerRadius);
  pop();

  if (reader) {
    serialRead();
  }

  joySwitch = sensorData.Switch;
 
  push();
  noFill();
  circle(joyX + width / 4.5, joyY + height / 5, 10);
  pop();
 
  text("Joystick Switch: " + joySwitch, 10, 550);
  text("Joystick X-axis: " + joyX, 10, 575);
  text("Joystick Y-axis: " + joyY, 10, 600);
}


async function serialRead() {
 while (true) {
   const { value, done } = await reader.read();
   if (done) {
     reader.releaseLock();
break;
   }
  console.log(value);
   sensorData = JSON.parse(value);
 }
}


async function connect() {
 port = await navigator.serial.requestPort();
 await port.open({ baudRate: 10000 });
 writer = port.writable.getWriter();
 reader = port.readable
   .pipeThrough(new TextDecoderStream())
   .pipeThrough(new TransformStream(new LineBreakTransformer()))
   .getReader();
}


class LineBreakTransformer {
 constructor() {
   // A container for holding stream data until a new line.
   this.chunks = "";
 }

 transform(chunk, controller) {
   // Append new chunks to existing chunks.
   this.chunks += chunk;
   // For each line breaks in chunks, send the parsed lines out.
   const lines = this.chunks.split("\n");
   this.chunks = lines.pop();
   lines.forEach((line) => controller.enqueue(line));
 }

 flush(controller) {
   // When the stream is closed, flush any remaining chunks out.
   controller.enqueue(this.chunks);
 }
}