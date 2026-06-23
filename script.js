// Select page elements
const board = document.getElementById("game-board");
const moveCounter = document.getElementById("move-counter");
const victoryPanel = document.getElementById("victory-panel");
const finalScore = document.getElementById("final-score");
const resetButton = document.getElementById("reset-button");

// Game state variables
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;
let currentDifficulty = "easy";

const difficulties = {
  easy: { label: "Easy", pairs: 6 },
  medium: { label: "Medium", pairs: 8 },
  hard: { label: "Hard", pairs: 10 },
};

// List of emoji icons to use in the game
const emojis = [
  "🦊",
  "🍓",
  "🌈",
  "🚀",
  "🎩",
  "🍕",
  "🐙",
  "🎈",
  "🌟",
  "🍉",
];

// Create shuffled card data with duplicate pairs
function createShuffledCards(pairCount) {
  const selectedEmojis = emojis.slice(0, pairCount);
  const cardEmojis = [...selectedEmojis, ...selectedEmojis];
  for (let i = cardEmojis.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardEmojis[i], cardEmojis[j]] = [cardEmojis[j], cardEmojis[i]];
  }
  return cardEmojis;
}

// Build the board and add cards to the page
function renderBoard() {
  board.innerHTML = "";
  const shuffledCards = createShuffledCards(difficulties[currentDifficulty].pairs);

  shuffledCards.forEach((emoji, index) => {
    const card = document.createElement("button");
    card.classList.add("card");
    card.setAttribute("type", "button");
    card.dataset.emoji = emoji;
    card.dataset.index = index;

    card.innerHTML = `
      <div class="card-face back">?</div>
      <div class="card-face front">${emoji}</div>
    `;

    card.addEventListener("click", handleCardClick);
    board.appendChild(card);
  });
}

// Update the move counter on screen
function updateMoveCounter() {
  moveCounter.textContent = moves;
}

// Reset round state for the next card selection
function resetRound() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Check if all pairs are matched and show victory
function checkForVictory() {
  if (matches === difficulties[currentDifficulty].pairs) {
    victoryPanel.classList.remove("hidden");
    finalScore.textContent = `You finished the game in ${moves} moves.`;
  }
}

// Flip cards back if they do not match
function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetRound();
  }, 1000);
}

// Mark the matching cards and keep them visible
function markMatch() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  firstCard.removeEventListener("click", handleCardClick);
  secondCard.removeEventListener("click", handleCardClick);
  matches += 1;
  resetRound();
  checkForVictory();
}

// Handle clicking a card on the board
function handleCardClick(event) {
  const clickedCard = event.currentTarget;

  if (lockBoard || clickedCard === firstCard || clickedCard.classList.contains("matched")) {
    return;
  }

  clickedCard.classList.add("flipped");

  if (!firstCard) {
    firstCard = clickedCard;
    return;
  }

  secondCard = clickedCard;
  moves += 1;
  updateMoveCounter();

  const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
  if (isMatch) {
    markMatch();
  } else {
    unflipCards();
  }
}

// Start a new game with fresh state
function startGame() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  matches = 0;
  updateMoveCounter();
  victoryPanel.classList.add("hidden");
  renderBoard();
}

function setDifficulty(level) {
  if (!difficulties[level] || currentDifficulty === level) {
    return;
  }

  currentDifficulty = level;
  document.querySelectorAll(".difficulty-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.level === level);
  });
  startGame();
}

document.querySelectorAll(".difficulty-button").forEach((button) => {
  button.addEventListener("click", () => setDifficulty(button.dataset.level));
});

resetButton.addEventListener("click", startGame);

// Initialize the game when the page loads
startGame();
