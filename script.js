const startScreen = document.getElementById("startScreen");
const testScreen = document.getElementById("testScreen");
const resultScreen = document.getElementById("resultScreen");

const startButton = document.getElementById("startButton");
const nextButton = document.getElementById("nextButton");

const progressText = document.getElementById("progressText");
const skillText = document.getElementById("skillText");
const levelText = document.getElementById("levelText");

const passageText = document.getElementById("passageText");
const listeningArea = document.getElementById("listeningArea");
const playButton = document.getElementById("playButton");

const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");

const overallResult = document.getElementById("overallResult");
const skillResults = document.getElementById("skillResults");

const totalQuestionsElement = document.getElementById("totalQuestions");
const correctAnswersElement = document.getElementById("correctAnswers");
const incorrectAnswersElement = document.getElementById("incorrectAnswers");

const questionBreakdown = document.getElementById("questionBreakdown");


let currentQuestionIndex = 0;

let selectedAnswer = null;

let userResults = [];


const skillNames = [
    "Reading",
    "Listening",
    "Grammar",
    "Vocabulary"
];


startButton.addEventListener("click", startTest);


function startTest() {

    currentQuestionIndex = 0;

    selectedAnswer = null;

    userResults = [];

    startScreen.classList.add("hidden");

    resultScreen.classList.add("hidden");

    testScreen.classList.remove("hidden");

    renderQuestion();
}


function renderQuestion() {

    selectedAnswer = null;

    nextButton.disabled = true;

    const question = questions[currentQuestionIndex];


    progressText.textContent =
        `Question ${currentQuestionIndex + 1} of ${questions.length}`;

    skillText.textContent = question.skill;

    levelText.textContent = question.targetLevel;

    questionText.textContent = question.question;


    passageText.classList.add("hidden");

    listeningArea.classList.add("hidden");


    if (question.skill === "Reading") {

        passageText.textContent = question.passage;

        passageText.classList.remove("hidden");
    }


    if (question.skill === "Listening") {

        listeningArea.classList.remove("hidden");

        playButton.onclick = function () {

            const speech = new SpeechSynthesisUtterance(
                question.listeningText
            );

            speech.lang = "en-US";

            window.speechSynthesis.cancel();

            window.speechSynthesis.speak(speech);
        };
    }


    optionsContainer.innerHTML = "";


    question.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.classList.add("option");

        button.textContent = option;

        button.addEventListener("click", function () {

            selectAnswer(index, button);
        });

        optionsContainer.appendChild(button);
    });
}


function selectAnswer(index, selectedButton) {

    selectedAnswer = index;

    const optionButtons =
        document.querySelectorAll(".option");


    optionButtons.forEach(button => {

        button.classList.remove("selected");
    });


    selectedButton.classList.add("selected");

    nextButton.disabled = false;
}


nextButton.addEventListener("click", function () {

    saveCurrentAnswer();

    if (currentQuestionIndex < questions.length - 1) {

        currentQuestionIndex++;

        renderQuestion();

    } else {

        finishTest();
    }
});


function saveCurrentAnswer() {

    const question = questions[currentQuestionIndex];

    const isCorrect =
        selectedAnswer === question.correctAnswer;


    userResults.push({

        questionId: question.id,

        skill: question.skill,

        level: question.targetLevel,

        correct: isCorrect,

        userAnswer: selectedAnswer,

        correctAnswer: question.correctAnswer
    });
}


function finishTest() {

    testScreen.classList.add("hidden");

    resultScreen.classList.remove("hidden");

    calculateResults();
}


function calculateResults() {

    const totalQuestions = userResults.length;

    const correctAnswers =
        userResults.filter(result => result.correct).length;

    const incorrectAnswers =
        totalQuestions - correctAnswers;


    const overallPercentage =
        Math.round((correctAnswers / totalQuestions) * 100);


    const overallLevel =
        estimateCEFR(overallPercentage);


    overallResult.innerHTML = `
        <div class="summary-box">
            <h2>Overall Level: ${overallLevel}</h2>
            <p>Overall Score: ${overallPercentage}%</p>
        </div>
    `;


    totalQuestionsElement.textContent = totalQuestions;

    correctAnswersElement.textContent = correctAnswers;

    incorrectAnswersElement.textContent = incorrectAnswers;


    skillResults.innerHTML = "";


    skillNames.forEach(skill => {

        const skillQuestions =
            userResults.filter(result => result.skill === skill);


        const total =
            skillQuestions.length;


        const correct =
            skillQuestions.filter(result => result.correct).length;


        const incorrect =
            total - correct;


        const percentage =
            total === 0
                ? 0
                : Math.round((correct / total) * 100);


        const level =
            estimateCEFR(percentage);


        const skillCard =
            document.createElement("div");


        skillCard.classList.add("skill-result");


        skillCard.innerHTML = `
            <h3>${skill}</h3>

            <p>
                Level:
                <strong>${level}</strong>
            </p>

            <p>
                Score:
                <strong>${percentage}%</strong>
            </p>

            <p>
                Total:
                <strong>${total}</strong>
            </p>

            <p>
                Correct:
                <strong>${correct}</strong>
            </p>

            <p>
                Incorrect:
                <strong>${incorrect}</strong>
            </p>
        `;


        skillResults.appendChild(skillCard);
    });


    questionBreakdown.innerHTML = "";


    userResults.forEach(result => {

        const item =
            document.createElement("div");


        item.classList.add("breakdown-item");


        const status =
            result.correct
                ? `<span class="correct">Correct: true</span>`
                : `<span class="incorrect">Correct: false</span>`;


        item.innerHTML = `
            <strong>Question ${result.questionId}</strong>

            <p>
                Skill: ${result.skill}
            </p>

            <p>
                Level: ${result.level}
            </p>

            <p>
                ${status}
            </p>
        `;


        questionBreakdown.appendChild(item);
    });
}


function estimateCEFR(percentage) {

    if (percentage >= 85) {
        return "C1";
    }

    if (percentage >= 70) {
        return "B2";
    }

    if (percentage >= 55) {
        return "B1";
    }

    if (percentage >= 40) {
        return "A2";
    }

    return "A1";
}