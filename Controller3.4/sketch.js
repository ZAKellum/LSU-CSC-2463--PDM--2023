let colors = ['red', 'orange', 'yellow', 'cyan', 'blue', 'magenta', 'brown', 'white', 'black'];
let selectedColorIndex = 0;
let palette_cell_size = 30;
let x, y;
let drawing = false;

let connectButton;
let port;
let writer, reader;
let joySwitch;
let joyX, joyY;
let buttonState = 0;
let sensorData = {};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

let osc = new Tone.AMOscillator(600, 'sine', 'sine').toDestination();
let gain = new Tone.Gain().toDestination();
let pan = new Tone.Panner().connect(gain);
let ampEnv = new Tone.AmplitudeEnvelope({
  attack: 0.1,
  decay: 0.5,
  sustain: 1.0,
  release: 2.0
}).connect(pan);
osc.connect(ampEnv);

let noise = new Tone.Noise('pink').start();
let noiseEnv = new Tone.AmplitudeEnvelope({
  attack: 0.1,
  decay: 1.5,
  sustain: 0.5,
  release: 1.0
}).connect(gain);

let noiseFilter = new Tone.Filter(800, "lowpass").connect(noiseEnv);
noise.connect(noiseFilter)

let reverb = new Tone.Reverb({
  decay: 8,
  wet: 0.7
}).connect(gain);




function setup() {
  createCanvas(800, 500);
  strokeWeight(10);
  background(250);
  
  if ("serial" in navigator) {
    // The Web Serial API is supported
    connectButton = createButton("Connect");
    connectButton.position(725, 10);
    connectButton.mousePressed(connect);
  }
  
  // Select color with button press
  buttonStateCheck(selectColor);
}

function draw() {
  background(220);
  noStroke();
  
  // Draw color palette
  for (let i = 0; i < colors.length; i++) {
    fill(colors[i]);
    rect(0, i * palette_cell_size, palette_cell_size, palette_cell_size);
  }
  
  // Draw selected color stroke
  stroke(colors[selectedColorIndex]);
  
  // Update joystick values
  joySwitch = sensorData.Switch;
  joyX = sensorData.Xaxis;
  joyY = sensorData.Yaxis;
  buttonStateValue = sensorData.Button;
  
  if (reader) {
    serialRead();
  }
  
  // Handle button press to draw
  if (buttonStateValue === 1 && drawing) {
    paint();
  }
  
  push();
  noFill();
  circle(joyX, joyY, 10);
  pop();
  
  text("Joystick Switch: " + joySwitch, 10, 550);
  text("Joystick X-axis: " + joyX, 10, 575);
  text("Joystick Y-axis: " + joyY, 10, 600);
}

function selectColor() {
  const colorIndex = Math.floor(joyX / palette_cell_size);
  if (colorIndex >= 0 && colorIndex < colors.length) {
    selectedColorIndex = colorIndex;
  }
}

function buttonStateCheck(callback) {
  if (buttonState === 1) {
    callback();
  }
}

function mousePressed() {
  if (joyX >= 0 && joyX < palette_cell_size && joyY >= 0 && joyY < (colors.length * palette_cell_size)) {
    selectedColorIndex = floor(joyY / palette_cell_size);
    stroke(colors[selectedColorIndex]);
    drawing = false;
  } else {
    x = joyX;
    y = joyY;
    drawing = true;
  }
}

function mouseDragged() {
  if (drawing) {
    line(x, y, joyX, joyY);
    x = joyX;
    y = joyY;
  }
}

function paint() {
  if (drawing) {
    point(x, y);
    x = joyX;
    y = joyY;
  }
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


 await port.open({ baudRate: 9600 });


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


function mousePressed() {
    if (joyX >= 0 && joyX < palette_cell_size && joyY >= 0 && joyY < (colors.length * palette_cell_size)) {
        selectedColorIndex = floor(mouseY / palette_cell_size);
        stroke(colors[selectedColorIndex]);
        drawing = false;
    }
    else {
        x = joyX;
        y = joyY;
        drawing = true;
    }
}

function mouseDragged() {
    if (drawing) {
        line(x, y, joyX, joyY);
        x = joyX;
        y = joyY;
    }
}
