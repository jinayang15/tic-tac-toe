const Game = (function () {
  const gameboard = createGameboard(3, 3);
  let player1;
  let player2;

  
})();

function createGameboard(rows, cols) {
  const gameboard = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(createBlock());
    }
    arr.push(row);
  }
  return gameboard;
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

function main() {}
