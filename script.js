// Quiz data (hard-coded for now, later can be "AI-generated")
const questionsDB = {
  javascript: [
    {
      q: "Which method is used to add an element at the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      answer: 0
    },
    {
      q: "What does DOM stand for?",
      options: [
        "Data Object Model",
        "Document Object Model",
        "Digital Ordinance Model",
        "Desktop Orientation Mode"
      ],
      answer: 1
    },
    {
      q: "Which keyword declares a block-scoped variable?",
      options: ["var", "let", "const", "both let and const"],
      answer: 3
    }
  ],
  dsa: [
    {
      q: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      answer: 1
    },
    {
      q: "Which data structure uses LIFO order?",
      options: ["Queue", "Stack", "Linked List", "Tree"],
      answer: 1
    }
  ]
};

let currentSubject = "javascript";
let currentQuestions = [];
let currentIndex = 0;
let score = 0;

// ---------- Dashboard logic ----------
const subjectSelect = document.getElementById("subject-select");
const startQuizBtn = document.getElementById("start-quiz-btn");
const bestJsSpan = document.getElementById("best-js");
const bestDsaSpan = document.getElementById("best-dsa");

if (subjectSelect && startQuizBtn) {
  // Load best scores from localStorage
  const bestJS = localStorage.getItem("best-js") || 0;
  const bestDSA = localStorage.getItem("best-dsa") || 0;
  bestJsSpan.textContent = bestJS;
  bestDsaSpan.textContent = bestDSA;

  startQuizBtn.addEventListener("click", () => {
    currentSubject = subjectSelect.value;
    // Save subject in localStorage so quiz page can read it
    localStorage.setItem("quiz-subject", currentSubject);
    window.location.href = "quiz.html";
  });
}

// ---------- Quiz logic ----------
const questionText = document.getElementById("question-text");
const optionsBox = document.getElementById("options-box");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const quizBox = document.getElementById("quiz-box");
const resultBox = document.getElementById("result-box");
const scoreDisplay = document.getElementById("score-display");
const totalDisplay = document.getElementById("total-display");
const bestScoreDisplay = document.getElementById("best-score-display");
const backBtn = document.getElementById("back-btn");

if (questionText && optionsBox) {
  // Get subject from localStorage
  const storedSubject = localStorage.getItem("quiz-subject");
  if (storedSubject && questionsDB[storedSubject]) {
    currentSubject = storedSubject;
    currentQuestions = questionsDB[currentSubject];
  } else {
    currentSubject = "javascript";
    currentQuestions = questionsDB[currentSubject];
  }

  currentIndex = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  const q = currentQuestions[currentIndex];
  questionText.textContent = q.q;
  optionsBox.innerHTML = "";
  feedback.textContent = "";
  nextBtn.style.display = "none";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => handleAnswer(idx, btn));
    optionsBox.appendChild(btn);
  });
}

function handleAnswer(selectedIndex, btnElement) {
  // Prevent multiple clicks
  const allOptions = optionsBox.querySelectorAll(".option-btn");
  allOptions.forEach(b => b.disabled = true);

  const correctIndex = currentQuestions[currentIndex].answer;

  if (selectedIndex === correctIndex) {
    btnElement.classList.add("correct");
    feedback.textContent = "Correct!";
    feedback.style.color = "green";
    score++;
  } else {
    btnElement.classList.add("wrong");
    // Highlight correct answer
    allOptions[correctIndex].classList.add("correct");
    feedback.textContent = "Wrong!";
    feedback.style.color = "red";
  }

  nextBtn.style.display = "inline-block";
}

nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < currentQuestions.length) {
    showQuestion();
  } else {
    finishQuiz();
  }
});

function finishQuiz() {
  quizBox.style.display = "none";
  resultBox.style.display = "block";

  scoreDisplay.textContent = score;
  totalDisplay.textContent = currentQuestions.length;

  // Update best score in localStorage
  const key = currentSubject === "javascript" ? "best-js" : "best-dsa";
  const previousBest = Number(localStorage.getItem(key) || 0);

  if (score > previousBest) {
    localStorage.setItem(key, String(score));
    bestScoreDisplay.textContent = score;
  } else {
    bestScoreDisplay.textContent = previousBest;
  }
}

backBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});