// script.js

const timer = document.querySelector(".timer");
const title = document.querySelector(".title");
const startBtn = document.querySelector(".startBtn");
const pauseBtn = document.querySelector(".pauseBtn");
const resumeBtn = document.querySelector(".resumeBtn");
const resetBtn = document.querySelector(".resetBtn");
const pomoCountDisplay = document.querySelector(".pomoCountDisplay");

// Making Variable for work and break
const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let timerID = null;
let oneRoundCompleted = false;
let totalCount = 0;
let paused = false;

// Ensure localStorage is initialized
if (!localStorage.getItem("pomoCounts")) {
  localStorage.setItem("pomoCounts", "0");
}

// Function to update title
const updateTitle = (msg) => {
  title.textContent = msg;
};

const saveLocalCounts = () => {
  let counts = JSON.parse(localStorage.getItem("pomoCounts") || "0");
  counts++;
  localStorage.setItem("pomoCounts", JSON.stringify(counts));
};

const countDown = (time) => {
  return () => {
    if (time < 0) {
      stopTimer();
      if (!oneRoundCompleted) {
        oneRoundCompleted = true;
        updateTitle("It's Break Time!");
        startTimer(BREAK_TIME);
      } else {
        updateTitle("Completed 1 Round of Pomodoro Technique");
        setTimeout(() => updateTitle("Start Timer Again!"), 2000);
        totalCount++;
        saveLocalCounts();
        showPomoCounts();
        oneRoundCompleted = false;
      }
      return; 
    }
    let mins = Math.floor(time / 60).toString().padStart(2, "0");
    let secs = Math.floor(time % 60).toString().padStart(2, "0");
    timer.textContent = `${mins}:${secs}`;
    time--;
  };
};

// Function to start timer
const startTimer = (startTime) => {
  if (timerID !== null) stopTimer();
  timerID = setInterval(countDown(startTime), 1000);
};

// Start button event listener
startBtn.addEventListener("click", () => {
  startTimer(WORK_TIME);
  updateTitle("It's Work Time!");
  timer.classList.add("ticking");
});

// Convert time string "MM:SS" to seconds
const getTimeInSecond = (timeString) => {
  const [minutes, seconds] = timeString.split(":");
  return parseInt(minutes) * 60 + parseInt(seconds);
};

const stopTimer = () => {
  clearInterval(timerID);
  timerID = null;
  timer.classList.remove("ticking");
};

const showPomoCounts = () => {
  let counts = JSON.parse(localStorage.getItem("pomoCounts") || "0");
  if (counts > 0) {
    pomoCountDisplay.style.display = "flex";
  }
  pomoCountDisplay.firstElementChild.textContent = counts;
};
showPomoCounts();

pauseBtn.addEventListener("click", () => {
  stopTimer();
  paused = true;
  updateTitle("Timer Paused");
});

resumeBtn.addEventListener("click", () => {
  if (paused) {
    const currentTime = getTimeInSecond(timer.textContent);
    startTimer(currentTime);
    timer.classList.add("ticking");
    paused = false;
    !oneRoundCompleted
      ? updateTitle("It's Work Time")
      : updateTitle("It's Break Time");
  }
});

resetBtn.addEventListener("click", () => {
  stopTimer();
  paused = false;
  oneRoundCompleted = false;
  let mins = Math.floor(WORK_TIME / 60).toString().padStart(2, "0");
  let secs = Math.floor(WORK_TIME % 60).toString().padStart(2, "0");
  timer.textContent = `${mins}:${secs}`;
  updateTitle("Click Start for Work Time");
});