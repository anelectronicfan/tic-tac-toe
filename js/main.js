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

//Add event listeners to each cell
cellArray.forEach( function (cell, index) {
    cell.addEventListener('click', function () {
        playerClickEvents(cell, index);
        console.log("Added Event Listener to ", cell);
    });
});

//Function that tells the game what to do when the player clicks a cell
const playerClickEvents = function (cell, index) {
    if (!checkValid(cell)) {  
        return;
    }
    assignCellToPlayer(cell, index);
    gameEndEvents(checkWin());
    switchPlayer();
    if (isAIPlayingX === true && currentPlayer === 'X') {
        AIClickEvents();    // Calls the AI player if the relevant variables are true
    } else if (isAIPlayingO === true && currentPlayer === 'O') {
        AIClickEvents();    // Otherwise, the next human player takes the next turn
    }
}


//Function that checks if a given cell can be assigned a value or not
const checkValid = function (cell) {
    let isValid = true;
    if (cell.className === 'cell resetting' || cell.className === 'cell playerX resetting' || cell.className === 'cell playerO resetting' || cell.className === 'cell playerX' || cell.className === 'cell playerO') {
        isValid = false;
        invalidInputSound.play();
    }   //This is horrible, why have I done this? This is the one time in this project where I wished I used jquery instead
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

//Function that tells the game what to do when the game ends, executing commands based on the return value of the checkWin function
const gameEndEvents = function (checkWin) {
    if (!checkWin) {
        return; //If game hasn't ended, do nothing and return out of this function
    } 
    if (checkWin === 'win') {
        gameOverNode.innerText = currentPlayer === "X" ? 'Player 1 Wins!' : 'Player 2 Wins!';
        gameOverNode.className = currentPlayer === "X" ? 'playerX' : 'playerO';
        gameWonSound.play();
    } else if (checkWin === 'tie') {
        gameOverNode.innerText = 'Tie! No one won this round!'
        gameOverNode.className = 'tie';
        tieSound.play();
    }
    initialiseBoard(1000);
}

//Function that resets the game board when a round is won or tied
const initialiseBoard = function (timer) {
    
    isAIPlayingX = false;   //Toggles AI off when the board is reinitialising.
    isAIPlayingO = false;
    xAIToggleButton.innerText = "I'm feeling lazy";
    oAIToggleButton.innerText = "I'm feeling lazy";

    stopPlayerInput();  //Prevents player input during the reset
    
    //This setTimeout is purely aesthetic, it serves no practical purpose, 
    //other than allowing the players time to process that the round has ended 
    //and the state of the board in which the round ended
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
    initialiseBoard (0);    // The board needs to reset instantly in this function, for aesthetics
    xScore = 0;
    oScore = 0;
    xScoreNode.innerText = `Score: ${xScore}`;
    oScoreNode.innerText = `Score: ${oScore}`;
}

//Adding Event Listener to the reset button
resetButton.addEventListener("click", function () {
    hardInitialiseBoard();
})

//Function that stops player input. Used when setTimeout events occur, to stop any player from inputting any commands when they're not supposed to
const stopPlayerInput = function () {
    cellArray.forEach (function (cell) { 
        cell.classList.add('resetting')     //checkValid has been coded to register any clicks on a cell with the 'resetting' class as invalid, disallowing any player input
    })
}

//Function that allows player input
const allowPlayerInput = function () {
    cellArray.forEach (function (cell) {
        cell.classList.remove('resetting')
    })
}




//PART 2: Player Customisation ------------------------------------------

//Adding event listeners to each icon
iconArray.forEach( function (icon) {
    icon.addEventListener('click', function () {
        iconClickEvents (icon);
        console.log("Added Event Listener to ", icon);
    });
});

//Function that handles events when an icon is clicked
//This reads the url of a selected icon, then passes that value into the changeIcon function
const iconClickEvents = function (icon) {
    if (icon.className === "icon playerX") {
        playerXIconBackground = icon.style.backgroundImage;   //I tried refactoring this into the changeIcon function, but it broke the code for some reason
        changeIcon(icon, playerXIconBackground, "cell playerX", "icon playerX");
    } else if (icon.className === "icon playerO"){
        playerOIconBackground = icon.style.backgroundImage;
        changeIcon(icon, playerOIconBackground, "cell playerO", "icon playerO");
    }
}

//Function that replaces past and future cells made by a player with a selected icon
const changeIcon = function (icon, playerIconBackground, cellClassName, iconClassName) {
    console.log(playerIconBackground);
    const cellPlayerArray = Array.from(document.getElementsByClassName(cellClassName));
    cellPlayerArray.forEach( function (cell) {
        cell.style.backgroundImage = playerIconBackground;
    })

    //remove the "selectedIcon" class from the previous selected icon
    const iconPlayerArray = Array.from(document.getElementsByClassName(iconClassName));
    iconPlayerArray.forEach(function(node) {
        node.classList.remove("selectedIcon");
    })

    //adds the "selectedIcon" class to the currently selected icon
    //The "selectedIcon" class merely changes the background color to green in order to signify which icon is selected currently
    icon.classList.add("selectedIcon");
}

//Part 3 - A.I but it's more A than I -----------------------------------

//Adding Event Listeners to each AI toggle button
xAIToggleButton.addEventListener('click', function () {
    isAIPlayingX = isAIPlayingX === true ? false : true; //Tenary expression that toggles AI on or off on every click
    xAIToggleButton.innerText = isAIPlayingX === true ? "I want to play!" : "I'm feeling lazy";
    console.log('isAIPlayingX:', isAIPlayingX);
    if (currentPlayer === 'X') {
        AIClickEvents();    // Executes AI command immediately if it's the relevant player's turn, otherwise AI will be called after the opposing takes their turn
    }
})

oAIToggleButton.addEventListener('click', function () {
    isAIPlayingO = isAIPlayingO === true ? false : true; //Again, tried refactoring this inside a function, but it didn't want to work
    oAIToggleButton.innerText = isAIPlayingO === true ? "I want to play!" : "I'm feeling lazy";
    console.log('isAIPlayingO:',isAIPlayingO);
    if (currentPlayer === 'O') {
        AIClickEvents(isAIPlayingO);
    }
})

// Function that tells the game what to do when it's an AI's turn
// This is essentially the same function as playerClickEvents
const AIClickEvents = function () {
    stopPlayerInput();
    setTimeout(function () {
        const AIMove = calculateBestMove (currentPlayer);
        assignCellToPlayer(cellArray[AIMove], AIMove);
        gameEndEvents(checkWin());
        switchPlayer();
        allowPlayerInput();
        if (isAIPlayingX === true && currentPlayer === 'X') {
            AIClickEvents();    //This function will call itself but for another AI player if both AI toggles are on
        } else if (isAIPlayingO === true && currentPlayer === 'O') {
            AIClickEvents();    //Otherwise, it will pass control back to a human player
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

    //First two arrays are initialised, one for both players. These contain index numbers of 
    //whatever cells they have taken on the gameboard
    const AIPlayerCellIndexes = playerCellIndexCreator(AIPlayer);
    const opposingPlayerCellIndexes = playerCellIndexCreator(opposingPlayer);

    //Next, we generate three possible moves that the AI player can take.
    const defensiveBestMove = checkWinningMove(opposingPlayerCellIndexes);  // This is a move that should be taken if the opposing player is about to win
    const defensiveGoodMove = checkGoodMove(opposingPlayerCellIndexes);     // This is a move that blocks off one possible win condition from the opposing player
    
    const offensiveBestMove = checkWinningMove (AIPlayerCellIndexes);       // This is a move that will win the game for the A.I player
    
    //if offensive move can win the game, bestmove = offensive move, 
    //else bestmove = defensive move to stop opponent from winning, 
    //else bestmove = worse defensive move to block one win condition off the opponent
    //if all that fails somehow, bestmove = first blank tile on the board

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

        //If 2/3 winningIndexes for any winCondition are taken by a player, and the third is not taken, the bestMove is the third index.
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

        //If 1/3 winningIndexes for any winCondition are taken by a player, and at least one of the other two are not taken, a goodMove will be to take one of them
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


