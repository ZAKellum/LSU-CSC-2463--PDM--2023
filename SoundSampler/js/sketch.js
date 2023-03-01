//
// Zavien Kellum
//



//let sound1 = new Tone.Player("sounds/chicken.wav");

let sounds = new Tone.Players({

  "Bass": "sounds/BassGuitar.wav",
  "Dubstep": "sounds/Dubstep.wav",
  "Guitar": "sounds/GuitarSound.wav",
  "Percussion": "sounds/Percussion.wav",
  "Piano": "sounds/PianoSound.mp3"


})

const delay = new Tone.FeedbackDelay("8n", 0.5);

let soundNames = ["Bass", "Dubstep", "Guitar", "Percussion", "Piano"];
let buttons = [];

let dSlider;
let fSlider;

//let button1, button2, button3;

function setup() {
  createCanvas(400, 400);
  sounds.connect(delay);
  delay.toDestination();

  soundNames.forEach((word, index) => {
    buttons[index] = createButton(word);
    buttons[index].position(index, index*50);
    buttons[index].mousePressed( () => buttonSound(word))
  })

  dSlider = createSlider(0., 1., 0.5, 0.05);
  dSlider.mouseReleased( () => {
    delay.delayTime.value = dSlider.value();
  })

  fSlider = createSlider(0., 1., 0.5, 0.05);
  fSlider.mouseReleased( () => {
    delay.feedback.value = fSlider.value();
  })

  rSlider = createSlider(0., 1., 0.5, 0.05);
  rSlider.mouseReleased( () => {
    delay.wet.value = rSlider.value();
  })


}

function draw() {
  background(255, 100, 40);
  text('Press the buttons for sound', 0, 250)
  text('Sound Effects', 160, 325)
  text('Delay', 50, 380)
  text('Feedback', 175, 380)
  text('Wet', 320, 380)
}

function buttonSound(whichSound) {
    sounds.player(whichSound).start();
}