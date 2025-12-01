// =============================
// GESTION DE SESSION POUR RECOMMENCER LE QUIZ
// =============================

window.addEventListener("load", () => {
    if (sessionStorage.getItem("quizStarted")) {
        resetQuizSession();
    }
    sessionStorage.setItem("quizStarted", "true");
});

function resetQuizSession() {
    sessionStorage.removeItem("quizStarted");
    sessionStorage.removeItem("currentQuestion");
    sessionStorage.removeItem("score");
    sessionStorage.removeItem("shuffledQuestions");
    window.location.href = "index.html";
}

// =============================
// SYSTEME ANTI-TRICHE RENFORCÉ
// =============================

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") resetQuizSession();
});

window.addEventListener("blur", resetQuizSession);

document.addEventListener("contextmenu", (e) => e.preventDefault());

document.addEventListener("keydown", (e) => {
    const blocked =
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
        (e.ctrlKey && e.key === "U");

    if (blocked) {
        e.preventDefault();
        resetQuizSession();
    }
});

// Plein écran
function goFullScreen() {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
}

/* ============================================================
============== MUSIQUE DE FOND (STYLE KAHOOT) =================
============================================================ */

function startMusic() {
    const audio = document.getElementById("bgMusic");
    audio.volume = 0.4;
    audio.muted = false;

    audio.play().catch(() => {
        console.log("Lecture automatique impossible — action utilisateur requise !");
    });
}

function stopMusic() {
    const audio = document.getElementById("bgMusic");
    audio.pause();
    audio.currentTime = 0;
}

/* ============================================================
============== TIMER ==========================================
============================================================ */
let timer;
const TIME_LIMIT = 30;

function startTimer(onTimeUp) {
    let timeLeft = TIME_LIMIT;

    const circle = document.getElementById("timer-circle");
    const timerText = document.getElementById("timer-text");

    const totalLength = 220;
    circle.style.strokeDasharray = totalLength;

    // Reset timer visuals
    circle.style.strokeDashoffset = 0;
    timerText.textContent = timeLeft;

    clearInterval(timer);

    timer = setInterval(() => {
        timeLeft--;
        timerText.textContent = timeLeft;

        const offset = totalLength - (timeLeft / TIME_LIMIT) * totalLength;
        circle.style.strokeDashoffset = offset;

        if (timeLeft <= 0) {
            clearInterval(timer);
            timerText.textContent = "0";
            circle.style.strokeDashoffset = totalLength;

            if (typeof onTimeUp === "function") onTimeUp();
        }
    }, 1000);
}

/* ============================================================
============== VARIABLES GLOBALES ============================
============================================================ */

let user = { nom: "", prenom: "" };
let current = 0;
let score = 0;
let shuffledQuestions = [];

const delayCorrect = 8000;
const delayWrong = 6000;

/* ============================================================
============== FONCTIONS UTILITAIRES ==========================
============================================================ */

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function shuffleQuestions() {
    return questions.map((q) => ({
        ...q,
        options: shuffleArray(q.options)
    }));
}

/* ============================================================
============== AFFICHAGE QUESTIONS ============================
============================================================ */

function showQuestion() {
    const question = shuffledQuestions[current];

    const optionsHTML = question.options
        .map((option, index) => {
            const inputId = `q${current}_opt${index}`;
            return `
                <div class="option-container">
                    <input type="radio" id="${inputId}" name="q${current}" value="${option}">
                    <label for="${inputId}">${option}</label>
                </div>
            `;
        })
        .join("");

    document.getElementById("quiz").innerHTML = `
        <h2>${question.question}</h2>
        ${optionsHTML}
        <button class="validate" onclick="validateAnswer()">Valider</button>
        <div id="explication"></div>
    `;
}

/* ============================================================
============== VALIDATION REPONSE =============================
============================================================ */

function highlightAnswer(inputElem, isCorrect) {
    const label = inputElem.nextElementSibling;
    label.classList.add(isCorrect ? "answer-correct" : "answer-wrong");
}

function validateAnswer() {
    const selected = document.querySelector(`input[name="q${current}"]:checked`);

    if (!selected) {
        document.getElementById("explication").textContent =
            "Veuillez sélectionner une réponse.";
        return;
    }

    const q = shuffledQuestions[current];
    const userAnswer = selected.value;

    selected.nextElementSibling.classList.add("answer-selected");

    if (userAnswer === q.bonne_reponse) {
        score++;
        highlightAnswer(selected, true);

        document.getElementById("explication").innerHTML =
            `<span class="success">Bonne réponse !</span> ${q.explication}`;

        setTimeout(nextQuestion, delayCorrect);
    } else {
        highlightAnswer(selected, false);

        document.getElementById("explication").innerHTML =
            `<span class="fail">Mauvaise réponse.</span> ${q.explication}`;

        // Affichage de la bonne réponse
        document
            .querySelectorAll(`input[name="q${current}"]`)
            .forEach((input) => {
                if (input.value === q.bonne_reponse) {
                    input.nextElementSibling.classList.add("answer-correct-auto");
                }
            });

        setTimeout(nextQuestion, delayWrong);
    }

    document.getElementById("score").innerText =
        `Score actuel : ${score} / ${shuffledQuestions.length}`;
}

/* ============================================================
============== NAVIGATION QUESTIONS ===========================
============================================================ */

function nextQuestion() {
    current++;
    if (current < shuffledQuestions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
}

/* ============================================================
============== FIN DU QUIZ ====================================
============================================================ */

function endQuiz() {
    document.getElementById("quiz").innerHTML = `
        <h2>Quiz terminé !</h2>
        <p>Score final : ${score} / ${shuffledQuestions.length}</p>
    `;
}

/* ============================================================
============== LANCEMENT QUIZ =================================
============================================================ */

document.getElementById("startQuiz").addEventListener("click", () => {
    startMusic();

    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();

    if (!nom || !prenom) {
        alert("Merci de renseigner votre nom et prénom avant de commencer.");
        return;
    }

    user = { nom, prenom };
    shuffledQuestions = shuffleQuestions();
    current = 0;
    score = 0;

    document.getElementById("userForm").style.display = "none";
    document.getElementById("quiz").style.display = "block";

    showQuestion();
});
