const paragraphs = {
  easy: [
    "The 9/11 attacks on September 11, 2001, were a series of coordinated terrorist attacks by al-Qaeda. Four planes were hijacked two crashed into New York's Twin Towers, one into the Pentagon, and another in Pennsylvania. The attacks killed nearly 3,000 people, reshaping global politics and security measures."
  ],
  medium: [
    "The Great Depression was a severe worldwide economic crisis that began in 1929 and lasted through the 1930s. It started with the stock market crash in the United States, leading to widespread unemployment, bank failures, and severe poverty. Factories closed, farms failed, and many people lost their savings. The global economy shrank, affecting countries around the world. Governments introduced measures to help recovery, but it took many years for economies to fully recover from the devastating effects."
  ],
  hard: [
    "Space is the vast, seemingly infinite expanse that exists beyond Earth's atmosphere. It is a realm of mystery and wonder, where planets, stars, galaxies, and other celestial bodies exist in a universe that stretches beyond human comprehension. Space exploration has fascinated humanity for centuries, leading to remarkable achievements like the first moon landing in 1969 and the ongoing exploration of Mars. Understanding space helps us grasp the origins of our universe, the nature of time and matter, and our place in the cosmos. The study of space has practical applications, such as advancements in satellite technology, which have revolutionized communication, weather forecasting, and navigation on Earth. However, space is also a challenging and hostile environment, with extreme temperatures, radiation, and vast distances between objects. The future of space exploration holds the promise of new discoveries, including the potential for finding life beyond Earth and understanding the fundamental laws of physics."
  ]
};

const typingText = document.querySelector(".typing-text p");
const inputField = document.querySelector(".wrapper .input-field");
const startBtn = document.querySelector(".start");
const tryAgainBtn = document.querySelector(".play-again");
const timeTag = document.querySelector(".time span b");
const mistakeTag = document.querySelector(".mistake span");
const wpmTag = document.querySelector(".wpm span");
const cpmTag = document.querySelector(".cpm span");
const difficultySelect = document.querySelector("#difficulty");
const scoreboard = document.querySelector(".scoreboard");

let timer,
  maxTime = 60,
  timeLeft = maxTime,
  charIndex = mistakes = isTyping = 0;
let currentDifficulty = "easy";

function loadParagraph(){
  const ranIndex = Math.floor(Math.random() * paragraphs[currentDifficulty].length);
  typingText.innerText = "";
  paragraphs[currentDifficulty][ranIndex].split("").forEach(char => {
    let span = `<span>${char}</span>`;
    typingText.innerHTML += span;
  });
  const characters = typingText.querySelectorAll("span");
  characters[charIndex].classList.add("active")
  document.addEventListener("keydown",() => inputField.focus())
  document.addEventListener("click",() => inputField.focus())
}

function resetGame() {
  loadParagraph();
  clearInterval(timer);
  timeLeft = maxTime;
  charIndex = mistakes = isTyping = 0; 
  inputField.value = "";
  timeTag.innerText = timeLeft;
  wpmTag.innerText = 0;
  mistakeTag.innerText = 0;
  cpmTag.innerText = 0;
  scoreboard.style.display = "none";
}

startBtn.addEventListener("click",() => {
  resetGame()
  inputField.focus()
})

difficultySelect.addEventListener("change",function(){
  currentDifficulty = this.value;
  resetGame()
})

function showScoreBoard(){
  scoreboard.style.display = "block";
  const accuracy = ((charIndex - mistakes) / charIndex) * 100;
  const scoreHTML = `
    <p>Words Per Minute (WPM): <span>${wpmTag.innerText}</span></p>
    <p>Characters Per Minute (WPM): <span>${cpmTag.innerText}</span></p>
<p>Blunders: <span>${mistakeTag.innerText}</span></p>
<p>Accuracy: <span>${accuracy.toFixed(2)}</span></p>
  `;
  scoreboard.innerHTML = scoreHTML
}

function showScoreBoardAndLabel(){
  showScoreBoard();
  const label = document.createElement("div");
  label.classList.add("label");
  label.innerHTML = `<p>Paragraph Completed!</p>`;
  document.body.appendChild(label);
  setTimeout(() => {
    resetGame()
    document.body.removeChild(label);
  },3000)
}

function initTyping() {
  let characters = typingText.querySelectorAll("span"); 
  let typedChar = inputField.value.charAt(charIndex);
  if(charIndex < characters.length && timeLeft > 0){
    if (!isTyping){
      timer = setInterval(initTimer, 1000);
      isTyping = true;
    }
    if(typedChar == null){
      if(charIndex > 0){
        charIndex--;
        if(characters[charIndex].classList.contains("incorrect")){
          mistakes--;
          
        }
        characters[charIndex].classList.remove("correct","incorrect")
      }
    } else {
      if(characters[charIndex].innerText == typedChar){
        characters[charIndex].classList.add("correct");
      } else {
        mistakes++;
        characters[charIndex].classList.add("incorrect");
      }
      charIndex++;
      }
    characters.forEach(span => {
      span.classList.remove("active");
    });
    characters[charIndex].classList.add("active");
    let wpm = Math.round(((charIndex - mistakes) / 5 ) / (maxTime - timeLeft) * 60)
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
    wpmTag.innerText = wpm;
mistakeTag.innerText = mistakes;
    cpmTag.innerText = charIndex - mistakes;
    if (charIndex === characters.length || timeLeft === 0){
      clearInterval(timer);
      inputField.value = "";
      showScoreBoardAndLabel()
    }
  } else {
    clearInterval(timer);
    inputField.value = "";
    showScoreBoard()
  }
}

function initTimer() {
  if (timeLeft > 0){
    timeLeft--;
    timeTag.innerText = timeLeft;
    let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60)
    wpmTag.innerText = wpm;
  } else {
    clearInterval(timer)
    showScoreBoardAndLabel()
  }
}

loadParagraph();
inputField.addEventListener("input",initTyping)
tryAgainBtn.addEventListener("click",resetGame)