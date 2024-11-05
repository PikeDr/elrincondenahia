// assets/js/general.js

let currentGame = '';
let currentLevel = 1;
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft;
let hasAnswered = false;

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
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split(''); // Usar letras minúsculas para las opciones
    const lettersUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); // Usar letras mayúsculas para la pregunta
    const questions = [];

    for (let i = 0; i < numberOfQuestions; i++) {
        const randomIndex = getRandomInt(0, letters.length - 1);
        const correctLetterLower = letters[randomIndex]; // Letra en minúscula para las opciones
        const correctLetterUpper = lettersUpper[randomIndex]; // Letra en mayúscula para la pregunta

        const options = generateLetterOptions(correctLetterLower);

        questions.push({
            question: `Encuentra la letra "${correctLetterUpper}"`,
            correct: correctLetterLower, // La respuesta correcta es en minúscula
            options: shuffleArray(options)
        });
    }

    return questions;
}

// Generar opciones para letras
function generateLetterOptions(correctLetter) {
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split(''); // Usar letras minúsculas
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
    // Ocultamos la página de inicio y mostramos el juego
    document.getElementById('home').style.display = 'none';
    document.getElementById('game').style.display = 'block';

    // Mostrar el selector de nivel
    document.getElementById('level-selector').style.display = 'block';

    // Ocultar elementos que no deben mostrarse aún
    document.getElementById('question').style.display = 'none';
    document.getElementById('options').style.display = 'none';
    document.getElementById('progress').style.display = 'none'; // Ocultar el progreso
    document.getElementById('time-bar').style.display = 'none'; // Ocultar la barra de tiempo

    // Asegurarnos de que el botón "Siguiente" y "Terminar Juego" estén ocultos
    document.getElementById('next').style.display = 'none';
    document.getElementById('end-game').style.display = 'none';
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

    // Ocultamos el selector de nivel
    document.getElementById('level-selector').style.display = 'none';

    // Mostramos los elementos del juego
    document.getElementById('question').style.display = 'block';
    document.getElementById('options').style.display = 'flex';
    document.getElementById('progress').style.display = 'block'; // Mostrar el progreso
    document.getElementById('time-bar').style.display = 'block'; // Mostrar la barra de tiempo

    // Mostrar el botón "Terminar Juego"
    document.getElementById('end-game').style.display = 'block';

    // Ocultar el botón "Siguiente" ya que el avance es automático
    document.getElementById('next').style.display = 'none';
    
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timer);
    hasAnswered = false; // Reseteamos el estado de respuesta

    const currentQuestion = games[currentGame][currentLevel][currentQuestionIndex];
    document.getElementById('question').textContent = currentQuestion.question;

    // Mostrar el progreso
    document.getElementById('progress').style.display = 'block';
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

    // Reiniciar mensaje y barra de progreso
    const timeBarInner = document.getElementById('time-bar-inner');
    timeBarInner.style.width = '100%';
    timeBarInner.style.transition = 'none';
    document.getElementById('time-bar').style.display = 'block'; // Asegurarnos de que la barra de tiempo esté visible


    // Iniciar temporizador después de cargar todo
    setTimeout(() => {
        startTimer();
    }, 100);
}

function checkAnswer(selected) {
    if (hasAnswered) return; // Evitar que el usuario responda más de una vez
    hasAnswered = true;

    const currentQuestion = games[currentGame][currentLevel][currentQuestionIndex];

    // Detener el temporizador y la barra de progreso
    clearInterval(timer);
    const timeBarInner = document.getElementById('time-bar-inner');
    timeBarInner.style.width = timeBarInner.offsetWidth + 'px'; // Fijar el ancho actual
    timeBarInner.style.transition = 'none';

    // Desactivar los botones para evitar múltiples clics
    const optionButtons = document.querySelectorAll('#options button');
    optionButtons.forEach(button => {
        button.disabled = true;
    });

    // Mostrar mensaje con SweetAlert2
    if (selected === currentQuestion.correct) {
        score++;
        Swal.fire({
            icon: 'success',
            title: '¡Correcto!',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
        }).then(() => {
            nextQuestion();
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Incorrecto',
            text: `La respuesta correcta era: ${currentQuestion.correct}`,
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
        }).then(() => {
            nextQuestion();
        });
    }
}


function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= games[currentGame][currentLevel].length) {
        // Mostrar puntaje final con opción de volver al menú principal
        Swal.fire({
            title: '¡Juego terminado!',
            text: `Tu puntaje es: ${score}/${games[currentGame][currentLevel].length}`,
            icon: 'info',
            confirmButtonText: 'Volver al menú principal',
            allowOutsideClick: false,
        }).then(() => {
            endGame();
        });

         // Ocultar elementos innecesarios
        document.getElementById('question').style.display = 'none';
        document.getElementById('options').style.display = 'none';
        document.getElementById('progress').style.display = 'none';
        document.getElementById('time-bar').style.display = 'none';
        document.getElementById('end-game').style.display = 'none';

        clearInterval(timer);
        
    } else {
        loadQuestion();
    }
}

function endGame() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas terminar el juego y volver al menú principal?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, terminar',
        cancelButtonText: 'Continuar jugando',
        reverseButtons: true,
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('game').style.display = 'none';
            document.getElementById('menu').style.display = 'block';
            resetGame();
        }
    });
}

function resetGame() {

    const timeBarInner = document.getElementById('time-bar-inner');
    timeBarInner.style.width = '0%';
    timeBarInner.style.transition = 'none';

    // Ocultar elementos del juego
    document.getElementById('question').style.display = 'none';
    document.getElementById('options').style.display = 'none';
    document.getElementById('progress').style.display = 'none';
    document.getElementById('time-bar').style.display = 'none';
    document.getElementById('end-game').style.display = 'none';

    // Mostrar la página de inicio
    document.getElementById('home').style.display = 'block';
    document.getElementById('game').style.display = 'none';

    // Reiniciar variables    
    currentQuestionIndex = 0;
    score = 0;
    hasAnswered = false;
    clearInterval(timer);
}


function startTimer() {
    const timeLimits = { 1: 5, 2: 7, 3: 10 };
    timeLeft = timeLimits[currentLevel];

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
            if (!hasAnswered) {
                hasAnswered = true;

                // Detener la barra de progreso
                timeBarInner.style.width = timeBarInner.offsetWidth + 'px'; // Fijar el ancho actual
                timeBarInner.style.transition = 'none';

                // Desactivar los botones
                const optionButtons = document.querySelectorAll('#options button');
                optionButtons.forEach(button => {
                    button.disabled = true;
                });

                // Mostrar mensaje de tiempo agotado con SweetAlert2
                Swal.fire({
                    icon: 'warning',
                    title: 'Tiempo agotado',
                    text: `La respuesta correcta era: ${games[currentGame][currentLevel][currentQuestionIndex].correct}`,
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                }).then(() => {
                    nextQuestion();
                });
            }
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

