let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;
let gameMode = null;

const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");

function setGameMode(mode) {
  gameMode = mode;
  resetGame();
  statusElement.textContent = (mode === "pvp") ? "Player X's turn 🎯" : "You are X, AI is O 🤖";
  gameActive = true;
}

function createBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    if (cell) {
      cellElement.classList.add("taken", cell);
      cellElement.textContent = cell;
    }
    cellElement.addEventListener("click", () => handleCellClick(index));
    boardElement.appendChild(cellElement);
  });
}

function handleCellClick(index) {
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  checkWinner();

  if (gameActive) {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    statusElement.textContent = `Player ${currentPlayer}'s turn 🎮`;
    createBoard();

    if (gameMode === "ai" && currentPlayer === "O") {
      setTimeout(aiMove, 500);
    }
  }
}

function aiMove() {
  const available = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
  const randomIndex = available[Math.floor(Math.random() * available.length)];
  board[randomIndex] = "O";
  checkWinner();

  if (gameActive) {
    currentPlayer = "X";
    statusElement.textContent = "Player X's turn 🎯";
    createBoard();
  }
}

function checkWinner() {
  const winningCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      statusElement.textContent = `🏆 Player ${board[a]} wins!`;
      gameActive = false;
      highlightWinner(combo);
      return;
    }
  }

  if (!board.includes("")) {
    statusElement.textContent = "😮 It's a draw!";
    gameActive = false;
  }
}

function highlightWinner(combo) {
  const cells = document.querySelectorAll(".cell");
  combo.forEach(index => {
    cells[index].classList.add("winner");
  });
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = (gameMode !== null);
  createBoard();
  if (gameMode) {
    statusElement.textContent = (gameMode === "pvp") ? "Player X's turn 🎯" : "You are X, AI is O 🤖";
  } else {
    statusElement.textContent = "✨ Choose a mode to start! ✨";
  }
}

createBoard();
