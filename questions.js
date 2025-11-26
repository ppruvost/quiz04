// =============================
// GESTION DE SESSION POUR RECOMMENCER LE QUIZ + DETECTION ONGLET
// =============================

window.addEventListener("load", () => {
    loadProgress();

    if (!sessionStorage.getItem("quizStarted")) {
        sessionStorage.setItem("quizStarted", "true");
    }
});

// Réinitialisation complète du quiz
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
    if (document.visibilityState === "hidden") {
        resetQuizSession();
    }
});

window.addEventListener("blur", () => {
    resetQuizSession();
});

document.addEventListener("contextmenu", (e) => e.preventDefault());

document.addEventListener("keydown", (e) => {
    if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
        (e.ctrlKey && e.key === "U")
    ) {
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
    audio.play().catch(() => {
        document.addEventListener("click", () => audio.play(), { once: true });
    });
}

function stopMusic() {
    const audio = document.getElementById("bgMusic");
    audio.pause();
    audio.currentTime = 0;
}

/* ============================================================
================ VARIABLES GLOBALES ========================
============================================================ */

let user = { nom: "", prenom: "" };
let current = 0;
let score = 0;
let shuffledQuestions = [];

/* ============================================================
================ MÉLANGE DE TABLEAUX =======================
============================================================ */

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// 🔥 Correction : nouvelle position de la bonne réponse après mélange
function shuffleQuestions() {
    return questions.map((q) => {
        const shuffledOptions = shuffleArray(q.options);
        return {
            ...q,
            options: shuffledOptions,
            correct: shuffledOptions.indexOf(q.options[q.correct])
        };
    });
}

/* ============================================================
================= SAUVEGARDE ET CHARGEMENT ===================
============================================================ */

function saveProgress() {
    sessionStorage.setItem("currentQuestion", current);
    sessionStorage.setItem("score", score);
    sessionStorage.setItem("shuffledQuestions", JSON.stringify(shuffledQuestions));
}

function loadProgress() {
    current = parseInt(sessionStorage.getItem("currentQuestion")) || 0;
    score = parseInt(sessionStorage.getItem("score")) || 0;
    const savedQuestions = sessionStorage.getItem("shuffledQuestions");
    if (savedQuestions) shuffledQuestions = JSON.parse(savedQuestions);
}
/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

const questions = [
  {
    question: "1. Lors d’un changement d’état, la température d’un corps pur :",
    options: [
      "augmente",
      "diminue",
      "reste constante",
      "varie selon la masse"
    ],
    correct: 2,
    explanation: "Pendant la fusion ou la solidification, l’énergie sert à changer l’état, pas à augmenter la température. En atelier soudure : un métal fond à température fixe (ex : acier ≈ 1530°C)."
  },
  {
    question: "2. La chaleur correspond à :",
    options: [
      "une température élevée",
      "un transfert d’énergie",
      "une masse importante",
      "une couleur rouge"
    ],
    correct: 1,
    explanation: "La chaleur est un transfert d’énergie d’un corps chaud vers un corps froid. Exemple atelier : une pièce chaude sortant du four transmet de l’énergie au marbre froid."
  },
  {
    question: "3. Quelle est l’unité de l’énergie thermique Q ?",
    options: ["le Watt", "le Joule", "le Kelvin", "le Volt"],
    correct: 1,
    explanation: "Q se mesure en Joule (J). En atelier : chauffage d’une tôle avant cintrage = énergie (J) fournie par le chalumeau."
  },
  {
    question: "4. Dans un calorimètre, les échanges de chaleur avec l’extérieur :",
    options: [
      "sont importants",
      "sont négligeables",
      "dépendent du métal",
      "raffraichissent l’eau"
    ],
    correct: 1,
    explanation: "Un calorimètre limite les pertes. En atelier, une thermos fonctionne pareil : elle garde le café chaud."
  },
  {
    question: "5. Ajouter 10 g de glace à 20°C dans 250 mL d’eau à 20°C :",
    options: [
      "réchauffe l’eau",
      "refroidit légèrement l’eau",
      "ne change rien",
      "fait bouillir l’eau"
    ],
    correct: 1,
    explanation: "La glace absorbe de l’énergie pour fondre → l’eau se refroidit. En atelier : refroidissement d’une soudure par eau."
  },
  {
    question: "6. Lors de la fusion de la glace, l’énergie fournie sert à :",
    options: [
      "augmenter la température",
      "changer l’état",
      "réduire la masse",
      "faire bouillir l’eau"
    ],
    correct: 1,
    explanation: "Pendant la fusion, l’énergie sert uniquement à casser les liaisons solides. En atelier : chauffer une brasure avant soudure sert d’abord à atteindre l’état liquide."
  },
  {
    question: "7. La température finale dans un calorimètre après ajout de glace dépend principalement :",
    options: [
      "du volume de glace",
      "de la couleur du calorimètre",
      "du bruit ambiant",
      "de la forme du glaçon"
    ],
    correct: 0,
    explanation: "Plus il y a de glace, plus il faut d’énergie pour la faire fondre. En atelier : plus une pièce métallique est massive, plus elle absorbe de chaleur avant soudure."
  },
  {
    question: "8. Quel phénomène se produit lorsqu'une soudure est refroidie trop vite ?",
    options: [
      "déformation ou fissure",
      "augmentation de la résistance",
      "polissage automatique",
      "aucun effet"
    ],
    correct: 0,
    explanation: "Un refroidissement brutal crée des contraintes internes. Comme dans le calorimètre, la répartition de chaleur influence le comportement du matériau."
  },
  {
    question: "9. L’énergie massique de fusion de la glace correspond à :",
    options: [
      "l’énergie nécessaire pour chauffer la glace de 1°C",
      "l’énergie pour faire fondre 1 kg de glace",
      "la température de la glace",
      "la masse de la glace"
    ],
    correct: 1,
    explanation: "Elle représente l’énergie à fournir pour passer de solide à liquide. En atelier : même principe pour faire fondre un métal avant soudage."
  },
  {
    question: "10. Lors d’un refroidissement, l’énergie thermique :",
    options: [
      "arrive du froid",
      "est perdue vers l’extérieur",
      "est transférée du corps chaud vers le corps froid",
      "augmente spontanément"
    ],
    correct: 2,
    explanation: "La chaleur se déplace toujours du chaud vers le froid. Exemple atelier : une soudure chaude transmet sa chaleur à l’étau en acier."
  },
  {
    question: "11. La capacité calorifique massique de l’eau signifie que :",
    options: [
      "l’eau chauffe vite",
      "il faut beaucoup d’énergie pour augmenter sa température",
      "l’eau bout facilement",
      "elle absorbe peu de chaleur"
    ],
    correct: 1,
    explanation: "L’eau stocke beaucoup d’énergie. En atelier : d’où l’efficacité du refroidissement à l’eau pour limiter les déformations."
  },
  {
    question: "12. Le principe du calorimètre est utilisé en atelier pour :",
    options: [
      "mesurer des tensions électriques",
      "limiter les pertes thermiques",
      "colorer les métaux",
      "souffler de l’air"
    ],
    correct: 1,
    explanation: "Limiter les échanges thermiques permet de contrôler les températures. Exemple : maintien d’une pièce chaude sous couverture isolante."
  },
  {
    question: "13. Une tôle chauffée se dilate. Cela signifie que :",
    options: [
      "sa masse augmente",
      "sa longueur augmente",
      "sa couleur change",
      "elle devient plus légère"
    ],
    correct: 1,
    explanation: "La dilatation thermique allonge les pièces. En chaudronnerie : prévoir le retrait au refroidissement."
  },
  {
    question: "14. Pourquoi mesure-t-on la température pendant un soudage ?",
    options: [
      "pour éviter l’oxydation",
      "pour contrôler l’apport de chaleur",
      "pour décorer la pièce",
      "pour mesurer la masse"
    ],
    correct: 1,
    explanation: "L’apport thermique influence la qualité du cordon. Une surchauffe crée des défauts."
  },
  {
    question: "15. Lors d’une solidification, l’énergie thermique :",
    options: [
      "est absorbée",
      "est libérée",
      "reste constante",
      "disparaît"
    ],
    correct: 1,
    explanation: "Un corps libère de l’énergie en solidifiant. En atelier : le bain de fusion d’une soudure dégage de la chaleur en se solidifiant."
  },
  {
    question: "16. Une pièce métallique froide placée sur une pièce chaude :",
    options: [
      "chauffe la pièce chaude",
      "reste froide",
      "reçoit de la chaleur",
      "absorbe la masse"
    ],
    correct: 2,
    explanation: "La chaleur se transfère vers la pièce froide. Exemple : pince métallique refroidissant une zone soudée."
  },
  {
    question: "17. Pourquoi agite-t-on l’eau dans un calorimètre ?",
    options: [
      "pour dissoudre la glace",
      "pour homogénéiser la température",
      "pour accélérer l’évaporation",
      "pour refroidir le calorimètre"
    ],
    correct: 1,
    explanation: "L’agitation répartit la chaleur. En atelier : brassage du bain de fusion pour uniformiser la température."
  },
  {
    question: "18. Que devient la masse lors d’un changement d’état ?",
    options: [
      "elle augmente",
      "elle diminue",
      "elle reste la même",
      "elle disparaît"
    ],
    correct: 2,
    explanation: "La masse se conserve. En atelier : une tôle fondue garde la même masse."
  },
  {
    question: "19. Quelle est la conséquence d’un chauffage non uniforme ?",
    options: [
      "aucun effet",
      "déformations",
      "refroidissement rapide",
      "augmentation de masse"
    ],
    correct: 1,
    explanation: "Les différences de dilatation entraînent des déformations. En chaudronnerie : risque de voilement."
  },
  {
    question: "20. Pourquoi utilise-t-on un isolant thermique sur une pièce soudée ?",
    options: [
      "pour garder la chaleur et éviter les contraintes",
      "pour décorer",
      "pour changer la masse",
      "pour accélérer la fusion"
    ],
    correct: 0,
    explanation: "Limiter le refroidissement brutal réduit les fissures. Même principe qu’un calorimètre qui conserve la chaleur."
  }
];

/* ============================================================
===================== AFFICHAGE DES QUESTIONS =================
============================================================ */
function showCorrectAnswer(questionObj) {
    const buttons = document.querySelectorAll('.answer-btn');

    buttons.forEach(btn => {
        const index = parseInt(btn.dataset.index);

        if (index === questionObj.correct) {
            btn.style.border = "4px solid #00ff00";
            btn.style.boxShadow = "0 0 18px #00ff00";
        } else {
            btn.style.opacity = "0.5";
        }

        btn.disabled = true;
    });

    const info = document.createElement("div");
    info.className = "explanation";
    info.innerHTML = `
        <p><strong>Bonne réponse :</strong> ${questionObj.options[questionObj.correct]}</p>
        <p>${questionObj.explanation}</p>
    `;
    document.querySelector("#quiz-container").appendChild(info);

    setTimeout(() => {
        info.remove();
        loadNextQuestion();
    }, 2500);
}

function showQuestion() {
    const q = shuffledQuestions[current];

    document.getElementById("quiz").innerHTML = `
        <h2>${q.question}</h2>
        <div id="options" class="answer-grid">
            ${q.options.map((opt, index) => `
                <button class="answer-btn" data-index="${index}">
                    ${opt}
                </button>
            `).join("")}
        </div>
        <p id="score">Score actuel : ${score} / ${shuffledQuestions.length}</p>
    `;

    document.querySelectorAll(".answer-btn").forEach((btn) => {
        btn.addEventListener("click", () => selectAnswer(btn, q));
    });
}

/* ============================================================
=================== SELECTION DE REPONSE ======================
============================================================ */

function selectAnswer(btn, questionObj) {
    const index = parseInt(btn.dataset.index);

    if (index === questionObj.correct) {
        btn.classList.add("correct");
        score++;
    } else {
        btn.classList.add("wrong");
    }

    saveProgress();

    document.getElementById("score").innerText =
        `Score actuel : ${score} / ${shuffledQuestions.length}`;

    showCorrectAnswer(questionObj);
}

function loadNextQuestion() {
    current++;
    if (current < shuffledQuestions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
}

/* ============================================================
======================== FIN DU QUIZ ==========================
============================================================ */

function endQuiz() {
    stopMusic(); // 🔥 coupe la musique

    document.getElementById("quiz").innerHTML = `
        <h2>Quiz terminé !</h2>
        <p>Score final : ${score} / ${shuffledQuestions.length}</p>
    `;

    sessionStorage.clear();
}

/* ============================================================
====================== LANCEMENT DU QUIZ ======================
============================================================ */

document.getElementById("startQuiz").addEventListener("click", () => {
    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();

    if (!nom || !prenom) {
        alert("Merci de renseigner votre nom et prénom avant de commencer.");
        return;
    }

    user.nom = nom;
    user.prenom = prenom;

    shuffledQuestions = shuffleQuestions();
    current = 0;
    score = 0;

    saveProgress();
    goFullScreen();
    startMusic(); // 🔥 musique façon Kahoot

    document.getElementById("userForm").style.display = "none";
    document.getElementById("quiz").style.display = "block";

    showQuestion();
});
