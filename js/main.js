//Tic-tac-toe

//DECLARE GLOBAL VARIABLES
const cellArray = document.querySelectorAll('.cell');   //Array.from is a method that converts an array-like object (like a nodelist) into an array
const playerTurnNode = document.querySelector('.playerTurn');
let currentPlayer = 'X';
let xScore = 0;
let oScore = 0;
let roundsPlayed = 1;
const xScoreNode = document.querySelector('#xScore');
const oScoreNode = document.querySelector('#oScore');

let board = ['', '', '', '', '', '', '', '', ''];
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

//PART 1: MVP -------------------------------------------------------

//Function that tells the game what to do when the player clicks a cell
const playerClickEvents = function (cell, index) {
    if (!checkValid(cell)) {
        return;
    }
    assignCellToPlayer(cell, index);
    cell.innerText = currentPlayer;
    gameEndEvents(checkWin());
    switchPlayer();
}
//Add event listeners to each cell
cellArray.forEach( function (cell, index) {
    cell.addEventListener('click', function () {
        playerClickEvents(cell, index);
    });
});


//Function that checks if a given cell can be assigned a value or not
const checkValid = function (cell) {
    let isValid = true;
    if (cell.className === 'cell resetting' || cell.className === 'cell playerX resetting' || cell.className === 'cell playerO resetting' || cell.className === 'cell playerX' || cell.className === 'cell playerO') {
        isValid = false;
    }   //This is horrible, why have I done this?
    return isValid;
}

//Function that assigns a clicked cell to the player that clicked it
const assignCellToPlayer = function (cell, boardIndex) {
    cell.classList.remove(`player${currentPlayer}`);
    board[boardIndex] = currentPlayer;
    cell.classList.add(`player${currentPlayer}`);
}

//Function that changes the player's turn
const switchPlayer = function () {
    currentPlayer = currentPlayer === 'X' ? 'O': 'X';
    playerTurnNode.className = playerTurnNode.className === 'playerTurn playerX' ? 'playerTurn playerO' : 'playerTurn playerX';
    playerTurnNode.innerText = `Player ${currentPlayer}'s Turn.`;
}

//Function that checks if the game has been 'win' or 'tied'
const checkWin = function () {
    let currentPlayerCellIndexes = [];

    //loop through the board array, pushing the indexes of the currentPlayer's cells into currentPlayerCellIndexes
    for (let i = 0; i < board.length; i ++) {
        if (board[i] === currentPlayer) {
            currentPlayerCellIndexes.push(i);
        }
    }
    //loop through the winningIndexes array, checking if currentPlayerCellIndexes contains any of the winning combinations
    for (let i = 0; i < winningIndexes.length; i++) {
        let a = winningIndexes[i][0];
        let b = winningIndexes[i][1];
        let c = winningIndexes[i][2];

        if (currentPlayerCellIndexes.includes(a) && currentPlayerCellIndexes.includes(b) && currentPlayerCellIndexes.includes(c)) {
            if (currentPlayer === "X") {
                xScore ++;
                roundsPlayed++;
                xScoreNode.innerText = `Player 1 Score: ${xScore}`;


            } else {
                oScore ++;
                roundsPlayed++;
                oScoreNode.innerText = `Player 2 Score: ${oScore}`;

            }
            return 'win';
        }
    }

    if (!board.includes('')) {
        return 'tie';
    } else {
        return false;   //reflects the state where game hasn't ended
    }

}

//Function that tells the game what to do when the game ends
const gameEndEvents = function (checkWin) {
    if (!checkWin) {
        return; //If game hasn't ended, do nothing and return out of this function
    } 
    
    if (checkWin === 'win') {
        console.log(`Game Won By Player ${currentPlayer}!`);
    } else if (checkWin === 'tie') {
        console.log('The game has been tied!');
    }
    initialiseBoard();
}

//Function that resets the game board when a round is won or tied
const initialiseBoard = function () {
    
    cellArray.forEach (function (cell) {
        
        cell.classList.add('resetting')
    })
    
    setTimeout(function () {
        board = ['', '', '', '', '', '', '', '', ''];
        cellArray.forEach( function (cell) {
            cell.innerText = '';
            cell.classList.remove('playerX');
            cell.classList.remove('playerO');
            cell.classList.remove('resetting');
        });
    }, 1000)
}
//Function that does a hard reset of the game board
const hardInitialiseBoard = function () {
    initialiseBoard ();
    xScore = 0;
    oScore = 0;
    roundsPlayed = 1;
    xScoreNode.innerText = `Player 1 Score: ${xScore}`;
    oScoreNode.innerText = `Player 2 Score: ${oScore}`;

}


//PART 2: Player Customisation -------------------------------------------


