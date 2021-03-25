// global constants
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

// global variable
var pattern = [];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.1;  //must be between 0.0 and 1.0
var guessCounter = 0;

var buttons = [];      
var greenButton = document.getElementById("button1");
var blueButton = document.getElementById("button2");
var redButton = document.getElementById("button3");
var yellowButton = document.getElementById("button4");

// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()


function initialize() //Page Initialization
{
  buttons.push(greenButton,blueButton,redButton,yellowButton);
  // Init Sound Synthesizer
  g.connect(context.destination)
  g.gain.setValueAtTime(0,context.currentTime)
  o.connect(g)
  o.start(0)
}

function startGame()
{
  progress = 0;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  generatePattern();
  playClueSequence();
}

function stopGame()
{
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

function lightButton(btn){
  buttons[btn].classList.add("lit");
}
function clearButton(btn){
  buttons[btn].classList.remove("lit");
}

function generatePattern()
{
  let num = getRandomInteger(0, 3);
  pattern.push(num);
}

function playSingleClue(btn){
  if(gamePlaying){
    let holdTime = clueHoldTime*Math.pow(0.75, progress);
    lightButton(btn);
    playTone(btn+1, holdTime)
    setTimeout(clearButton,holdTime,btn);
  }
}

function playClueSequence(){
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime*Math.pow(0.75, progress);
    delay += cluePauseTime;
  }
}

function loseGame(){
  pattern = [];
  guessCounter = 0;
  progress = 0;
  stopGame();
  alert("Game Over. You lost.");
}
function winGame(){
  stopGame();
  alert("Game Over. You won!");
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  if(btn != pattern[guessCounter])
  {
    loseGame();
    return;
  }
  guessCounter++;
  if(guessCounter == pattern.length)
  {
    if(pattern.length == 8)
    {
      winGame();
    }
    console.log("user: " + guessCounter + "    pattern:" + pattern.length);
    generatePattern();
    progress ++;
    guessCounter = 0;
    playClueSequence();
  }
}

function getRandomInteger(lower, upper)
{
	if(lower >= upper)
	{
		return null;
	}
	var multiplier = upper-(lower - 1);
	var rnd = parseInt(Math.random()* multiplier);
	rnd += lower;
	
	return rnd;
}
