const turn = document.getElementById("turn");
const container = document.querySelector(".container");
const startScreen = document.querySelector(".startScreen");
const start = document.getElementById("start");
const message = document.getElementById("message");

let matrix = [
  [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
];
//matrix dimensions

let player;
const generateRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

const verifyArray = (arrayElement) => {
  let bool = false;
  let elementCount = 0;
  arrayElement.forEach((element, index) => {
    if (element == player) {
      elementCount += 1;
      if (elementCount == 3) {
        bool = true;
      }
    } else {
      elementCount = 0;
    }
  });
  return bool;
};

const gameOverCheck = () => {
  let truthCount = 0;
  for (let innerArray of matrix) {
    if (innerArray.every((val) => val != 0)) {
      truthCount += 1;
    } else {
      return false;
    }
  }
  if (truthCount == 6) {
    message.innerText = "Game Over";
    startScreen.classList.remove("hide");
  }
};
//game over

const checkAdjacentRowValues = (row) => {
  return verifyArray(matrix[row]);
};

const checkAdjacentColumnValues = (column) => {
  let colWinCount = 0,
    colWinBool = false;
  matrix.forEach((element, index) => {
    if (element[column] == player) {
      colWinCount += 1;
      if (colWinCount == 3) {
        colWinBool = true;
      }
    } else {
      colWinCount = 0;
    }
  });
  return colWinBool;
};
//columns and rows

const getRightDiagonal = (row, column, rowLength, columnLength) => {
  let rowCount = row;
  let columnCount = column;
  let rightDiagonal = [];
  while (rowCount > 0) {
    if (columnCount >= columnLength - 1) {
      break;
    }
    rowCount -= 1;
    columnCount += 1;
    rightDiagonal.unshift(matrix[rowCount][columnCount]);
  }
  rowCount = row;
  columnCount = column;
  while (rowCount < rowLength) {
    if (columnCount < 0) {
      break;
    }
    rightDiagonal.push(matrix[rowCount][columnCount]);
    rowCount += 1;
    columnCount -= 1;
  }
  return rightDiagonal;
};
const getLeftDiagonal = (row, column, rowLength, columnLength) => {
  let rowCount = row;
  let columnCount = column;
  let leftDiagonal = [];
  while (rowCount > 0) {
    if (columnCount <= 0) {
      break;
    }
    rowCount -= 1;
    columnCount -= 1;
    leftDiagonal.unshift(matrix[rowCount][columnCount]);
  }
  rowCount = row;
  columnCount = column;
  while (rowCount < rowLength) {
    if (columnCount >= columnLength) {
      break;
    }
    leftDiagonal.push(matrix[rowCount][columnCount]);
    rowCount += 1;
    columnCount += 1;
  }
  return leftDiagonal;
};

const checkAdjacentDiagonalValues = (row, column) => {
  let diagWinBool = false;
  let tempChecks = {
    leftTop: [],
    rightTop: [],
  };
  let columnLength = matrix[row].length;
  let rowLength = matrix.length;
  //check diagonal
  tempChecks.leftTop = [
    ...getLeftDiagonal(row, column, rowLength, columnLength),
  ];
  tempChecks.rightTop = [
    ...getRightDiagonal(row, column, rowLength, columnLength),
  ];
  //store diagonals
  diagWinBool = verifyArray(tempChecks.rightTop);
  if (!diagWinBool) {
    diagWinBool = verifyArray(tempChecks.leftTop);
  }
  return diagWinBool;
};
const winCheck = (row, column) => {
  return checkAdjacentRowValues(row)
    ? true
    : checkAdjacentColumnValues(column)
    ? true
    : checkAdjacentDiagonalValues(row, column)
    ? true
    : false;
};
//win condition
const setPiece = (startCount, colValue) => {
  let rows = document.querySelectorAll(".grid-row");
  //condition so it places the symbol first in last row, then check until an empty slot
  if (matrix[startCount][colValue] != 0) {
    startCount -= 1;
    setPiece(startCount, colValue);
  } else {
    let currentRow = rows[startCount].querySelectorAll(".grid-box");
    currentRow[colValue].classList.add("filled", `player${player}`);
    //place symbol
    matrix[startCount][colValue] = player;
    if (winCheck(startCount, colValue)) {
      message.innerHTML = `Player<span>${player}</span> wins`;
      startScreen.classList.remove("hide");
      start.innerHTML = "Restart";
      return false;
    }
  }
  //checks for winning
  gameOverCheck();
};
//when full
const fillBox = (e) => {
  let colValue = parseInt(e.target.getAttribute("data-value"));

  //5 because no. of rows, and it counts from 0
  setPiece(5, colValue);
  player = player == 1 ? 2 : 1;
  turn.innerHTML = `Player <span>${player}</span>`;
};
//Create Matrix
const matrixCreator = () => {
  for (let innerArray in matrix) {
    let outerDiv = document.createElement("div");
    outerDiv.classList.add("grid-row");
    outerDiv.setAttribute("data-value", innerArray);
    for (let j in matrix[innerArray]) {
      matrix[innerArray][j] = [0];
      let innerDiv = document.createElement("div");
      innerDiv.classList.add("grid-box");
      innerDiv.setAttribute("data-value", j);
      innerDiv.addEventListener("click", (e) => {
        fillBox(e);
      });
      outerDiv.appendChild(innerDiv);
    }
    container.appendChild(outerDiv);
  }
};
window.onload = startGame = async () => {
  player = generateRandomNumber(1, 2);
  container.innerHTML = "";
  await matrixCreator();
  turn.innerHTML = `Player <span>${player}</span>`;
};
start.addEventListener("click", () => {
  startScreen.classList.add("hide");
  startGame();
});
