//Tic-tac-toe

//DECLARE GLOBAL VARIABLES
const cellArray = document.querySelectorAll('.cell');   //Array.from is a method that converts an array-like object (like a nodelist) into an array

const iconArray = document.querySelectorAll('.icon');
let playerXIcon = 'url(images/icons8-bt21-cooky-96.png)';
let playerOIcon = "url(images/icons8-bt21-rj-96.png)";

const gameOverNode = document.querySelector('.gameOver');
const resetButton = document.querySelector('#reset');

const playerTurnNode = document.querySelector('.playerTurn');
let currentPlayer = 'X';
let xScore = 0;
let oScore = 0;
let roundsPlayed = 1;
const xScoreNode = document.querySelector('#xScore');
const oScoreNode = document.querySelector('#oScore');

const gameWonSound = document.querySelector("#gameWonSound");
const invalidInputSound = document.querySelector("#invalidInputSound");
const tieSound = document.querySelector("#tieSound");
const validInputSound = document.querySelector("#validInputSound");

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
        invalidInputSound.play();
        return;
    } else {
        validInputSound.play();
    }
    assignCellToPlayer(cell, index);
    
    gameEndEvents(checkWin());
    switchPlayer();
}
//Add event listeners to each cell
cellArray.forEach( function (cell, index) {
    cell.addEventListener('click', function () {
        playerClickEvents(cell, index);
        console.log("Added Event Listener to ", cell);
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
    cell.style.backgroundImage = currentPlayer === 'X' ? playerXIcon : playerOIcon;

}

//Function that changes the player's turn
const switchPlayer = function () {
    currentPlayer = currentPlayer === 'X' ? 'O': 'X';
    playerTurnNode.className = playerTurnNode.className === 'playerTurn playerX' ? 'playerTurn playerO' : 'playerTurn playerX';
    playerTurnNode.innerText = playerTurnNode.innerText === `Player 1's Turn.` ? `Player 2's Turn.` : `Player 1's Turn.`;
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
        gameOverNode.innerText = currentPlayer === "X" ? 'Player 1 Wins!' : 'Player 2 Wins!';
        gameOverNode.className = currentPlayer === "X" ? 'playerX' : 'playerO';
        console.log(`Game Won By Player ${currentPlayer}!`);
        gameWonSound.play();
    } else if (checkWin === 'tie') {
        gameOverNode.innerText = 'Tie! No one won this round!'
        gameOverNode.className = 'tie';
        console.log('The game has been tied!');
        tieSound.play();
    }
    initialiseBoard(1000);
}

//Function that resets the game board when a round is won or tied
const initialiseBoard = function (timer) {
    
    cellArray.forEach (function (cell) {
        
        cell.classList.add('resetting')
    })
    
    setTimeout(function () {
        board = ['', '', '', '', '', '', '', '', ''];
        cellArray.forEach( function (cell) {
            cell.innerText = '';
            cell.style.backgroundImage = 'none';
            cell.classList.remove('playerX');
            cell.classList.remove('playerO');
            cell.classList.remove('resetting');
            gameOverNode.className = 'gameOver';

        });
    }, timer)
}
//Function that does a hard reset of the game board
const hardInitialiseBoard = function () {
    initialiseBoard ();
    xScore = 0;
    oScore = 0;
    roundsPlayed = 1;
    xScoreNode.innerText = `Score: ${xScore}`;
    oScoreNode.innerText = `Score: ${oScore}`;

}

resetButton.addEventListener("click", function () {
    hardInitialiseBoard(0);
})


//PART 2: Player Customisation -------------------------------------------

//Adding event listeners to each icon
iconArray.forEach( function (icon) {
    icon.addEventListener('click', function () {
        iconClickEvents (icon);
        console.log("Added Event Listener to ", icon);
    });
});

//Function that handles events when an icon is clicked
const iconClickEvents = function (icon) {
    if (icon.className === "icon playerX") {
        playerXIcon = icon.style.backgroundImage;   //I tried refactoring this into the changeIcon function, but it broke the code for some reason
        changeIcon(playerXIcon, "cell playerX");
    } else {
        playerOIcon = icon.style.backgroundImage;
        changeIcon(playerOIcon, "cell playerO");
    }
}

//Function that changes all backgrounds of a player's taken cells to a new one
const changeIcon = function (playerIcon, className) {
    console.log(playerIcon);
    const cellPlayerArray = Array.from(document.getElementsByClassName(className));
    cellPlayerArray.forEach( function (cell) {
        cell.style.backgroundImage = playerIcon;
    })
}