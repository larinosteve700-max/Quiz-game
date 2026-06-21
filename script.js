//
// ==========================
// QUIZ GAME - FULL VERSION
// ==========================
// ✔ No repeat bug fixed
// ✔ Sound effects added
// ✔ XP / Score / Streak system
//

// ==========================
// QUESTION BANK
// ==========================
const questions = [
  {q:"What is the capital of the Philippines?",a:["Cebu","Manila","Davao","Iloilo"],c:1,ex:"Manila is the capital of the Philippines."},
  {q:"How many continents are there?",a:["5","6","7","8"],c:2,ex:"There are 7 continents."},
  {q:"Largest planet in our solar system?",a:["Earth","Mars","Jupiter","Saturn"],c:2,ex:"Jupiter is the largest planet."},
  {q:"What is H2O?",a:["Oxygen","Hydrogen","Water","Salt"],c:2,ex:"H2O is water."},
  {q:"Who wrote Romeo and Juliet?",a:["Mark Twain","William Shakespeare","Charles Dickens","Leo Tolstoy"],c:1,ex:"Written by Shakespeare."},
  {q:"Fastest land animal?",a:["Lion","Cheetah","Horse","Tiger"],c:1,ex:"Cheetah is the fastest."},
  {q:"Boiling point of water?",a:["50°C","100°C","150°C","200°C"],c:1,ex:"100°C."},
  {q:"Leap year days?",a:["365","366","364","360"],c:1,ex:"366 days."},
  {q:"Main language in Philippines?",a:["English","Filipino","Spanish","Chinese"],c:1,ex:"Filipino."},
  {q:"Red planet?",a:["Venus","Mars","Mercury","Jupiter"],c:1,ex:"Mars."}
];

// ==========================
// FIX: NO REPEAT SYSTEM
// ==========================
let pool = [...questions].sort(() => Math.random() - 0.5);

// ==========================
// GAME STATE
// ==========================
let i = 0;
let score = 0;
let xp = 0;
let streak = 0;
let time = 15;
let timer;

// ==========================
// ELEMENTS
// ==========================
const qEl = document.getElementById("question");
const aEl = document.getElementById("answers");
const expEl = document.getElementById("explanation");

// ==========================
// SOUND EFFECTS
// (IMPORTANT: must be in /sounds folder on GitHub)
// ==========================
const correctSound = new Audio("./sounds/correct.mp3");
const wrongSound = new Audio("./sounds/wrong.mp3");
const timesUpSound = new Audio("./sounds/timesup.mp3");

// unlock sound (fix for browser blocking audio)
function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(err => {
    console.log("Sound blocked until user interacts:", err);
  });
}

// ==========================
// START GAME
// ==========================
document.getElementById("startBtn").onclick = () => {
  document.getElementById("startScreen").classList.remove("active");
  document.getElementById("quizScreen").classList.add("active");
  loadQuestion();
};

// ==========================
// LOAD QUESTION
// ==========================
function loadQuestion() {

  if (i >= pool.length) return endGame();

  let q = pool[i];

  qEl.textContent = q.q;
  aEl.innerHTML = "";
  expEl.textContent = "";

  let options = q.a.map((a, idx) => ({a, idx}));
  options.sort(() => Math.random() - 0.5);

  options.forEach(opt => {
    let div = document.createElement("div");
    div.className = "answer";
    div.textContent = opt.a;

    div.onclick = () => checkAnswer(div, opt.idx, q.c, q.ex);

    aEl.appendChild(div);
  });

  updateProgress();
  startTimer();
}

// ==========================
// CHECK ANSWER
// ==========================
function checkAnswer(el, chosen, correct, explain) {

  clearInterval(timer);

  document.querySelectorAll(".answer")
    .forEach(b => b.style.pointerEvents = "none");

  if (chosen === correct) {
    el.classList.add("correct");

    playSound(correctSound);

    score++;
    xp += 10;
    streak++;
  } else {
    el.classList.add("wrong");

    playSound(wrongSound);

    streak = 0;
  }

  expEl.textContent = explain;

  updateUI();

  setTimeout(() => {
    i++;
    loadQuestion();
  }, 1200);
}

// ==========================
// TIMER
// ==========================
function startTimer() {
  time = 15;
  document.getElementById("time").textContent = time;

  timer = setInterval(() => {
    time--;
    document.getElementById("time").textContent = time;

    if (time <= 0) {
      clearInterval(timer);

      playSound(timesUpSound);

      i++;
      loadQuestion();
    }
  }, 1000);
}

// ==========================
// UI UPDATE
// ==========================
function updateUI() {
  document.getElementById("score").textContent = score;
  document.getElementById("xp").textContent = xp;
  document.getElementById("streak").textContent = "Streak: " + streak;
  document.getElementById("level").textContent = Math.floor(xp / 50) + 1;
}

function updateProgress() {
  document.getElementById("progressBar").style.width =
    (i / pool.length) * 100 + "%";
}

// ==========================
// END GAME
// ==========================
function endGame() {
  document.getElementById("quizScreen").classList.remove("active");
  document.getElementById("resultScreen").classList.add("active");

  document.getElementById("finalScore").textContent =
    `Score: ${score}/${pool.length}`;

  let badge = "Beginner";
  if (score > 3) badge = "Smart Thinker";
  if (score > 5) badge = "Quiz Master";
  if (score > 8) badge = "Genius";

  document.getElementById("badge").textContent =
    "Badge: " + badge;
}

// ==========================
// THEME TOGGLE
// ==========================
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("light");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
};

// LOAD THEME
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}
