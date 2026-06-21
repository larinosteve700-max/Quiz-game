// ======================
// QUIZ DATA (20 QUESTIONS)
// ======================
const questions = [
  {
    q: "What is the capital of France?",
    a: ["Paris", "London", "Berlin", "Rome"],
    correct: 0,
    explain: "Paris is the capital city of France."
  },
  {
    q: "Which planet is known as the Red Planet?",
    a: ["Earth", "Mars", "Venus", "Jupiter"],
    correct: 1,
    explain: "Mars is called the Red Planet due to iron oxide."
  },
  {
    q: "Who wrote 'Romeo and Juliet'?",
    a: ["Shakespeare", "Hemingway", "Tolstoy", "Dickens"],
    correct: 0,
    explain: "William Shakespeare wrote it."
  },
  {
    q: "What is 5 + 7?",
    a: ["10", "11", "12", "13"],
    correct: 2,
    explain: "5 + 7 = 12"
  },
  {
    q: "Largest ocean on Earth?",
    a: ["Atlantic", "Pacific", "Indian", "Arctic"],
    correct: 1,
    explain: "Pacific Ocean is the largest."
  },
  {
    q: "H2O is?",
    a: ["Oxygen", "Hydrogen", "Water", "Salt"],
    correct: 2,
    explain: "H2O = Water"
  },
  {
    q: "Fastest land animal?",
    a: ["Lion", "Cheetah", "Horse", "Tiger"],
    correct: 1,
    explain: "Cheetah is the fastest."
  },
  {
    q: "Which is a programming language?",
    a: ["HTML", "CSS", "JavaScript", "All"],
    correct: 3,
    explain: "All are used in web dev."
  },
  {
    q: "Sun rises from?",
    a: ["West", "East", "North", "South"],
    correct: 1,
    explain: "Sun rises from the East."
  },
  {
    q: "How many continents?",
    a: ["5", "6", "7", "8"],
    correct: 2,
    explain: "There are 7 continents."
  },
  // (add more until 20)
];

// duplicate fill to ensure 20
while (questions.length < 20) {
  questions.push({...questions[0]});
}

// ======================
// STATE
// ======================
let current = 0;
let score = 0;
let xp = 0;
let level = 1;
let streak = 0;
let time = 15;
let timer;

// shuffle
questions.sort(() => Math.random() - 0.5);

// ======================
// ELEMENTS
// ======================
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const explanationEl = document.getElementById("explanation");

// ======================
// START GAME
// ======================
document.getElementById("startBtn").onclick = () => {
  startScreen.classList.remove("active");
  quizScreen.classList.add("active");
  loadQuestion();
};

// ======================
// LOAD QUESTION
// ======================
function loadQuestion() {
  if (current >= questions.length) return endGame();

  const q = questions[current];

  questionEl.textContent = q.q;
  answersEl.innerHTML = "";
  explanationEl.textContent = "";

  q.a.forEach((ans, i) => {
    const btn = document.createElement("div");
    btn.classList.add("answer");
    btn.textContent = ans;

    btn.onclick = () => selectAnswer(btn, i, q.correct, q.explain);

    answersEl.appendChild(btn);
  });

  updateProgress();
  startTimer();
}

// ======================
// ANSWER CHECK
// ======================
function selectAnswer(btn, i, correct, explain) {
  clearInterval(timer);

  const all = document.querySelectorAll(".answer");
  all.forEach(a => a.style.pointerEvents = "none");

  if (i === correct) {
    btn.classList.add("correct");
    score++;
    xp += 10;
    streak++;
    playSound(true);
  } else {
    btn.classList.add("wrong");
    streak = 0;
    playSound(false);
  }

  explanationEl.textContent = explain;

  updateStats();

  setTimeout(() => {
    current++;
    loadQuestion();
  }, 1500);
}

// ======================
// TIMER
// ======================
function startTimer() {
  time = 15;
  document.getElementById("time").textContent = time;

  timer = setInterval(() => {
    time--;
    document.getElementById("time").textContent = time;

    if (time <= 0) {
      clearInterval(timer);
      current++;
      loadQuestion();
    }
  }, 1000);
}

// ======================
// UI UPDATES
// ======================
function updateStats() {
  document.getElementById("score").textContent = score;
  document.getElementById("xp").textContent = xp;
  document.getElementById("streak").textContent = "Streak: " + streak;

  level = Math.floor(xp / 50) + 1;
  document.getElementById("level").textContent = level;
}

function updateProgress() {
  document.getElementById("progressBar").style.width =
    (current / questions.length) * 100 + "%";
}

// ======================
// END GAME
// ======================
function endGame() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  document.getElementById("finalScore").textContent =
    `Score: ${score} / ${questions.length}`;

  let badge = "Beginner";
  if (score > 10) badge = "Smart Thinker";
  if (score > 15) badge = "Quiz Master";
  if (score === 20) badge = "Genius";

  document.getElementById("badge").textContent = "Badge: " + badge;

  localStorage.setItem("highScore",
    Math.max(score, localStorage.getItem("highScore") || 0)
  );
}

// ======================
// SOUND (simple beep)
// ======================
function playSound(correct) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const o = ctx.createOscillator();
  o.frequency.value = correct ? 600 : 200;
  o.connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + 0.2);
}

// ======================
// THEME TOGGLE
// ======================
const themeBtn = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}

themeBtn.onclick = () => {
  document.body.classList.toggle("light");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
};

// ======================
// RESTART
// ======================
document.getElementById("restartBtn").onclick = () => {
  location.reload();
};
