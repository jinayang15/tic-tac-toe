// I feel like I have no idea what I am doing with CSS and how to organize it

// Game object
// in charge of game functions
const Game = (function () {
  let gameboard;
  let player1;
  let player2;

  const newGame = () => {
    gameboard = createGameboard(3, 3);
    Game.addPlayers();
    Display.removeWin();
    Display.addBlockListeners();
    Display.updateBoard();
    Display.displayTurn();
  };

  const getGameboard = () => gameboard;

  const getPlayer1 = () => player1;
  const getPlayer2 = () => player2;

  const getWhosTurn = () => {
    if (player1.isTurn()) return player1;
    return player2;
  };

  const changeTurn = function () {
    player1.setTurn(!player1.isTurn());
    player2.setTurn(!player2.isTurn());
  };

  const addPlayers = function () {
    // const player1Name = prompt("Please enter player 1 name: ");
    // const player1Symbol = prompt("Please enter player 1 symbol: ");
    // const player2Name = prompt("Please enter player 2 name: ");
    // const player2Symbol = prompt("Please enter player 2 symbol: ");
    player1 = createPlayer("Player 1", "X");
    player2 = createPlayer("Player 2", "O");
    player1.setTurn(true);
  };

  // checks for a winner
  const checkWinner = function () {
    const winner =
      checkRow(gameboard) || checkColumn(gameboard) || checkDiagonal(gameboard);
    return winner;
  };

  // checks if grid is full
  const checkFullGrid = function () {
    for (let i = 0; i < gameboard.length; i++) {
      for (let j = 0; j < gameboard[i].length; j++) {
        if (!gameboard[i][j].isOccupied()) {
          return false;
        }
      }
    }
    return true;
  };

  const checkGameEnd = function () {
    const winner = Game.checkWinner();
    const fullGrid = Game.checkFullGrid();
    return winner || fullGrid;
  };

  return {
    newGame,
    getGameboard,
    getPlayer1,
    getPlayer2,
    getWhosTurn,
    changeTurn,
    addPlayers,
    checkWinner,
    checkFullGrid,
    checkGameEnd,
  };
})();

// Display object
// controls all the display related functions
const Display = (function () {
  const displayText = document.querySelector(".display-text");
  const gameboardBlocks = document.querySelectorAll(".gameboard-block");
  const newGameButton = document.querySelector(".new-game.button");

  newGameButton.addEventListener("click", Game.newGame);

  const addBlockListeners = function () {
    gameboardBlocks.forEach((block) => {
      block.addEventListener("click", () => {
        const row = block.dataset.row;
        const col = block.dataset.col;
        const gameboard = Game.getGameboard();
        if (!gameboard[row][col].isOccupied() && !Game.checkGameEnd()) {
          gameboard[row][col].setOccupied(true);
          gameboard[row][col].setOccupiedBy(Game.getWhosTurn());
          updateBoard();

          const winner = Game.checkWinner();
          const fullGrid = Game.checkFullGrid();
          if (!winner && !fullGrid) {
            Game.changeTurn();
            displayTurn();
          } else {
            if (winner) {
              changeDisplayText(`${winner.getWinner().getName()} wins!`);
              displayWin(winner);
            } else if (fullGrid) changeDisplayText("Game is a tie!");
          }
        }
      });
    });
  };

  const updateBoard = function () {
    const gameboard = Game.getGameboard();
    for (let i = 0; i < gameboard.length; i++) {
      for (let j = 0; j < gameboard[i].length; j++) {
        const gameboardBlock = document.querySelector(
          `.gameboard-block[data-row="${i}"][data-col="${j}"]`
        );
        if (gameboard[i][j].isOccupied()) {
          gameboardBlock.textContent = gameboard[i][j]
            .getOccupiedBy()
            .getSymbol();
        } else {
          gameboardBlock.textContent = "";
        }
      }
    }
  };

  const displayTurn = function () {
    const player = Game.getWhosTurn();
    changeDisplayText(`${player.getName()}'s Turn`);
  };

  const displayWin = function (winner) {
    if (winner) {
      const winBlocks = winner.getWinBlocks();
      winBlocks.forEach((block) => {
        const gameboardBlock = document.querySelector(
          `.gameboard-block[data-row="${block.getRow()}"][data-col="${block.getCol()}"]`
        );
        gameboardBlock.classList.add("winning");
      });
    }
  };

  const removeWin = function () {
    const gameboardBlocks = document.querySelectorAll(".gameboard-block");
    gameboardBlocks.forEach((block) => {
      block.classList.remove("winning");
    });
  };

  const changeDisplayText = function (text) {
    displayText.textContent = text;
  };

  return {
    addBlockListeners,
    updateBoard,
    displayTurn,
    displayWin,
    removeWin,
    changeDisplayText,
  };
})();

// creates a gameboard (2D array of Block objects)
// Number rows, Number cols
function createGameboard(rows, cols) {
  const gameboard = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(createBlock(i, j));
    }
    gameboard.push(row);
  }
  return gameboard;
}

// Block object factory function
// creates a block object thats stored in the gameboard
// Number row, Number col
function createBlock(row, col) {
  let occupied = false; // bool
  let occupiedBy; // Player
  const getRow = () => row;
  const getCol = () => col;
  const isOccupied = () => occupied;
  const setOccupied = function (bool) {
    occupied = bool;
  };
  const getOccupiedBy = () => occupiedBy;
  const setOccupiedBy = function (player) {
    occupiedBy = player;
  };

  return {
    getRow,
    getCol,
    isOccupied,
    setOccupied,
    getOccupiedBy,
    setOccupiedBy,
  };
}

// Player object factory function
// creates a player for the game
// String name, String symbol
function createPlayer(name, symbol) {
  let turn = false;
  const getName = () => name;
  const getSymbol = () => symbol;
  const isTurn = () => turn;
  const setTurn = function (bool) {
    turn = bool;
  };

  return {
    getName,
    getSymbol,
    isTurn,
    setTurn,
  };
}

// Winner object factory function
// stores player and the winning blocks
// Player player, Array[Block] winBlocks
function createWinner(player, winBlocks) {
  const getWinner = () => player;
  const getWinBlocks = () => winBlocks;
  return {
    getWinner,
    getWinBlocks,
  };
}

// return undefined for no win
// return player for win
function checkRow(gameboard) {
  for (let i = 0; i < gameboard.length; i++) {
    const winBlocks = [gameboard[i][0]];
    for (let j = 1; j < gameboard[i].length; j++) {
      if (
        !gameboard[i][j].isOccupied() ||
        gameboard[i][j - 1].getOccupiedBy() != gameboard[i][j].getOccupiedBy()
      ) {
        break;
      }
      winBlocks.push(gameboard[i][j]);
      if (j == gameboard[i].length - 1) {
        const player = gameboard[i][j].getOccupiedBy();
        return createWinner(player, winBlocks);
      }
    }
  }
  return;
}

// return undefined for no win
// return player for win
function checkColumn(gameboard) {
  for (let j = 0; j < gameboard[0].length; j++) {
    const winBlocks = [gameboard[0][j]];
    for (let i = 1; i < gameboard.length; i++) {
      if (
        !gameboard[i][j].isOccupied() ||
        gameboard[i - 1][j].getOccupiedBy() != gameboard[i][j].getOccupiedBy()
      ) {
        break;
      }
      winBlocks.push(gameboard[i][j]);
      if (i == gameboard[0].length - 1) {
        const player = gameboard[i][j].getOccupiedBy();
        return createWinner(player, winBlocks);
      }
    }
  }
  return;
}

// return undefined for no win
// return player for win
function checkDiagonal(gameboard) {
  for (let i = 1; i < gameboard.length; i++) {
    const winBlocks = [gameboard[0][0]];
    if (
      !gameboard[i][i].isOccupied() ||
      gameboard[i - 1][i - 1].getOccupiedBy() != gameboard[i][i].getOccupiedBy()
    ) {
      break;
    }
    winBlocks.push(gameboard[i][i]);
    if (i == gameboard.length - 1) {
      const player = gameboard[i][i].getOccupiedBy();
      return createWinner(player, winBlocks);
    }
  }
  for (let i = 1; i < gameboard.length; i++) {
    const colIdx = gameboard.length - i - 1;
    const winBlocks = [gameboard[0][gameboard.length - 1]];
    if (
      !gameboard[i][colIdx].isOccupied() ||
      gameboard[i - 1][colIdx + 1].getOccupiedBy() !=
        gameboard[i][colIdx].getOccupiedBy()
    ) {
      break;
    }
    winBlocks.push(gameboard[i][colIdx]);
    if (i == gameboard.length - 1) {
      const player = gameboard[i][colIdx].getOccupiedBy();
      return createWinner(player, winBlocks);
    }
  }
  return;
}

function main() {
  Game.newGame();
}

main();
