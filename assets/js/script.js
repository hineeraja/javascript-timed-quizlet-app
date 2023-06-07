// initialise variables
var leftTime = 75;
var time;
var newTime = document.getElementById("timer");
var startquiz = document.getElementById("start-btn");
var nextquiz = document.getElementById("next-btn");
var questionContainer = document.getElementById("question-container");
var SC = document.getElementById("start-container");
var question1 = document.getElementById("question");
var Answerbtn = document.getElementById("answer-options");
var check = document.getElementById("check-answer");
var viewHighScores = document.getElementById("tag-highscore");
var submit = document.getElementById("submission");
var clear = document.getElementById("clear-btn");
var initials1 = document.getElementById("player-name");
var restart = document.getElementById("restart");
var scoreEntry = document.getElementById("player-score");
var scores = JSON.parse(localStorage.getItem("scores")) || [];

var Questions, currentQuestionIndex;
var questions = [
    { 
        question: "What is the result of the expression '3 + 4 * 2'?",
        answers: [
            { text: "11", iscorrect: false },
            { text: "14", correct: true },
            { text: "21", iscorrect: false },
            { text: "10", iscorrect: false }
        ]
    },
    { 
        question: "Which method is used to remove the last element from an array in JavaScript?",
        answers: [
            { text: "pop()", correct: true },
            { text: "shift()", iscorrect: false },
            { text: "splice()", iscorrect: false },
            { text: "slice()", iscorrect: false }
        ]
    },
    { 
        question: "What is the output of the following code?\n\nconsole.log(2 + '2' - 1);",
        answers: [
            { text: "3", iscorrect: false },
            { text: "21", iscorrect: false },
            { text: "NaN", correct: true },
            { text: "22", iscorrect: false }
        ]
    },
    { 
        question: "Which keyword is used to declare a variable in JavaScript?",
        answers: [
            { text: "var", correct: true },
            { text: "let", iscorrect: false },
            { text: "const", iscorrect: false },
            { text: "int", iscorrect: false }
        ]
    },
    { 
        question: "What does the '===` operator in JavaScript do?",
        answers: [
            { text: "Performs strict equality comparison", correct: true },
            { text: "Performs type conversion before comparison", iscorrect: false },
            { text: "Performs loose equality comparison", iscorrect: false },
            { text: "Performs bitwise comparison", iscorrect: false }
        ]
    }
];

startquiz.onclick = startquiz1;
nextquiz.onclick = function() {
  currentQuestionIndex++;
  setNextQuestion();
};



function timeTick() {
    leftTime--;
    newTime.textContent = `Time: ${leftTime}`;
    if (leftTime <= 0) {
      storeScore();
    }
  }
  

// function startquiz1
function startquiz1() {
    time = setInterval(timeTick, 1000);
    SC.classList.add("hide");
    Questions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 0
    questionContainer.classList.remove("hide");
    timeTick();
    setNextQuestion();
};

// next question 
function setNextQuestion() {
    reset1();
    viewquestion(Questions[currentQuestionIndex]);
};

// view question
function viewquestion(question) {
    question1.textContent = question.question;
    Answerbtn.innerHTML = "";
  
    question.answers.forEach(answer => {
      const button = document.createElement("button");
      button.textContent = answer.text;
      button.classList.add("btn");
      if (answer.correct) {
        button.dataset.correct = answer.correct;
      }
      button.addEventListener("click", selectAnswer);
      Answerbtn.appendChild(button);
    });
  }
  
// function to reset
function reset1() {
  nextquiz.classList.add("hide");
  check.classList.add("hide");

  while (Answerbtn.firstChild) {
    Answerbtn.firstChild.remove();
  }
}

// time decduction logic
function selectAnswer(e) {
    var selectedButton = e.target;
    var correct = selectedButton.dataset.correct;
    check.classList.remove("hide")
    if (correct) {
        check.innerHTML = "Correct";
    } else {
        check.innerHTML = "Incorrect";
        if (leftTime <= 10) {
            leftTime = 0;
        } else {
            leftTime -= 10;
        }
    }
    // Check and show the correct answer by set the buttons colors
    function setStatusClass(element, correct) {
        clearStatusClass(element);
        
        element.classList.add(correct ? "correct" : "wrong");
      }
      

    Array.from(Answerbtn.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
    })

    if (Questions.length > currentQuestionIndex + 1) {
        nextquiz.classList.remove("hide")
        check.classList.remove("hide")
    } else {
        startquiz.classList.remove("hide")
        storeScore();
    }
};

function clearStatusClass(element) {
    element.classList.remove("correct");
    element.classList.remove("wrong");
};

// Save scores
function storeScore() {
    clearInterval(time);
    newTime.textContent = "Time: " + leftTime;
    setTimeout(function () {
    localStorage.setItem("scores", JSON.stringify(scores));
        questionContainer.classList.add("hide");
        document.getElementById("score-container").classList.remove("hide");
        document.getElementById("your-score").textContent = "Your final score is " + leftTime;

    }, 2000)
};

//access  local storage
var loadScores = function () {
    
    if (!savedScores) {
        return false;
    }

    savedScores = JSON.parse(savedScores);
    var initials = document.querySelector("#initials-field").value;
    var newScore = {
        score: leftTime,
        initials: initials
    }
    savedScores.push(newScore);
    console.log(savedScores)

    savedScores.forEach(score => {
        initials1.innerText = score.initials
        scoreEntry.innerText = score.score
    })
};

// view highscores
function showHighScores(initials) {
    document.getElementById("highscores").classList.remove("hide")
    document.getElementById("score-container").classList.add("hide");
    SC.classList.add("hide");
    questionContainer.classList.add("hide");
    if (typeof initials == "string") {
        var score = {
            initials, leftTime
        }
        scores.push(score)
    }

    var highScoreEl = document.getElementById("highscore");
    highScoreEl.innerHTML = "";
    for (i = 0; i < scores.length; i++) {
        var div1 = document.createElement("div");
        div1.setAttribute("class", "name-div");
        div1.innerText = scores[i].initials;
        var div2 = document.createElement("div");
        div2.setAttribute("class", "score-div");
        div2.innerText = scores[i].leftTime;
        highScoreEl.appendChild(div1);
        highScoreEl.appendChild(div2);
    }

    localStorage.setItem("scores", JSON.stringify(scores));

};

viewHighScores.addEventListener("click", showHighScores);

submit.addEventListener("click", handleFormSubmit);

restart.addEventListener("click", handleRestartClick);

clear.addEventListener("click", handleClearClick);

function handleFormSubmit(event) {
  event.preventDefault();
  var initials = document.querySelector("#initials-field").value;
  showHighScores(initials);
}

function handleRestartClick() {
  window.location.reload();
}

function handleClearClick() {
  localStorage.clear();
  document.getElementById("highscore").innerHTML = "";
}
