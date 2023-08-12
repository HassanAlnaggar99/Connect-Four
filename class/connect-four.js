const Screen = require("./screen");
const Cursor = require("./cursor");

class ConnectFour {

  constructor() {

    this.playerTurn = "O";

    this.grid = [[' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' ']]

    this.cursor = new Cursor(6, 7);

    // Initialize a 6x7 connect-four grid
    Screen.initialize(6, 7);
    Screen.setGridlines(true);

    // Replace this with real commands
    // Screen.addCommand('t', 'test command (remove)', ConnectFour.testCommand);
    Screen.addCommand('u', 'move cursor up', this.cursor.up);
    Screen.addCommand('d', 'move cursor down', this.cursor.down);
    Screen.addCommand('r', 'move cursor right', this.cursor.right);
    Screen.addCommand('l', 'move cursor left', this.cursor.left);
    Screen.addCommand('m', 'mark the current cursor position', ConnectFour.makePlay);

    this.cursor.setBackgroundColor();
    Screen.render();
  }

/*   // Remove this
  static testCommand() {
    console.log("TEST COMMAND");
  } */

  makePlay = () => {
    Screen.setGrid(this.cursor.row, this.cursor.col, this.playerTurn);
    this.grid[this.cursor.row][this.cursor.col] = this.playerTurn;
    this.playerTurn = this.playerTurn === 'O' ? 'X' : 'O';

    const gameState = ConnectFour.checkWin(this.grid);
    if (gameState) {
      ConnectFour.endGame(gameState);
    }
  }

  static checkHorz(grid) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length - 3; j++) {
        if (grid[i][j] !== ' ' && grid[i][j] === grid[i][j+1] && grid[i][j+1] === grid[i][j+2] && grid[i][j+2] === grid[i][j+3]) {
          return grid[i][j];
        }
      }
    }
    return false;
  }

  static checkVert(grid) {
    for (let j = 0; j < grid[0].length; j++) {
      for (let i = 0; i < grid.length - 3; i++) {
        if (grid[i][j] !== ' ' && grid[i][j] === grid[i+1][j] && grid[i+1][j] === grid[i+2][j] && grid[i+2][j] === grid[i+3][j]) {
          return grid[i][j];
        }
      }
    }
    return false;
  }

  static diagScannerDown(grid, rowStart, colStart) {
    let i = rowStart, j = colStart;
    let numRows = grid.length, numCols = grid[0].length;
    let numElements = Math.min(numRows - rowStart, numCols-colStart);
    while (numElements >= 4) {
      if (grid[i][j] !== ' ' && grid[i][j] === grid[i+1][j+1] && grid[i+1][j+1] === grid[i+2][j+2] && grid[i+2][j+2] === grid[i+3][j+3]) {
        return grid[i][j];
      }
      // console.log(`i: ${i}, j: ${j}, grid[i][j]: ${grid[i][j]}`);
      i++; j++; numElements--;
    }
    return false;
  }

  static diagScannerUp(grid, rowStart, colStart) {
    let i = rowStart, j = colStart;
    let numRows = grid.length, numCols = grid[0].length;
    // let numElements = rowStart - colStart + 1;
    let numElements = Math.min(rowStart - 0 + 1, numCols-colStart);
    while (numElements >= 4) {
      if (grid[i][j] !== ' ' && grid[i][j] === grid[i-1][j+1] && grid[i-1][j+1] === grid[i-2][j+2] && grid[i-2][j+2] === grid[i-3][j+3]) {
        return grid[i][j];
      }
      // console.log(`i: ${i}, j: ${j}, grid[i][j]: ${grid[i][j]}`);
      i--; j++; numElements--;
    }
    return false;
  }

  static checkDiag(grid) {
    let numRows = grid.length, numCols = grid[0].length;
    let temp;
    for (let j = 0; j < numCols; j++) {
      temp = this.diagScannerDown(grid, 0, j);
      if (temp) {
        return temp;
      }
    }
    // console.log("finished loop 1");
    for (let i = 1; i < numRows; i++) {
      temp = this.diagScannerDown(grid, i, 0);
      if (temp) {
        return temp;
      }
    }
    // console.log("finished loop 2");
    for (let j = 0; j < numCols; j++) {
      temp = this.diagScannerUp(grid, numRows-1, j);
      if (temp) {
        return temp;
      }
    }
    // console.log("finished loop 3");
    for (let i = numRows-2; i >= 0; i--) {
      temp = this.diagScannerUp(grid, i, 0);
      if (temp) {
        return temp;
      }
    }
    // console.log("finished loop 4");
    return false;
  }

  static checkEnd(grid) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length - 3; j++) {
        if (grid[i][j] === ' ') {
          return false;
        }
      }
    }
    return true;
  }

  static checkWin(grid) {

    // Return 'X' if player X wins
    // Return 'O' if player O wins
    // Return 'T' if the game is a tie
    // Return false if the game has not ended

    const horzWinner = this.checkHorz(grid);
    if (horzWinner) {
      return horzWinner;
    }
    const vertWinner = this.checkVert(grid);
    if (vertWinner) {
      return vertWinner;
    }
    const diagWinner = this.checkDiag(grid);
    if (diagWinner) {
      return diagWinner;
    }
    const gameEnded = this.checkEnd(grid);
    if (gameEnded) {
      return 'T';
    } else {
      return false;
    }
  }

  static endGame(winner) {
    if (winner === 'O' || winner === 'X') {
      Screen.setMessage(`Player ${winner} wins!`);
    } else if (winner === 'T') {
      Screen.setMessage(`Tie game!`);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }

}

/* let grid = [[' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ','O'],
            [' ',' ',' ',' ',' ','O',' '],
            [' ',' ',' ',' ','O',' ',' '],
            [' ',' ',' ','O',' ',' ',' ']]
console.log(ConnectFour.checkWin(grid)); */
/*
grid = [[' ',' ',' ',' ',' ',' ',' '],
[' ',' ',' ',' ',' ',' ',' '],
['O',' ',' ',' ',' ',' ',' '],
['O',' ',' ',' ',' ',' ',' '],
['O',' ',' ',' ',' ',' ',' '],
['O',' ',' ',' ',' ',' ',' ']]
console.log(ConnectFour.checkWin(grid));

grid = [[' ',' ',' ',' ',' ',' ',' '],
[' ',' ',' ',' ',' ',' ',' '],
[' ',' ','X',' ',' ',' ',' '],
[' ',' ',' ','X',' ',' ',' '],
[' ',' ',' ',' ','X',' ',' '],
[' ',' ',' ',' ',' ','X',' ']]
console.log(ConnectFour.checkWin(grid));

grid = [['X','O','X','O','X','O','X'],
        ['X','O','X','O','X','O','X'],
        ['O','X','O','X','O','X','O'],
        ['O','X','O','X','O','X','O'],
        ['O','X','O','X','O','X','O'],
        ['X','O','X','O','X','O','X']]
console.log(ConnectFour.checkWin(grid));

grid = [[' ',' ',' ',' ',' ',' ',' '],
[' ',' ',' ',' ',' ',' ',' '],
[' ',' ',' ',' ',' ',' ',' '],
[' ',' ',' ',' ',' ',' ',' '],
[' ',' ',' ',' ',' ',' ',' '],
[' ',' ',' ',' ',' ',' ',' ']]
console.log(ConnectFour.checkWin(grid));

grid = [['X','O','X','O',' ',' ',' '],
        ['O','X','O','X','O',' ',' '],
        ['X','O','X','O','X','O',' '],
        [' ','X','O','X','O','X','O'],
        [' ',' ','X','O','X','O','X'],
        [' ',' ',' ','X','O','X','O']]
console.log(ConnectFour.checkDiag(grid));

grid = [['X','O','X','O',' ','A',' '],
        ['O','X','O','X','A',' ',' '],
        ['X','O','X','A','X','O',' '],
        [' ','X','A','X','O','X','O'],
        [' ','A','X','O','X','O','X'],
        ['A',' ',' ','X','O','X','O']]

grid = [['X','O','X',' ',' ','a '],
        ['O','X','O','X','a ','b '],
        ['X','O','X','aO','bX',' '],
        [' ','X','aO','bX','O','X'],
        [' ','a ','bX','O','X','O'],
        ['a ','b ',' ','X','O','X']]

grid = [['X','O',' ',' ',' '],
        ['O','X','O',' ',' '],
        [' ','O','X','O',' '],
        [' ',' ','O','X','O'],
        [' ',' ',' ','O','X'],]

grid = [['X',' ',' ',' '],
        [' ','X',' ',' '],
        [' ',' ','X',' '],
        [' ',' ',' ','X'],] */


module.exports = ConnectFour;
