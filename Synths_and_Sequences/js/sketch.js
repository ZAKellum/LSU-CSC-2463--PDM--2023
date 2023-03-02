let slider;

//const synth = new Tone.PluckSynth();
const drum = new Tone.MembraneSynth();
const metal = new Tone.MetalSynth({
	"frequency"  : 45 ,
	"envelope"  : {
		"attack"  : 0.001 ,
		"decay"  : 0.4 ,
		"release"  : 0.2
	}  ,
	"harmonicity"  : 8.5 ,
	"modulationIndex"  : 40 ,
	"resonance"  : 300 ,
	"octaves"  : 1.5
});
const reverb = new Tone.JCReverb(0.4);
//synth.connect(reverb);
drum.connect(reverb);
metal.connect(reverb);

const osc = new Tone.OmniOscillator("C#4", "pwm").start();

const ampEnv = new Tone.AmplitudeEnvelope({
  attack: 0.5,
  decay: 0.6,
  sustain: 0.2,
  release: 0.5
})

let notes = {
  'a': 'G4',
  's': 'A4',
  'd': 'B4',
  'f': 'C4',
  'g': 'D4',
  'h': 'E4',
  'j': 'F4',
  'k': 'G5'
}

function setup() {
  createCanvas(400, 400);

  slider = new Nexus.Slider("#slider");
  reverb.toDestination();

  drum.release = 2;
  drum.resonance = 0.98;

 

  slider.on('change', (v) =>  {
    reverb.roomSize.value = v;
  }); 

  osc.connect(ampEnv);
  ampEnv.connect(reverb);
}

function draw() {
  background(220);
}

function keyPressed() {
  let toPlay = notes[key];
  console.log(toPlay);

  osc.frequency.value = toPlay;
  ampEnv.triggerAttackRelease('8n');

  //synth.triggerAttackRelease(toPlay, 0.5);
  //metal.triggerAttackRelease(toPlay, +0.5);
  drum.triggerAttackRelease(toPlay, +0.5);
}