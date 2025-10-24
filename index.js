//-----Toggling Light Dark Mode-----
const lightSun = $('#light-sun-icon');
const darkSun = $('#dark-sun-icon');
const lightMoon = $('#light-moon-icon');
const darkMoon = $('#dark-moon-icon');
const displayToggle = $('#display-toggle');
const bodyTag = $('body');

let lightmode = localStorage.getItem('lightmode'); // Load lightmode state

const enableLightmode = () => {
    lightSun.addClass('hidden');
    darkSun.removeClass('hidden');
    lightMoon.addClass('hidden');
    darkMoon.removeClass('hidden');
    bodyTag.addClass('lightmode');
    displayToggle.prop('checked', false); 
    localStorage.setItem('lightmode', 'active'); 
};

const disableLightmode = () => {
    lightSun.removeClass('hidden');
    darkSun.addClass('hidden');
    lightMoon.removeClass('hidden');
    darkMoon.addClass('hidden');
    bodyTag.removeClass('lightmode');
    displayToggle.prop('checked', true); 
    localStorage.removeItem('lightmode'); 
};

if (lightmode === 'active') {
    enableLightmode();
} else {
    disableLightmode();
}

displayToggle.on('click', function () {
    lightmode = localStorage.getItem('lightmode');
    lightmode !== 'active' ? enableLightmode() : disableLightmode();
});

//-----setup Json-----
let json;

fetch('./data.json').then((response) => {
    if(!response.ok) return console.log('Oops! Something went wrong.');
    
    return response.json();
}).then((data) => {
    json = data;
});

//-----Taking the quiz-----
const quizMenuChoices = $('.menu-options button');
const mainMenu = $('.main-menu');
const questionPage = $('.question-page');
const completePage = $('.quiz-complete-container');
const currentQuestionNumber = $('.current-question');
const currentQuestion = $('.question');
const quizProgress = $('#quiz-progress');
const answerButtons = $('.answers-container .options');
const answerChoices = $('.answers-container .options .answer-choice');
const resultIcon = $('.answers-container .options .result-icon');
const submitButton = $('#submit-button');
const nextButton = $('#next-button');
const playAgainButton = $('#play-again');
const errorMessage = $('.error-container');

let quizIndex;
let questionIndex = 0;
let answerChoicesText = [];
let userAnswer = '';
let userScore = 0;


quizMenuChoices.each(function () {
    const quizTopic = this.id;

    $(this).click(() => {
        quizIndex = quizMenuChoices.index(this);
        startQuiz();
        updateHeader(quizTopic, quizIndex);
        loadQuestion(quizIndex);
    })
})

answerButtons.each(function(){
    $(this).click(()=>{
        userAnswer = '';
        removeSelectedButton();
        $(this).addClass('selected-answer');
        userAnswer =$(`#${this.id} .answer-choice`).text();
    })
});

submitButton.click(function() {
    if(!userAnswer){
        errorMessage.removeClass('hidden')
    } else{
        checkAnswer();
    }

    if (questionIndex + 1 === json.quizzes[quizIndex].questions.length){
        nextButton.text('Finish Quiz');
    }
});

nextButton.click(function() {
    if (questionIndex + 1 === json.quizzes[quizIndex].questions.length){
        finishQuiz();
    } else{
        questionIndex++;
        removeSelectedButton();
        loadQuestion();
        nextButton.addClass('hidden');
        submitButton.removeClass('hidden');    
    }
}); 

playAgainButton.click(function(){
    location.reload();
});

//-----Functions-----
function startQuiz(){
    mainMenu.addClass('hidden');
    questionPage.removeClass('hidden');
    completePage.addClass('hidden');
    userScore = 0;
    userAnswer = '';
}

function updateHeader(title, index){
    const quizHeader = $('.current-quiz-header');
    const quizIcon = $('#quiz-icon');
    const quizIconResult = $('#quiz-icon-result')
    const quizTitle = $('.quiz-title')
    const currentIcon = json.quizzes[index].icon;

    quizHeader.removeClass('hidden');
    quizIcon.attr('class', '');
    quizIcon.addClass('icon');
    quizIcon.addClass(title);
    quizIcon.attr('src', currentIcon);
    quizTitle.text(title);

    quizIconResult.attr('class', '');
    quizIconResult.addClass('icon');
    quizIconResult.addClass(title);
    quizIconResult.attr('src', currentIcon);

}

function loadQuestion(){
    const questionFromData = json.quizzes[quizIndex].questions[questionIndex].question;
    const questionOptions = json.quizzes[quizIndex].questions[questionIndex].options;

    currentQuestionNumber.text(questionIndex + 1);
    currentQuestion.text(questionFromData);
    answerChoicesText = [];
    userAnswer = '';

    answerChoices.each(function (i) {
        $(this).text(questionOptions[i]);
        answerChoicesText.push(questionOptions[i]);
    })
}

function removeSelectedButton () {
    answerButtons.each(function (){
        $(this).removeClass('selected-answer correct-answer incorrect-answer');
    })

    resultIcon.each(function(){
        $(this).removeClass('display-icon');
    });
}

function checkAnswer(){
    const correctAnswer = json.quizzes[quizIndex].questions[questionIndex].answer;
    
    const answerIndex = answerChoicesText.indexOf(userAnswer);
    const correctIndex = answerChoicesText.indexOf(correctAnswer);
    
    errorMessage.addClass('hidden')

    if(userAnswer === correctAnswer){
        removeSelectedButton();
        resultIcon.attr('src', './assets/images/icon-correct.svg');
        answerButtons.eq(answerIndex).addClass('correct-answer');
        console.log('correct')
        userScore++;
        console.log(userScore);
    } else {
        removeSelectedButton();
        resultIcon.attr('src', './assets/images/icon-incorrect.svg');
        answerButtons.eq(answerIndex).addClass('incorrect-answer');
        console.log('incorrect');

        resultIcon.eq(correctIndex).attr('src', './assets/images/icon-correct.svg');
        resultIcon.eq(correctIndex).addClass('display-icon');
    }

    submitButton.addClass('hidden');
    nextButton.removeClass('hidden');
}

function finishQuiz(){
    questionPage.addClass('hidden');
    completePage.removeClass('hidden');

    const quizScore = $('#quiz-score')
    quizScore.text(userScore);
}
