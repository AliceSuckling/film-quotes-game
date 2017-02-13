import { keypress } from "keypress.js";
import { combo } from "./helpers";
import levels from "./levels";
import sound from "./sound";

const listener = new keypress.Listener();

function shuffle(array) {
  // Make a copy
  array = [...array];
  let currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

const shuffledLevels = shuffle(levels);

const image = document.querySelector(".Background__image");
const messageBox = document.getElementById("message");

const loadLevel = ({
  name,
  src,
  winnerAlert,
  message,
  color,
  size,
  soundtrack,
  winnerGif,
  animationStyle,
  font = ""
}) => {
  //chagne font depending on the current level
  messageBox.style.fontFamily = font;
  //change the message depending on current level
  messageBox.innerHTML = message;
  //background image should be the image of the level
  image.style.backgroundImage = `url("${src}")`;
  //play the sound file on the current level
  sound(soundtrack);
  //font color is dependant on level preferance
  messageBox.style.color = color;
  //font size is dependant on level preference
  messageBox.style.fontSize = size;
  //animation style is dependant on level preferance
  messageBox.style.animation = `url("${animationStyle}")`;
  //listen for typed answer
  return new Promise(resolve => {
    listener.sequence_combo(combo(name), function() {
      //if correct the message changes
      messageBox.innerHTML = winnerAlert;
      image.style.backgroundImage = `url("${winnerGif}")`;
      // Clear this listener
      listener.reset();
      //allow a little delay after success message
      setTimeout(resolve, 4000);
    });
  });
};

const playGame = async () => {
  for (const index of shuffledLevels.keys()) {
    await loadLevel(shuffledLevels[index]);
  }
  messageBox.innerHTML = "";
  image.style.backgroundImage = "url(/images/winner.gif)";
};


export default playGame;




