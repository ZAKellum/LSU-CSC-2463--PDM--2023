let initTone = true;
let pitch = 600

// Set up Tone
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


let delay = new Tone.FeedbackDelay("8n", 0.5).connect(reverb); 
let distortion = new Tone.Distortion(0.4).connect(delay);

let crackle = new Tone.Noise('brown').start();
let crackleEnv = new Tone.AmplitudeEnvelope({
  attack: 0.1,
  decay: 0.2,
  sustain: 1.0,
  release: 0.8
}).connect(gain);
let crackleFilter = new Tone.Filter(2000, 'highpass').connect(crackleEnv);
crackle.connect(crackleFilter);


let zap = new Tone.Synth().toDestination();
let zapEnv = new Tone.AmplitudeEnvelope({
  attack: 0.1,
  decay: 0.2,
  sustain: 0.2,
  release: 0.1
}).connect(zap.volume);


let tornado;
let tornadoDisplayed = false;
let tornadoDisplayTime = 0;
const TORNADO_DISPLAY_DURATION = 2000; // 2 seconds in milliseconds

function preload() {
  tornado = loadImage("Assets/tornado.jpg");
  img.hide();
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  if ((frameCount % 60) === 0) {
    pitch = random(300, 1000) + (Math.random() * 100);
  }

  text('click space to initialize audio!', 125, 100);

  if (tornadoDisplayed && millis() - tornadoDisplayTime > TORNADO_DISPLAY_DURATION) {
    tornadoDisplayed = false;
  }

  if (tornadoDisplayed) {
    image(tornado, 0, 0, width, height);
  }
}

function keyPressed() {
  if (keyCode === 32) {
     zap.triggerAttackRelease('C4', '16n');
  }
}

function mousePressed() {
  console.log('pressed');

  if (mouseY > 200) {
    noiseEnv.triggerAttackRelease(5.0);
    tornadoDisplayed = true;
    tornadoDisplayTime = millis();
  }
}
