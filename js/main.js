//Tic-tac-toe

//DECLARE GLOBAL VARIABLES
const cellArray = Array.from(document.querySelectorAll('.cell'));   //Array.from is a method that converts an array-like object (like a nodelist) into an array
const playerTurnNode = document.querySelector('.playerTurn');
let currentPlayer = 'X';

let board = ['', '', '', '', '', '', '', ''];
    //Board looks like this
    //[0][1][2]
    //[3][4][5]
    //[6][7][8]

const winningIndexes = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6]
]



//DEFINE FUNCTIONS
//Function that handles the flow of the game
const playerClickEvents = function (cell, index) {
    if (!checkValid(cell)) {
        return;
    }
    assignCellToPlayer(index);
    cell.innerText = currentPlayer;
    checkWin();
    switchPlayer();
}



//Function that checks if a given cell can be assigned a value or not
const checkValid = function (cell) {
    const isValid = cell.innerText === '' ? true : false; //expression that sets isValid as true or false depending on whether or not the given cell is empty
    return isValid;
}

//Function that assigns a clicked cell to the player that clicked it
const assignCellToPlayer = function (boardIndex) {
    board[boardIndex] = currentPlayer;
}

//Function that changes the player's turn
const switchPlayer = function () {
    currentPlayer = currentPlayer === 'X' ? '0': 'X';
    playerTurnNode.id = playerTurnNode.id === 'playerX' ? 'playerO' : 'playerX';
    playerTurnNode.innerText = `Player ${currentPlayer}'s Turn.`;
}

//Function that checks if the game has been won or tied
const checkWin = function () {


}

//Add event listeners to each cell
cellArray.forEach( function (cell, index) {
    cell.addEventListener('click', playerClickEvents);
})
