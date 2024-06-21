// I feel like I have no idea what I am doing with CSS and how to organize it
// Am I allowed to IIFE within an IIFE?

const Game = (function () {
  let gameboard = createGameboard(3, 3);
  let player1;
  let player2;

  const getGameboard = () => gameboard;

  const resetGameboard = () => {
    gameboard = createGameboard(3, 3);
  };

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

  return {
    getGameboard,
    resetGameboard,
    getPlayer1,
    getPlayer2,
    getWhosTurn,
    changeTurn,
    addPlayers,
    checkWinner,
    checkFullGrid,
  };
})();

const Display = (function () {
  const displayText = document.querySelector(".display-text");
  const gameboardBlocks = document.querySelectorAll(".gameboard-block");
  const newGameButton = document.querySelector(".new-game");

  newGameButton.addEventListener("click", () => {
    Game.resetGameboard();
    updateBoard();
  });

  const addBlockListeners = function () {
    gameboardBlocks.forEach((block) => {
      block.addEventListener("click", () => {
        const row = block.dataset.row;
        const col = block.dataset.col;
        const gameboard = Game.getGameboard();
        if (!gameboard[row][col].isOccupied()) {
          gameboard[row][col].setOccupied(true);
          gameboard[row][col].setOccupiedBy(Game.getWhosTurn());
          updateBoard();

          const winner = Game.checkWinner();
          const fullGrid = Game.checkFullGrid();
          if (!winner && !fullGrid) {
            Game.changeTurn();
            displayTurn();
          } else {
            if (winner) changeDisplayText(`${winner.getName()} wins!`);
            else if (fullGrid) changeDisplayText("Game is a tie!");
          }
        }
      });
    });
  };

  const updateBoard = function () {
    const gameboard = Game.getGameboard();
    for (let i = 0; i < gameboard.length; i++) {
      for (let j = 0; j < gameboard[i].length; j++) {
        if (gameboard[i][j].isOccupied()) {
          const gameboardBlock = document.querySelector(
            `.gameboard-block[data-row="${i}"][data-col="${j}"]`
          );
          gameboardBlock.textContent = gameboard[i][j]
            .getOccupiedBy()
            .getSymbol();
        }
      }
    }
  };

  const displayTurn = function () {
    const player = Game.getWhosTurn();
    changeDisplayText(`${player.getName()}'s Turn`);
  };

  const changeDisplayText = function (text) {
    displayText.textContent = text;
  };

  return { addBlockListeners, updateBoard, displayTurn, changeDisplayText };
})();

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

// return undefined for no win
// return symbol for win
function checkRow(gameboard) {
  for (let i = 0; i < gameboard.length; i++) {
    for (let j = 1; j < gameboard[i].length; j++) {
      if (
        !gameboard[i][j].isOccupied() ||
        gameboard[i][j - 1].getOccupiedBy() != gameboard[i][j].getOccupiedBy()
      ) {
        break;
      }
      if (j == gameboard[i].length - 1) return gameboard[i][j].getOccupiedBy();
    }
  }
  return;
}

function checkColumn(gameboard) {
  for (let j = 0; j < gameboard[0].length; j++) {
    for (let i = 1; i < gameboard.length; i++) {
      if (
        !gameboard[i][j].isOccupied() ||
        gameboard[i - 1][j].getOccupiedBy() != gameboard[i][j].getOccupiedBy()
      ) {
        break;
      }
      if (i == gameboard[0].length - 1) return gameboard[i][j].getOccupiedBy();
    }
  }
  return;
}

function checkDiagonal(gameboard) {
  for (let i = 1; i < gameboard.length; i++) {
    if (
      !gameboard[i][i].isOccupied() ||
      gameboard[i - 1][i - 1].getOccupiedBy() != gameboard[i][i].getOccupiedBy()
    ) {
      break;
    }
    if (i == gameboard.length - 1) return gameboard[i][i].getOccupiedBy();
  }
  for (let i = 1; i < gameboard.length; i++) {
    const colIdx = gameboard.length - i - 1;
    if (
      !gameboard[i][colIdx].isOccupied() ||
      gameboard[i - 1][colIdx + 1].getOccupiedBy() !=
        gameboard[i][colIdx].getOccupiedBy()
    ) {
      break;
    }
    if (i == gameboard.length - 1) return gameboard[i][colIdx].getOccupiedBy();
  }
  return;
}

function main() {
  Game.addPlayers();
  Display.addBlockListeners();
}

main();
