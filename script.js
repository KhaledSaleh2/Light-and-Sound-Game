// Global variables
let pattern = [2, 2, 4, 3, 2, 1, 2, 4]; // fixed pattern of buttons
let progress = 0; // tracks which button player is on
let gamePlaying = false; 
let tonePlaying = false;
let volume = 0.5;
let guessCounter = 0; // counts how many guesses the player has made

// constants
const clueHoldTime = 1000; // how long each clue plays, one second
const cluePauseTime = 333; // how long to pause in between clues, 0.333 seconds
const nextClueWaitTime = 1000; // how long to wait before starting playback of the clue sequence, one second

// store the start and stop buttons
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");



// Add your functions here

// function called when start button is pressed
function startGame() {
  // initalize game variables
  progress = 0;
  gamePlaying = true;

  // swap the Start and Stop buttons
  startBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
  // start playing the clue sequence
  playClueSequence();
}

// function called when stop button is pressed and when game is over
function stopGame() {
  gamePlaying = false;
  // swap the Stop and Start buttons
  stopBtn.classList.add("hidden");
  startBtn.classList.remove("hidden");
}

// function used so each button lights up when computer plays it
// param btn: button to be lit up
function lightButton(btn) {
  document.getElementById("button"+btn).classList.add("lit");
}

// function used so computer can stop lighting a particular button
// param btn: button to be unlit
function clearButton(btn) {
  document.getElementById("button"+btn).classList.remove("lit");
}

// function used repeatedly so computer can play the pattern
// param btn: individual button to be played as a clue
function playSingleClue(btn) {
  if(gamePlaying) {
    lightButton(btn);
    playTone(btn,clueHoldTime); // plays tone of button for clueHoldTime
    setTimeout(clearButton,clueHoldTime,btn); // calls clearButton after clueHoldTime with btn as parameter
  }
}
// driver function for playing the sequence
function playClueSequence() {
  context.resume()
  let delay = nextClueWaitTime; // set delay to initial wait time
  guessCounter = 0; // sets to 0 because user must enter pattern correctly from the start each time
  for(let i=0;i<=progress;i++) { // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime
    delay += cluePauseTime;
  }
}
// called when user either presses wrong button or presses stop button
function loseGame() {
  stopGame()
  alert("Game Over! You lost.");
}
// called when player wins game
function winGame() {
  stopGame()
  alert("Congratulations! You won!");
}
// function called when user makes a guess
// param btn: the button pressed by user
function guess(btn) {
  console.log("user guessed: " + btn);
  // ignores guess if game is not started
  if(!gamePlaying) {
    return;
  }
  
  // game logic
  if(pattern[guessCounter] == btn) {
    // guess is correct, game keeps going, check the next guess
    console.log("correct guess");
    guessCounter++;
    if (guessCounter == pattern.length) {
      // pattern is complete, game is won
      winGame()
    }
    else if (guessCounter == progress + 1){
      // pattern was correct, add next clue
      progress++;
      playClueSequence()
    }
  }
  else {
    // wrong guess, game is lost
    loseGame()
  }
}








// Sound Synthesis Functions for Steps 6-8
// You do not need to edit the below code
const freqMap = {
  1: (Math.random() * 100) + 100, // random number between 100-200
  2: (Math.random() * 100) + 200, // random number between 200-300
  3: (Math.random() * 100) + 300, // random number between 300-400
  4: (Math.random() * 100) + 400 // random number between 400-500
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
let AudioContext = window.AudioContext || window.webkitAudioContext 
let context = new AudioContext()
let o = context.createOscillator()
let g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)
