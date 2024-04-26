// GameBoard module

// Cell factory function
const createCell = () => {
  let value = 0;

  // Add a player's selection to the cell
  const addSelection = (player) => (value = player);

  // Get the current value of the cell
  const getValue = () => value;

  return { addSelection, getValue };
};

const GameBoard = (function () {
  const cellCount = 9;
  const board = [];

  // Initialize the board with cells
  for (let i = 0; i < cellCount; i++) {
    board[i] = createCell();
  }

  // Get the current board
  const getBoard = () => board;

  const resetBoard = () => {
    board.forEach((cell) => cell.addSelection(0));
  };

  // Select a cell with the provided index for the given player
  const selectCell = (i, player) => {
    if (board[i].getValue() !== 0) return;
    board[i].addSelection(player);
  };

  // Print the board with cell values
  const printBoard = () => {
    const boardWithCellValues = board.map((cell) => cell.getValue());
    return boardWithCellValues;
  };

  return { getBoard, selectCell, printBoard, resetBoard };
})();

// GameController module
const GameController = (function (player1 = "Player 1", player2 = "Player 2") {
  const board = GameBoard;
  const players = [
    {
      name: player1,
      token: 1,
    },
    {
      name: player2,
      token: 2,
    },
  ];

  let activePlayer = players[0];

  // Switch the active player
  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  // Get the active player
  const getActivePlayer = () => activePlayer;

  // Print the new round information
  const printNewRound = () => {
    board.printBoard();
    // console.log(`It is ${getActivePlayer().name}'s turn`);
    // console.log(board.printBoard());
  };

  const checkWinner = () => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const filteredIndex = board.printBoard().reduce((result, value, index) => {
      if (value === getActivePlayer().token) {
        result.push(index);
      }
      return result;
    }, []);

    const isWinningCombo = winningCombos.some((winningCombo) =>
      winningCombo.every((value) => filteredIndex.includes(value))
    );
    return isWinningCombo;
  };

  const checkGameState = () => {
    let gameState = "";
    if (checkWinner()) {
      gameState = "Win";
    } else if (!board.printBoard().includes(0)) {
      gameState = "Tie";
    }
    return gameState;
  };

  // Play a round by selecting a cell and switching players
  const playRound = (index) => {
    board.selectCell(index, getActivePlayer().token);
    checkWinner();
    if (checkGameState() === "") {
      switchPlayer();
      printNewRound();
    } else {
      printNewRound();
    }
  };

  printNewRound();
  return {
    playRound,
    switchPlayer,
    getActivePlayer,
    checkWinner,
    checkGameState,
    getBoard: board.getBoard,
  };
})();

// ScreenController module
const ScreenController = (function () {
  const game = GameController;
  const boardDiv = document.querySelector(".board");
  const restartBtn = document.querySelector(".btn-restart");
  const message = document.querySelector(".message");
  const board = GameBoard;

  // Update the screen with the current board state
  const updateScreen = () => {
    boardDiv.textContent = "";
    const getBoard = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // Create cell buttons and display the cell values
    getBoard.forEach((cell, index) => {
      const cellButton = document.createElement("button");
      cellButton.classList.add("cell");
      cellButton.dataset.cell = index;
      if (cell.getValue() === 1) {
        cellButton.textContent = "X";
        cellButton.disabled = true;
      }
      if (cell.getValue() === 2) {
        cellButton.textContent = "O";
        cellButton.disabled = true;
      }

      if (cell.getValue() === 0) cellButton.textContent = " ";

      boardDiv.appendChild(cellButton);
    });

    // Update the message with the active player's turn
    message.textContent = `${activePlayer.name}'s turn...`;
    if (game.checkGameState() === "Win") {
      message.textContent = `${activePlayer.name} Win`;
      // Disable cell buttons
      const cellButtons = document.querySelectorAll(".cell");
      cellButtons.forEach((button) => {
        button.disabled = true;
      });
    }
  };

  // Restart Game
  const restart = () => {
    board.resetBoard();
    updateScreen();
    if (!game.getActivePlayer[0]) game.getActivePlayer[0];
    message.textContent = "Please Select";
  };

  function clickHandlerButton(e) {
    const selectedCell = e.target.dataset.cell;
    if (!selectedCell) return;
    // Trigger a round when a cell button is clicked
    game.playRound(selectedCell);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerButton);
  restartBtn.addEventListener("click", restart);

  updateScreen();
})();
