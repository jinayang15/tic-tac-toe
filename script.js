const Game = (function () {
  const gameboard = createGameboard(3, 3);
  let player1;
  let player2;

  const displayBoard = function () {
    console.log("Current Board");
    for (let i = 0; i < gameboard.length; i++) {
      let row = "";
      for (let j = 0; j < gameboard[0].length; j++) {
        if (gameboard[i][j].isOccupied()) {
          row += gameboard[i][j].getOccupiedBy().getSymbol();
        } else {
          row += " ";
        }
        row += "|";
      }
      row = row.slice(0, -1);
      console.log(row);
      if (i < gameboard.length - 1) {
        console.log("-----");
      }
    }
  };

  const playTurn = function () {
    let player;
    if (player1.isTurn()) player = player1;
    else player = player2;

    console.log(`${player.getName()}'s Turn`);

    let row = Number(prompt("Please enter the row: "));
    let col = Number(prompt("Please enter the column: "));
    while (gameboard[row][col].isOccupied()) {
      console.log("That spot is occupied!");
      row = Number(prompt("Please enter the row: "));
      col = Number(prompt("Please enter the column: "));
    }
    gameboard[row][col].setOccupied(true);
    gameboard[row][col].setOccupiedBy(player);
    changeTurn();
  };

  const changeTurn = function () {
    player1.setTurn(!player1.isTurn());
    player2.setTurn(!player2.isTurn());
  };

  const addPlayers = function () {
    const player1Name = prompt("Please enter player 1 name: ");
    const player1Symbol = prompt("Please enter player 1 symbol: ");
    const player2Name = prompt("Please enter player 2 name: ");
    const player2Symbol = prompt("Please enter player 2 symbol: ");
    player1 = createPlayer(player1Name, player1Symbol);
    player2 = createPlayer(player2Name, player2Symbol);
    player1.setTurn(true);
  };

  const checkWinner = function () {
    const winner =
      checkRow(gameboard) || checkColumn(gameboard) || checkDiagonal(gameboard);
    return winner;
  };

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
    displayBoard,
    playTurn,
    changeTurn,
    addPlayers,
    checkWinner,
    checkFullGrid,
  };
})();

function createGameboard(rows, cols) {
  const gameboard = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(createBlock());
    }
    gameboard.push(row);
  }
  return gameboard;
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

function createBlock() {
  let occupied = false; // bool
  let occupiedBy; // Player
  const isOccupied = () => occupied;
  const setOccupied = function (bool) {
    occupied = bool;
  };
  const getOccupiedBy = () => occupiedBy;
  const setOccupiedBy = function (player) {
    occupiedBy = player;
  };

  return {
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

function main() {
  Game.addPlayers();
  let winner = Game.checkWinner();
  let fullGrid = Game.checkFullGrid();
  
  while (!winner && !fullGrid) {
    Game.displayBoard();
    Game.playTurn();
    winner = Game.checkWinner();
    fullGrid = Game.checkFullGrid();
  }
  Game.displayBoard();

  if (winner) console.log(`${winner.getName()} wins!`);
  else if (fullGrid) console.log("Game is a tie!");
}

main();
