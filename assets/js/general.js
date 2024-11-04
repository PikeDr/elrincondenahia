// assets/js/general.js

let currentGame = '';
let currentLevel = 1;
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft;

const games = {
    letters: {
        1: [],
        2: [],
        3: []
    },
    numbers: {
        1: [],
        2: [],
        3: []
    },
    addition: {
        1: [],
        2: [],
        3: []
    },
    subtraction: {
        1: [],
        2: [],
        3: []
    },
    multiplication: {
        1: [],
        2: [],
        3: []
    },
    mentalAgility: {
        1: [],
        2: [],
        3: []
    }
};

// Generar preguntas para "Encontrar Letras"
function generateLetterQuestions(level, numberOfQuestions) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const questions = [];

    for (let i = 0; i < numberOfQuestions; i++) {
        const correctLetter = letters[getRandomInt(0, letters.length - 1)];
        const options = generateLetterOptions(correctLetter);

        questions.push({
            question: `Encuentra la letra ${correctLetter}`,
            correct: correctLetter,
            options: shuffleArray(options)
        });
    }

    return questions;
}

// Generar opciones para letras
function generateLetterOptions(correctLetter) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const options = new Set();
    options.add(correctLetter);

    while (options.size < 3) {
        const randomLetter = letters[getRandomInt(0, letters.length - 1)];
        if (randomLetter !== correctLetter) {
            options.add(randomLetter);
        }
    }

    return Array.from(options);
}

// Generar preguntas para "Encontrar Números"
function generateNumberQuestions(level, numberOfQuestions) {
    const min = level === 1 ? 1 : level === 2 ? 10 : 50;
    const max = level === 1 ? 10 : level === 2 ? 50 : 100;
    const questions = [];

    for (let i = 0; i < numberOfQuestions; i++) {
        const correctNumber = getRandomInt(min, max);
        const options = generateNumberOptions(correctNumber, min, max);

        questions.push({
            question: `Encuentra el número ${correctNumber}`,
            correct: correctNumber.toString(),
            options: shuffleArray(options.map(num => num.toString()))
        });
    }

    return questions;
}

// Generar opciones para números
function generateNumberOptions(correctNumber, min, max) {
    const options = new Set();
    options.add(correctNumber);

    while (options.size < 3) {
        const option = getRandomInt(min, max);
        if (option !== correctNumber) {
            options.add(option);
        }
    }

    return Array.from(options);
}

// Generar preguntas aleatorias para operaciones matemáticas
function generateRandomMathQuestions(level, numberOfQuestions, operation) {
    const min = level === 1 ? 1 : level === 2 ? 10 : 50;
    const max = level === 1 ? 10 : level === 2 ? 50 : 100;

    const questions = [];

    for (let i = 0; i < numberOfQuestions; i++) {
        const num1 = getRandomInt(min, max);
        const num2 = operation === 'subtraction' ? getRandomInt(min, num1) : getRandomInt(min, max);

        let correctAnswer;
        let questionText;

        if (operation === 'addition') {
            correctAnswer = num1 + num2;
            questionText = `¿Cuánto es ${num1} + ${num2}?`;
        } else if (operation === 'subtraction') {
            correctAnswer = num1 - num2;
            questionText = `¿Cuánto es ${num1} - ${num2}?`;
        } else if (operation === 'multiplication') {
            correctAnswer = num1 * num2;
            questionText = `¿Cuánto es ${num1} × ${num2}?`;
        }

        const options = generateOptions(correctAnswer, min, max);

        questions.push({
            question: questionText,
            correct: correctAnswer.toString(),
            options: shuffleArray(options.map(num => num.toString()))
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
        const option = getRandomInt(min, max * 2); // Aumentar rango para opciones incorrectas
        if (option !== correctAnswer) {
            options.add(option);
        }
    }

    return Array.from(options);
}

// Función para mezclar un array (Fisher-Yates Shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = getRandomInt(0, i);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
    document.getElementById('message').textContent = '';
    document.getElementById('progress').textContent = '';
}

function selectLevel(level) {
    currentLevel = level;
    currentQuestionIndex = 0;
    score = 0;

    const numberOfQuestions = 20; // Usar 20 preguntas

    if (currentGame === 'letters') {
        games.letters[level] = generateLetterQuestions(level, numberOfQuestions);
    } else if (currentGame === 'numbers') {
        games.numbers[level] = generateNumberQuestions(level, numberOfQuestions);
    } else if (['addition', 'subtraction', 'multiplication', 'mentalAgility'].includes(currentGame)) {
        let operation = currentGame;
        if (currentGame === 'numbers') operation = 'addition';
        if (currentGame === 'mentalAgility') operation = getRandomOperation();

        games[currentGame][level] = generateRandomMathQuestions(level, numberOfQuestions, operation);
    }

    document.getElementById('level-selector').style.display = 'none';
    document.getElementById('question').style.display = 'block';
    document.getElementById('options').style.display = 'flex';
    document.getElementById('next').style.display = 'block';
    document.getElementById('end-game').style.display = 'block';
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timer);
    startTimer();

    const currentQuestion = games[currentGame][currentLevel][currentQuestionIndex];
    document.getElementById('question').textContent = currentQuestion.question;

    // Mostrar el progreso
    const progress = document.getElementById('progress');
    progress.textContent = `Pregunta ${currentQuestionIndex + 1} de ${games[currentGame][currentLevel].length}`;

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
        message.innerHTML = '<i class="bi bi-x-circle" style="color: red;"></i> Incorrecto.';
    }

    clearInterval(timer);
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= games[currentGame][currentLevel].length) {
        // Mostrar puntaje final
        document.getElementById('question').textContent = `¡Juego terminado! Tu puntaje es: ${score}/${games[currentGame][currentLevel].length}`;
        document.getElementById('options').style.display = 'none';
        document.getElementById('next').style.display = 'none';
        document.getElementById('end-game').style.display = 'none';
        document.getElementById('message').textContent = '';
        document.getElementById('progress').textContent = '';
        const timeBarInner = document.getElementById('time-bar-inner');
        timeBarInner.style.width = '0%';
        timeBarInner.style.transition = 'none';
        clearInterval(timer);
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
    document.getElementById('progress').textContent = '';
    document.getElementById('level-selector').style.display = 'block';
    document.getElementById('next').style.display = 'none';
    document.getElementById('end-game').style.display = 'none';
    const timeBarInner = document.getElementById('time-bar-inner');
    timeBarInner.style.width = '0%';
    timeBarInner.style.transition = 'none';
    currentQuestionIndex = 0;
    score = 0;
    clearInterval(timer);
}

function startTimer() {
    const timeLimits = { 1: 5, 2: 7, 3: 10 };
    timeLeft = timeLimits[currentLevel];

    const message = document.getElementById('message');
    message.textContent = `Tiempo restante: ${timeLeft} segundos`;

    const timeBarInner = document.getElementById('time-bar-inner');

    // Reiniciar la barra de progreso y establecer la duración de la transición
    timeBarInner.style.width = '100%';
    timeBarInner.style.transition = `width ${timeLeft}s linear`;

    // Iniciar la transición de la barra de progreso
    setTimeout(() => {
        timeBarInner.style.width = '0%';
    }, 50); // Pequeño retraso para asegurar que la transición ocurra

    timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timer);
            message.innerHTML = '<i class="bi bi-x-circle" style="color: red;"></i> Tiempo agotado.';
            // Pasar automáticamente a la siguiente pregunta después de un breve retraso
            setTimeout(nextQuestion, 1000);
        } else {
            message.textContent = `Tiempo restante: ${timeLeft} segundos`;
        }
    }, 1000);
}

// Función para obtener una operación aleatoria para Agilidad Mental
function getRandomOperation() {
    const operations = ['addition', 'subtraction', 'multiplication'];
    return operations[Math.floor(Math.random() * operations.length)];
}

window.onload = () => {
    document.getElementById('game').style.display = 'none';
};
