
// Classifier Variable
let classifier;
let video;
let label = 'waiting';

let pointsComputer = 0;
let pointsPlayer = 0;

let counter = 0;

let currentMove = '';
let computerMove = '';

const moves = ['rock', 'paper', 'scissors'];

let scoreChange = '';

const emoji = {
  rock: '✊',
  paper: '🤚',
  scissors: '✌️',
  computer: '🤖',
  player: '👨‍💻',
};

// Load the model first
function preload() {
  classifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/ULjPg7lfA/model.json');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create the video
  video = createCapture(VIDEO);
  video.size(1280, 720);
  video.hide();

  // Start classifying
  classifyVideo();

  textAlign(CENTER, CENTER);
}

function draw() {
  background(0);
  imageMode(CENTER);
  image(ml5.flipImage(video), width / 2, height / 2, height * video.width / video.height, height);
  fill(0, 0, 0, 190);
  rect(0, 0, width, height);

  if (currentMove == label) {
    counter += 1;
  } else if (computerMove == '') {
    counter = 0;
    currentMove = label;
  }

  fill(255, 0, 255);
  if (currentMove != 'neutral' && currentMove != '') rect(0, 0, map(counter, 0, 10, 0, width), 12);
  fill(255);

  if (computerMove != '') {
    textSize(48);
    text(`${emoji.computer}: ${emoji[computerMove]}`, width / 4, height / 8);
    noLoop();
    setTimeout(() => {
      computerMove = '';
      counter = 0;
      scoreChange = '';
      loop();
    }, 3000);
  } else if (counter >= 10 && currentMove != 'neutral' && currentMove != '' && computerMove == '') {
    computerMove = random(moves);

    if ((computerMove == 'rock' && currentMove == 'paper') ||
      (computerMove == 'paper' && currentMove == 'scissors') ||
      (computerMove == 'scissors' && currentMove == 'rock')) { // win
      scoreChange = `${emoji.player}+1`;
      pointsPlayer += 1;
    } else if (computerMove == currentMove) { // tie
      scoreChange = '±0';
    } else { // loose
      scoreChange = `${emoji.computer}+1`;
      pointsComputer += 1;
    }
  } else if (computerMove == '') {
    classifyVideo();
  }

  if (['rock', 'paper', 'scissors'].includes(currentMove)) {
    textSize(256);
    text(emoji[currentMove], width / 2, height / 2);
  } else if (currentMove == 'neutral') {
    textSize(64);
    text('Ready', width / 2, height / 2);
  } else {
    textSize(64);
    text('Loading...', width / 2, height / 2);
    noLoop();
  }

  textSize(32);
  text(`${emoji.computer} ${pointsComputer} : ${pointsPlayer} ${emoji.player}`, width / 2, height - 16);
  if (scoreChange != '') {
    textSize(24);

    if (scoreChange.includes(emoji.player)) fill(0, 255, 0);
    else if (scoreChange.includes(emoji.computer)) fill(255, 0, 0);
    else fill(255);
    text(scoreChange, width / 2, height - 60);
  }
}

function classifyVideo() {
  classifier.classify(ml5.flipImage(video), gotResult);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  label = results[0].label.toLowerCase();
  loop();
}