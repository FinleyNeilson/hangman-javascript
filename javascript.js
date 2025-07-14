const maxIncorrect = 6;

let wordList = [];
let secretWord = "";
let correctGuesses = [];
let allGuesses = [];
let incorrectGuesses = 0;

// ===== Initialization =====

fetch('words.txt')
    .then(response => response.text())
    .then(text => {
        wordList = text.split('\n').map(word => word.trim().toLowerCase()).filter(w => w);
        startGame();
    })
    .catch(err => {
        console.error("Failed to load word list:", err);
    });

// ===== Game Start =====

function startGame() {
    secretWord = getRandomWord();
    correctGuesses = Array(secretWord.length).fill("_");
    allGuesses = [];
    incorrectGuesses = 0;

    setupInputHandlers();
    enableInput(true);
    updateHangmanImage();
    updateDisplay();
}

function submitGuess() {
    const input = document.getElementById("guessInput");
    const guess = input.value.toLowerCase();

    input.value = "";
    input.focus();

    if (!isValidGuess(guess)) return;

    allGuesses.push(guess);

    let correct = false;
    for (let i = 0; i < secretWord.length; i++) {
        if (secretWord[i] === guess) {
            correctGuesses[i] = guess;
            correct = true;
        }
    }

    updateDisplay();

    if (correct) {
        if (!correctGuesses.includes("_")) endGame(true);
    } else {
        incorrectGuesses++;
        updateHangmanImage();
        if (incorrectGuesses >= maxIncorrect) endGame(false);
    }
}

function endGame(win) {
    enableInput(false);

    const guessButton = document.querySelector("button");
    guessButton.textContent = "Retry";
    guessButton.onclick = startGame;

    const resultMsg = win ? "You win!" : `You lose! The word was "${secretWord}".`;

    setTimeout(() => { alert(resultMsg); }, 10); // Allow DOM to update
}

// ===== Helpers =====

function updateDisplay() {
    const incorrectGuessesList = allGuesses.filter(item => !correctGuesses.includes(item));
    document.getElementById("word-display").textContent = correctGuesses.join(" ");
    document.getElementById("guesses").textContent = "Incorrect guesses: " + incorrectGuessesList.join(", ");
}

function updateHangmanImage() {
    const img = document.getElementById("hangman");
    img.src = `assets/hangman${incorrectGuesses}.png`;
}

function getRandomWord() {
    return wordList[Math.floor(Math.random() * wordList.length)];
}

function isValidGuess(letter) {
    return /^[a-z]$/.test(letter) && !allGuesses.includes(letter);
}

function setupInputHandlers() {
    const input = document.getElementById("guessInput");
    const button = document.querySelector("button");

    button.textContent = "Guess";
    button.onclick = submitGuess;

    input.removeEventListener("keydown", handleKeyPress);
    input.addEventListener("keydown", handleKeyPress);
}

function handleKeyPress(e) {
    if (e.key === "Enter") {
        submitGuess();
    }
}

function enableInput(enable) {
    document.getElementById("guessInput").disabled = !enable;
}
