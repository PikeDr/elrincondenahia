// assets/js/general.js

let currentGame = '';
let currentLevel = 1;
let currentQuestionIndex = 0;
let score = 0;

const games = {
    letters: {
        1: [
            { question: 'Encuentra la letra A', correct: 'A', options: ['A', 'B', 'C'] },
            { question: 'Encuentra la letra B', correct: 'B', options: ['D', 'E', 'B'] },
            { question: 'Encuentra la letra C', correct: 'C', options: ['C', 'D', 'E'] },
            { question: 'Encuentra la letra D', correct: 'D', options: ['D', 'E', 'F'] },
            { question: 'Encuentra la letra E', correct: 'E', options: ['G', 'E', 'H'] },
        ],
        2: [
            { question: 'Encuentra la letra F', correct: 'F', options: ['F', 'I', 'J'] },
            { question: 'Encuentra la letra G', correct: 'G', options: ['G', 'H', 'I'] },
            { question: 'Encuentra la letra H', correct: 'H', options: ['H', 'J', 'K'] },
            { question: 'Encuentra la letra I', correct: 'I', options: ['I', 'L', 'M'] },
            { question: 'Encuentra la letra J', correct: 'J', options: ['J', 'K', 'L'] },
        ],
        3: [
            { question: 'Encuentra la letra K', correct: 'K', options: ['K', 'L', 'M'] },
            { question: 'Encuentra la letra L', correct: 'L', options: ['L', 'M', 'N'] },
            { question: 'Encuentra la letra M', correct: 'M', options: ['M', 'N', 'O'] },
            { question: 'Encuentra la letra N', correct: 'N', options: ['N', 'O', 'P'] },
            { question: 'Encuentra la letra O', correct: 'O', options: ['O', 'P', 'Q'] },
        ]
    },
    numbers: {
        1: [],
        2: [],
        3: []
    },
    subtraction: {
        1: [],
        2: [],
        3: []
    }
};

// Generar preguntas aleatorias para los juegos de números y restas
function generateRandomNumberQuestions(level, numberOfQuestions, operation = 'addition') {
    const min = level === 1 ? 1 : level === 2 ? 1 : 1;
    const max = level === 1 ? 10 : level === 2 ? 50 : 100;
    
    const questions = [];

    for (let i = 0; i < numberOfQuestions; i++) {
        const num1 = getRandomInt(min, max);
        const num2 = getRandomInt(min, num1); // Asegurarse de que num2 <= num1 para restas

        const correctAnswer = operation === 'addition' ? num1 + num2 : num1 - num2;
        const options = generateOptions(correctAnswer, min, max);

        questions.push({
            question: operation === 'addition' 
                ? `¿Cuánto es ${num1} + ${num2}?` 
                : `¿Cuánto es ${num1} - ${num2}?`,
            correct: correctAnswer.toString(),
            options: options.map(num => num.toString())
        });
    }

    return questions;
}

// Función para generar un número aleatorio entre min y max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generar opciones con la respuesta correcta y otras dos incorrectas
function generateOptions(correctAnswer, min, max) {
    const options = new Set();
    options.add(correctAnswer);

    while (options.size < 3) {
        options.add(getRandomInt(min, max));
    }

    return Array.from(options);
}

function startGame(gameType) {
    currentGame = gameType;
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('level-selector').style.display = 'block';
    document.getElementById('question').style.display = 'none';
    document.getElementById('options').style.display = 'none';
    document.getElementById('next').style.display = 'none';
    document.getElementById('end-game').style.display = 'none';
}

function selectLevel(level) {
    currentLevel = level;
    currentQuestionIndex = 0;
    score = 0;

    if (currentGame === 'numbers') {
        games.numbers[level] = generateRandomNumberQuestions(level, 10);
    } else if (currentGame === 'subtraction') {
        games.subtraction[level] = generateRandomNumberQuestions(level, 10, 'subtraction');
    }

    document.getElementById('level-selector').style.display = 'none';
    document.getElementById('question').style.display = 'block';
    document.getElementById('options').style.display = 'flex';
    document.getElementById('next').style.display = 'block';
    document.getElementById('end-game').style.display = 'block';
    loadQuestion();
}

function loadQuestion() {
    const currentQuestion = games[currentGame][currentLevel][currentQuestionIndex];
    document.getElementById('question').textContent = currentQuestion.question;

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = ''; // Limpiar opciones previas

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selected) {
    const currentQuestion = games[currentGame][currentLevel][currentQuestionIndex];
    const message = document.getElementById('message');
    
    if (selected === currentQuestion.correct) {
        message.innerHTML = '<i class="bi bi-check-circle" style="color: green;"></i> ¡Correcto!';
        score++;
    } else {
        message.innerHTML = '<i class="bi bi-x-circle" style="color: red;"></i> Inténtalo de nuevo.';
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= games[currentGame][currentLevel].length) {
        if (currentLevel < 3) {
            currentLevel++;
            currentQuestionIndex = 0;
            selectLevel(currentLevel); // Avanzar al siguiente nivel
        } else {
            document.getElementById('question').textContent = `¡Juego terminado! Tu puntaje es: ${score}/${games[currentGame][currentLevel].length * 3}`;
            document.getElementById('options').style.display = 'none';
            document.getElementById('next').style.display = 'none';
            document.getElementById('end-game').style.display = 'none';
        }
    } else {
        document.getElementById('message').textContent = '';
        loadQuestion();
    }
}

function endGame() {
    const confirmEnd = confirm('¿Estás seguro de que deseas terminar el juego y volver al menú principal?');
    if (confirmEnd) {
        document.getElementById('game').style.display = 'none';
        document.getElementById('menu').style.display = 'block';
        resetGame();
    }
}

function resetGame() {
    document.getElementById('question').textContent = '';
    document.getElementById('options').innerHTML = '';
    document.getElementById('message').textContent = '';
    document.getElementById('level-selector').style.display = 'block';
    document.getElementById('next').style.display = 'none';
    document.getElementById('end-game').style.display = 'none';
    currentQuestionIndex = 0;
    score = 0;
}

window.onload = () => {
    document.getElementById('game').style.display = 'none';
};
