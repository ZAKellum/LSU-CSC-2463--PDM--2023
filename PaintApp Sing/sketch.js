var colors = ['red', 'orange', 'yellow', 'cyan', 'blue', 'magenta', 'brown', 'white', 'black'];
var selectedColorInedx = 0;
var palette_cell_size = 30;
var x, y;
var drawing = false;

let pitch = 600

let osc = new Tone.AMOscillator(pitch, 'sine', 'sine').start();
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
}

function draw() {
  noStroke();
  for (let i = 0; i < colors.length; i++) {
    fill(colors[i]);
    rect(0, i * palette_cell_size, palette_cell_size, palette_cell_size);
  }
  stroke(colors[selectedColorInedx]);
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < palette_cell_size && mouseY >= 0 && mouseY < (colors.length * palette_cell_size)) {
    selectedColorInedx = floor(mouseY / palette_cell_size);
    stroke(colors[selectedColorInedx]);
    drawing = false;
  } else {
    x = mouseX;
    y = mouseY;
    drawing = true;
    // create a new synth instance and trigger a sound on it
    let synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease("G4", "8n");
  }
}

function mouseDragged() {
  if (drawing) {
    line(x, y, mouseX, mouseY);
    x = mouseX;
    y = mouseY;
  }
}
