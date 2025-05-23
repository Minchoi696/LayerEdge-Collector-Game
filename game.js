const gameArea = document.getElementById("gameArea");
const roleStatus = document.getElementById("roleStatus");
const popup = document.getElementById("popup");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const levelDisplay = document.getElementById("levelDisplay");
const timerBar = document.getElementById("timerBar");
const endMenu = document.getElementById("endMenu");
const finalScore = document.getElementById("finalScore");
const shareBtn = document.getElementById("shareBtn");
const menu = document.getElementById("menu");
const bgMusic = document.getElementById("bgMusic");

let score = 0;
let level = 1;
let timer = 50; // Starting time for level 1
let pointsForNextLevel = 3000; // Points required for the next level
let gameRunning = false;
let spawnInterval;
let timerInterval;

// Icons and points
const icons = [
  { emoji: "🤣", points: 500, name: "LayerEdgeMemer" },
  { emoji: "💻", points: 1000, name: "LayerEdgeDev" },
  { emoji: "🏆", points: 800, name: "LayerEdgeChamp" },
  { emoji: "📣", points: 1500, name: "LayerEdgeCommander" },
  { emoji: "🕷️", points: -9999, name: "Syblis" } // Bad icon
];

// Start or restart the game
function startGame() {
  // Disable the menu and start the game
  menu.style.display = "none";
  score = 0;
  level = 1;
  timer = 50;
  pointsForNextLevel = 3000;
  gameRunning = true;
  gameArea.innerHTML = ""; // Clear old icons
  roleStatus.textContent = "Role: 👶 Newbie";
  levelDisplay.textContent = `Level: ${level}`;
  updateTimer();
  startTimer();
  spawnInterval = setInterval(spawnIcon, 1000);
  bgMusic.play(); // Play background music
  endMenu.style.display = "none"; // Hide the end menu
  restartBtn.style.display = "none"; // Hide restart button during the game
}

// End the game
function endGame(won = false) {
  gameRunning = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  bgMusic.pause(); // Stop music when the game ends
  finalScore.textContent = score;
  endMenu.style.display = "block"; // Show end menu
  restartBtn.style.display = "inline-block"; // Show restart button
}

// Timer update
function updateTimer() {
  const timerPercentage = (timer / 50) * 100;
  timerBar.style.width = `${timerPercentage}%`; // Update the timer bar width
  document.title = `LayerEdgeCollector - ${timer}s`; // Update the timer on the page title
}

// Start the countdown timer
function startTimer() {
  timerInterval = setInterval(() => {
    timer--;
    updateTimer();
    if (timer <= 0) {
      endGame(false); // Game over if time runs out
    }
  }, 1000);
}

// Icon spawner
function spawnIcon() {
  if (!gameRunning) return;

  const iconData = icons[Math.floor(Math.random() * icons.length)];
  const icon = document.createElement("div");
  icon.classList.add("icon");
  icon.textContent = iconData.emoji;
  icon.style.top = Math.random() * 360 + "px";
  icon.style.left = Math.random() * (window.innerWidth - 60) + "px";

  icon.onclick = () => {
    if (!gameRunning) return;

    if (iconData.name === "Syblis") {
      showPopup("☠️ You touched the Syblis!<br>Game Over.");
      endGame(false);
    } else {
      score += iconData.points;
      showPopup(`✅ You collected: ${iconData.emoji} (${iconData.name})<br>+${iconData.points} points!`);
      updateLevel();
      updateRole();
    }

    icon.remove();
  };

  gameArea.appendChild(icon);

  setTimeout(() => {
    if (gameArea.contains(icon)) icon.remove();
  }, 3000);
}

// Update the role based on the score
function updateRole() {
  if (score >= 5000) {
    roleStatus.textContent = "Role: 🧠 LayerEdgeCommander";
  } else if (score >= 3000) {
    roleStatus.textContent = "Role: 🏆 LayerEdgeChamp";
  } else if (score >= 2000) {
    roleStatus.textContent = "Role: 💻 LayerEdgeDev";
  } else if (score >= 500) {
    roleStatus.textContent = "Role: 🤣 LayerEdgeMemer";
  } else {
    roleStatus.textContent = "Role: 👶 Newbie";
  }
}

// Level progression
function updateLevel() {
  if (score >= pointsForNextLevel) {
    level++;
    pointsForNextLevel *= 2; // Double the points for the next level
    levelDisplay.textContent = `Level: ${level}`;
    timer = Math.max(5, timer - 5); // Decrease timer by 5 seconds, minimum 5 seconds
    updateTimer();
    if (level >= 10) {
      roleStatus.textContent = "Role: 🧠 LayerEdgeCommander (Winner)";
      endGame(true); // End game if level 10 is reached
    }
  }
}

// Popup message
function showPopup(message) {
  popup.innerHTML = message;
  popup.style.display = "block";
  setTimeout(() => {
    popup.style.display = "none";
  }, 1300);
}

// Share the score on Twitter
shareBtn.addEventListener("click", () => {
  const url = `https://twitter.com/intent/tweet?text=I scored ${score} points in LayerEdgeCollector! Try to beat me!`;
  window.open(url, "_blank");
});

// Restart the game
restartBtn.addEventListener("click", () => {
  endMenu.style.display = "none"; // Hide end menu
  startGame(); // Restart the game
});

// Start the game when the Start button is clicked
startBtn.addEventListener("click", startGame);
