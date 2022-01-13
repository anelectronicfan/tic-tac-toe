//Tic-tac-toe

//DECLARE GLOBAL VARIABLES
const cellArray = document.querySelectorAll('.cell');   //Array.from is a method that converts an array-like object (like a nodelist) into an array

const iconArray = document.querySelectorAll('.icon');
let playerXIconBackground = 'url(images/icons8-bt21-cooky-96.png)';
let playerOIconBackground = "url(images/icons8-bt21-rj-96.png)";

const gameOverNode = document.querySelector('.gameOver');
const resetButton = document.querySelector('#reset');

const playerTurnNode = document.querySelector('.playerTurn');
let currentPlayer = 'X';
let xScore = 0;
let oScore = 0;
const xScoreNode = document.querySelector('#xScore');
const oScoreNode = document.querySelector('#oScore');

const gameWonSound = document.querySelector("#gameWonSound");
const invalidInputSound = document.querySelector("#invalidInputSound");
const tieSound = document.querySelector("#tieSound");
const validInputSound = document.querySelector("#validInputSound");

const xAIToggleButton = document.querySelector("#xAIToggle");
const oAIToggleButton = document.querySelector("#oAIToggle");

let isAIPlayingX = false;
let isAIPlayingO = false;

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

//PART 1: MVP -----------------------------------------------------------

//Function that tells the game what to do when the player clicks a cell
const playerClickEvents = function (cell, index) {
    if (!checkValid(cell)) {  
        return;
    }
    assignCellToPlayer(cell, index);
    
    gameEndEvents(checkWin());
    switchPlayer();
    if (isAIPlayingX === true && currentPlayer === 'X') {
        AIClickEvents();
    } else if (isAIPlayingO === true && currentPlayer === 'O') {
        AIClickEvents();
    }
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
        invalidInputSound.play();

    }   //This is horrible, why have I done this?
    return isValid;
}

//Function that assigns a clicked cell to the player that clicked it
const assignCellToPlayer = function (cell, boardIndex) {
    validInputSound.play();
    cell.classList.remove(`player${currentPlayer}`);
    board[boardIndex] = currentPlayer;
    cell.classList.add(`player${currentPlayer}`);
    cell.style.backgroundImage = currentPlayer === 'X' ? playerXIconBackground : playerOIconBackground;

}

//Function that changes the player's turn
const switchPlayer = function () {
    currentPlayer = currentPlayer === 'X' ? 'O': 'X';
    playerTurnNode.className = playerTurnNode.className === 'playerTurn playerX' ? 'playerTurn playerO' : 'playerTurn playerX';
    playerTurnNode.innerText = playerTurnNode.innerText === `Player 1's Turn` ? `Player 2's Turn` : `Player 1's Turn`;
    
}

//Function that checks if the game has been 'win' or 'tied'
const checkWin = function () {
    const currentPlayerCellIndexes = playerCellIndexCreator (currentPlayer);

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
                xScoreNode.innerText = `Score: ${xScore}`;


            } else {
                oScore ++;
                oScoreNode.innerText = `Score: ${oScore}`;

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

//Function that loops through the board and returns a given player's taken cell indexes as an array
const playerCellIndexCreator = function (player) {
    const playerCellIndexes = []
    for (let i = 0; i < board.length; i ++) {
        if (board[i] === player) {
            playerCellIndexes.push(i);
        }
    }
    return playerCellIndexes;
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
    
    isAIPlayingX = false;
    isAIPlayingO = false;

    xAIToggleButton.innerText = "I'm feeling lazy";
    oAIToggleButton.innerText = "I'm feeling lazy";

    stopPlayerInput();
    
    setTimeout(function () {
        board = ['', '', '', '', '', '', '', '', ''];
        cellArray.forEach( function (cell) {
            cell.innerText = '';
            cell.style.backgroundImage = 'none';
            cell.classList.remove('playerX');
            cell.classList.remove('playerO');
            gameOverNode.className = 'gameOver';
        });
        allowPlayerInput(); //technically more lines of code are processed here, but better readability
    }, timer)
}
//Function that does a hard reset of the game board
const hardInitialiseBoard = function () {
    initialiseBoard ();
    xScore = 0;
    oScore = 0;
    xScoreNode.innerText = `Score: ${xScore}`;
    oScoreNode.innerText = `Score: ${oScore}`;

}

//Adding Event Listener to the reset button
resetButton.addEventListener("click", function () {
    hardInitialiseBoard(0);
})


//PART 2: Player Customisation ------------------------------------------

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
        playerXIconBackground = icon.style.backgroundImage;   //I tried refactoring this into the changeIcon function, but it broke the code for some reason
        changeIcon(icon, playerXIconBackground, "cell playerX", "icon playerX");
    } else if (icon.className === "icon playerO"){
        playerOIconBackground = icon.style.backgroundImage;
        changeIcon(icon, playerOIconBackground, "cell playerO", "icon playerO");
    }
}

//Function that changes the selected icon, replacing the previous icon for the player
const changeIcon = function (icon, playerIconBackground, cellClassName, iconClassName) {
    console.log(playerIconBackground);
    const cellPlayerArray = Array.from(document.getElementsByClassName(cellClassName));
    cellPlayerArray.forEach( function (cell) {
        cell.style.backgroundImage = playerIconBackground;
    })

    const iconPlayerArray = Array.from(document.getElementsByClassName(iconClassName));
    iconPlayerArray.forEach(function(node) {
        node.classList.remove("selectedIcon");
    })

    icon.classList.add("selectedIcon");
}

//Part 3 - A.I but it's more A than I -----------------------------------

//Adding Event Listeners to each AI toggle button


xAIToggleButton.addEventListener('click', function () {
    isAIPlayingX = isAIPlayingX === true ? false : true; //Again, tried refactoring this inside a function, but it didn't want to work
    xAIToggleButton.innerText = isAIPlayingX === true ? "I want to play!" : "I'm feeling lazy";
    console.log('isAIPlayingX:', isAIPlayingX);
    if (currentPlayer === 'X') {
        AIClickEvents();
    }
})

oAIToggleButton.addEventListener('click', function () {
    isAIPlayingO = isAIPlayingO === true ? false : true;
    oAIToggleButton.innerText = isAIPlayingO === true ? "I want to play!" : "I'm feeling lazy";
    console.log('isAIPlayingO:',isAIPlayingO);
    if (currentPlayer === 'O') {
        AIClickEvents(isAIPlayingO);
    }
})

const AIClickEvents = function () {
    stopPlayerInput();
    setTimeout(function () {
        const AIMove = calculateBestMove (currentPlayer);
        assignCellToPlayer(cellArray[AIMove], AIMove);
        gameEndEvents(checkWin());
        switchPlayer();
        allowPlayerInput();
        if (isAIPlayingX === true && currentPlayer === 'X') {
            AIClickEvents();
        } else if (isAIPlayingO === true && currentPlayer === 'O') {
            AIClickEvents();
        }
    }, 300) 
}


//Function that looks at the board and returns a board index as an optimal move
const calculateBestMove = function (AIPlayer) {
    let bestMove = 0;
    if (board[4] === '') {
        bestMove = 4;
        return bestMove;
    }
    const opposingPlayer = AIPlayer === "X" ? "O" : "X";

    const AIPlayerCellIndexes = playerCellIndexCreator(AIPlayer);
    const opposingPlayerCellIndexes = playerCellIndexCreator(opposingPlayer);

    //first loop through opposing player's taken tiles
    const defensiveBestMove = checkWinningMove(opposingPlayerCellIndexes);
    const defensiveGoodMove = checkGoodMove(opposingPlayerCellIndexes);
    //next loop through the AI's tiles
    const offensiveBestMove = checkWinningMove (AIPlayerCellIndexes);
    
    //if offensive move can win the game, bestmove = offensive move, 
    //else bestmove = defensive move to stop opponent from winning, 
    //else bestmove = worse defensive move to block one win condition off the opponent
    //if all that fails somehow, bestmove = first random blank tile on the board

    if (offensiveBestMove !== '') {
        bestMove = offensiveBestMove;
    } else if (defensiveBestMove !== '') {
        bestMove = defensiveBestMove;
    } else if (defensiveGoodMove !== ''){
        bestMove = defensiveGoodMove;
    } else {
        bestMove = board.indexOf("");
    }
    return bestMove;
}

//Function that determines if taking a certain tile will win the game or not
const checkWinningMove = function (array) {
    let bestMove = '';
    for (let i = 0; i < winningIndexes.length; i++) {
        let a = winningIndexes[i][0];
        let b = winningIndexes[i][1];
        let c = winningIndexes[i][2];
        if (array.includes(a) && array.includes(b) && board[c] === '') {
            bestMove = c;
        } else if (array.includes(a) && array.includes(c) && board[b] === '') {
            bestMove = b;
        } else if (array.includes(b) && array.includes(c) && board[a] === '') {
            bestMove = a;
        } 
    }
    return bestMove;
}

//Function that returns a move that is considered defensive
const checkGoodMove = function (array) {
    let goodMove = '';
    for (let i = 0; i < winningIndexes.length; i++) {
        let a = winningIndexes[i][0];
        let b = winningIndexes[i][1];
        let c = winningIndexes[i][2];
        if (array.includes(a) && board[b] === '') {
            goodMove = b;
        } else if (array.includes(a) && board[c] === '') {
            goodMove = c;
        } else if (array.includes(b) && board[a] === '') {
            goodMove = a;
        } else if (array.includes(b) && board[c] === '') {
            goodMove = c;
        } else if (array.includes(c) && board[a] === '') {
            goodMove = a;
        } else if (array.includes(c) && board[b] === '') {
            goodMove = b;
        }
    }
    return goodMove;
}

//Function that stops player input
const stopPlayerInput = function () {
    cellArray.forEach (function (cell) { 
        cell.classList.add('resetting')
    })
}

//Function that allows player input
const allowPlayerInput = function () {
    cellArray.forEach (function (cell) {
        cell.classList.remove('resetting')
    })
}
