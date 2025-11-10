"use strict";

// Set theme on page load
const themeToggle = document.querySelector(".toggle-switch input");
const savedTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const theme = savedTheme || systemTheme;
themeToggle.checked = theme === "dark";
document.documentElement.setAttribute("data-theme", theme);

// Set theme on toggle
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const newTheme = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

themeToggle.addEventListener("change", toggleTheme);

// Fetch quiz data
let quizData;

async function getQuizData() {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    quizData = await response.json();

    return quizData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

getQuizData();

// Load the Quiz

//quiz-main menu
const quizTopics = document.querySelectorAll(".quiz-topics [data-topic]");
const currentQuizHeader = document.querySelectorAll(".current-quiz");
const mainMenu = document.querySelector(".quiz-topics");

//quiz-question section
const questionSection = document.querySelector(".quiz-questions");
const questionContainer = questionSection.querySelector(".question-container");
const questionText = questionContainer.querySelector(".current-question");
const progressBar = questionContainer.querySelector(".progress-bar");
const answerForm = questionSection.querySelector(".answer-choices");
const answerChoiceButtons = answerForm.querySelectorAll("label.button");
const answerSubmitBtn = answerForm.querySelector('input[type="submit"]');
const nextButton = questionSection.querySelector("#next-button");
const errorEl = answerForm.querySelector(".error");

//quiz-score screen
const scoreSection = document.querySelector(".quiz-score");
const scoreResult = scoreSection.querySelector(".score");
const playAgainBtn = scoreSection.querySelector(".restart-quiz");

let selectedQuizQuestions = [];
let userScore = 0;
let questionNumber = 1;

function loadQuiz() {
  const selectedQuizData = quizData.quizzes.filter((quiz) => quiz.title === this.dataset.topic);
  selectedQuizQuestions = [...selectedQuizData[0].questions];

  mainMenu.classList.add("hidden");
  questionSection.classList.remove("hidden");

  currentQuizHeader.forEach((header) => {
    header.classList.remove("hidden");
    header.querySelector(".icon").setAttribute("src", selectedQuizData[0].icon);
    header.querySelector("span").textContent = selectedQuizData[0].title;
    header.dataset.topic = selectedQuizData[0].title;
  });

  populateQuestionForm(questionNumber);
}

function populateQuestionForm(number) {
  questionText.textContent = selectedQuizQuestions[number - 1].question;
  questionContainer.querySelector(".question-number").textContent = number;
  document.querySelectorAll(".total-questions").forEach((span) => (span.textContent = selectedQuizQuestions.length));

  const percentage = (number / selectedQuizQuestions.length) * 100;
  progressBar.style.setProperty("--_percentage", `${percentage}%`);

  const answerChoices = selectedQuizQuestions[number - 1].options;
  answerChoiceButtons.forEach((button, index) => {
    button.querySelector(".text").textContent = answerChoices[index];
  });

  if (questionNumber === selectedQuizQuestions.length) {
    nextButton.textContent = "Show Score";
  }
}

function checkAnswer(e) {
  e.preventDefault();
  console.log("sumbitting...");

  const userChoice = this.querySelector('input[type="radio"]:checked ~ .text');

  if (!userChoice) {
    errorEl.classList.remove("hidden");
    return;
  } else {
    errorEl.classList.add("hidden");
  }

  const questionIndex = parseInt(questionContainer.querySelector(".question-number").textContent) - 1;
  const correctAnswer = selectedQuizQuestions[questionIndex].answer;
  const correctAnswerEl = answerChoiceButtons[selectedQuizQuestions[questionIndex].options.indexOf(correctAnswer)];

  const isCorrect = userChoice.textContent === correctAnswer;

  if (isCorrect) {
    userChoice.parentElement.classList.add("correct");
    userScore++;
    console.log(`Your score is: ${userScore}`);
  } else {
    userChoice.parentElement.classList.add("incorrect");
    correctAnswerEl.querySelector(".correct-icon").classList.remove("hidden");
  }

  questionNumber++;
  answerSubmitBtn.classList.add("hidden");
  nextButton.classList.remove("hidden");
  answerChoiceButtons.forEach((button) => (button.querySelector('input[type="radio"]').disabled = true));
}

function nextQuestion() {
  console.log("next...");
  answerForm.reset();

  if (questionNumber > selectedQuizQuestions.length) {
    showScore();
  } else {
    populateQuestionForm(questionNumber);
  }

  answerSubmitBtn.classList.remove("hidden");
  nextButton.classList.add("hidden");
  answerChoiceButtons.forEach((button) => {
    button.querySelector('input[type="radio"]').removeAttribute("disabled");
    button.classList.remove("correct", "incorrect");
    button.querySelectorAll(".correct-icon, .incorrect-icon").forEach((icon) => icon.classList.add("hidden"));
  });
  errorEl.classList.add("hidden");
}

function showScore() {
  questionSection.classList.add("hidden");
  scoreSection.classList.remove("hidden");
  scoreResult.textContent = userScore;
}

function playAgain() {
  console.log("again! again!");
  scoreSection.classList.add("hidden");
  mainMenu.classList.remove("hidden");
  currentQuizHeader.forEach((header) => header.classList.add("hidden"));
  nextButton.textContent = "Next Question";
  userScore = 0;
  questionNumber = 1;
}

quizTopics.forEach((topic) => topic.addEventListener("click", loadQuiz));
answerForm.addEventListener("submit", checkAnswer);
nextButton.addEventListener("click", nextQuestion);
playAgainBtn.addEventListener("click", playAgain);
