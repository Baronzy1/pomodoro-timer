let workTime = 25 * 60;
let breakTime = 5 * 60;
let longBreakTime = 15 * 60;
let timeLeft = workTime;
let timerId = null;
let isRunning = false;
let isWorkSession = true;
let sessionCount = 1;

const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

circle.setAttribute('stroke-dasharray', circumference);
updateDash();

function updateDash() {
  const offset = circumference - (timeLeft / (isWorkSession ? workTime : breakTime)) * circumference;
  circle.style.strokeDashoffset = offset;
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  document.getElementById('timer').textContent = `${minutes}:${seconds}`;
  document.getElementById('session-type').textContent =
    isWorkSession ? "Work Session 🧠" : "Break Time ☕";
  document.getElementById('session-count').textContent = `Session ${sessionCount} of 4`;
  updateDash();
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timerId = setInterval(() => {
      timeLeft--;
      updateDisplay();
      if (timeLeft <= 0) {
        clearInterval(timerId);
        isRunning = false;
        playAlert();
        nextSession();
        setTimeout(startTimer, 1000);
      }
    }, 1000);
  }
}

function pauseTimer() {
  clearInterval(timerId);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timerId);
  isRunning = false;
  isWorkSession = true;
  sessionCount = 1;
  timeLeft = workTime;
  updateDisplay();
}

function playAlert() {
  document.getElementById("alarm-sound").play();
}

function nextSession() {
  if (isWorkSession) {
    if (sessionCount === 4) {
      timeLeft = longBreakTime;
      isWorkSession = false;
    } else {
      timeLeft = breakTime;
      isWorkSession = false;
      sessionCount++;
    }
  } else {
    timeLeft = workTime;
    isWorkSession = true;
  }
  updateDisplay();
}

document.getElementById("workTime").addEventListener("change", () => {
  workTime = parseInt(document.getElementById("workTime").value) * 60;
  if (isWorkSession) timeLeft = workTime;
  updateDisplay();
});

document.getElementById("breakTime").addEventListener("change", () => {
  breakTime = parseInt(document.getElementById("breakTime").value) * 60;
  if (!isWorkSession && sessionCount < 4) timeLeft = breakTime;
  updateDisplay();
});

// Dark Mode Toggle
document.getElementById("darkModeToggle").addEventListener("change", function () {
  document.body.classList.toggle("dark-mode");
});

// Load Settings from localStorage
window.addEventListener("load", () => {
  const savedWork = localStorage.getItem("workTime");
  const savedBreak = localStorage.getItem("breakTime");
  const savedDark = localStorage.getItem("darkMode");

  if (savedWork) {
    workTime = parseInt(savedWork);
    document.getElementById("workTime").value = workTime / 60;
  }

  if (savedBreak) {
    breakTime = parseInt(savedBreak);
    document.getElementById("breakTime").value = breakTime / 60;
  }

  if (savedDark === "true") {
    document.body.classList.add("dark-mode");
    document.getElementById("darkModeToggle").checked = true;
  }

  timeLeft = workTime;
  updateDisplay();
});

// Save Settings
document.getElementById("workTime").addEventListener("change", () => {
  localStorage.setItem("workTime", workTime);
});
document.getElementById("breakTime").addEventListener("change", () => {
  localStorage.setItem("breakTime", breakTime);
});
document.getElementById("darkModeToggle").addEventListener("change", (e) => {
  localStorage.setItem("darkMode", e.target.checked);
});
