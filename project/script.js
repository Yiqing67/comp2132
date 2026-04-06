const GameState = {
    wordList: [],
    currentWord: "",
    currentHint: "",
    guessedLetters: [],
    mistakes: 0,
    maxMistakes: 6,
    isGameOver: false
};

const wordDisplay = document.getElementById("word-display");
const hintDisplay = document.getElementById("hint-display");
const mistakesDisplay = document.getElementById("mistakes");
const keyboardDiv = document.getElementById("keyboard");
const hangmanImg = document.getElementById("hangman-img");
const modal = document.getElementById("game-over-modal");
const resultTitle = document.getElementById("game-result-title");
const resultText = document.getElementById("game-result-text");
const playAgainBtn = document.getElementById("play-again-btn");

async function loadGameData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error("HTTP error " + response.status);
        GameState.wordList = await response.json();
        
        createKeyboard();
        startNewGame();
    } catch (error) {
        console.error("Failed to load JSON data:", error);
        hintDisplay.innerText = "Error loading game data. Make sure you are using a local server (like Live Server).";
    }
}


function createKeyboard() {
    keyboardDiv.innerHTML = "";
    for (let i = 97; i <= 122; i++) {
        const letter = String.fromCharCode(i);
        const button = document.createElement("button");
        button.innerText = letter;
        button.id = `btn-${letter}`;
        button.addEventListener("click", () => handleGuess(letter));
        keyboardDiv.appendChild(button);
    }
}

function startNewGame() {

    GameState.mistakes = 0;
    GameState.guessedLetters = [];
    GameState.isGameOver = false;
    
    const randomIndex = Math.floor(Math.random() * GameState.wordList.length);
    GameState.currentWord = GameState.wordList[randomIndex].word.toLowerCase();
    GameState.currentHint = GameState.wordList[randomIndex].hint;

    hangmanImg.src = `images/hangman-0.png`;
    hintDisplay.innerText = `Hint: ${GameState.currentHint}`;
    mistakesDisplay.innerText = GameState.mistakes;
    modal.style.display = "none";
    
    
    const buttons = keyboardDiv.querySelectorAll("button");
    buttons.forEach(btn => btn.disabled = false);

    updateWordDisplay();
}

function updateWordDisplay() {
    let display = "";
    for (const char of GameState.currentWord) {
        if (GameState.guessedLetters.includes(char)) {
            display += char;
        } else {
            display += "_";
        }
    }
    wordDisplay.innerText = display;

    checkWinCondition(display);
}

function handleGuess(letter) {
    if (GameState.isGameOver) return;
    document.getElementById(`btn-${letter}`).disabled = true;
    GameState.guessedLetters.push(letter);
    if (GameState.currentWord.includes(letter)) {
        updateWordDisplay();
    } else {
        GameState.mistakes++;
        mistakesDisplay.innerText = GameState.mistakes;
        hangmanImg.src = `images/hangman-${GameState.mistakes}.png`;
        checkLossCondition();
    }
}

function checkWinCondition(currentDisplay) {
    if (!currentDisplay.includes("_")) {
        endGame(true);
    }
}

function checkLossCondition() {
    if (GameState.mistakes >= GameState.maxMistakes) {
        endGame(false);
    }
}

function endGame(isWin) {
    GameState.isGameOver = true;
    

    const buttons = keyboardDiv.querySelectorAll("button");
    buttons.forEach(btn => btn.disabled = true);

    if (isWin) {
        resultTitle.innerText = "You Won!";
        resultTitle.style.color = "#18bc9c";
    } else {
        resultTitle.innerText = "You Lost!";
        resultTitle.style.color = "#e74c3c";
    }
    
    resultText.innerText = `The word was: ${GameState.currentWord}`;
    

    animateFadeIn(modal);
}

function animateFadeIn(element) {
    let opacity = 0;
    element.style.display = "flex";
    element.style.opacity = opacity;

    const timer = setInterval(() => {
        if (opacity >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = opacity;
        opacity += 0.05;
    }, 20);
}

playAgainBtn.addEventListener("click", startNewGame);

loadGameData();