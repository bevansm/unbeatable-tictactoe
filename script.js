let symOne = "X";
let symTwo = "O";
let playerOneSym = symOne;
let playerTwoSym = symTwo;
let ai = true;
let currentlyPlayerOne = true;
let board = ["", "", "", "", "", "", "", "", ""];

function setSymbols() {
  symOne = document.getElementById("sym-one").textContent = symOne;
  symTwo = document.getElementById("sym-two").textContent = symTwo;
}

window.onload = setSymbols;

// Begins a new game.
function newGame() {
  clearBoard();
  saveChoices();
  setBottomBar();
  document.getElementById("menu").style.display = "none";
  ai == true && !currentlyPlayerOne ? aiTurn() : enableBoard();
}

// Handles an ai turn.
function aiTurn() {
  setTimeout(function() {
    advancedAiTurn();
    if (checkWinCons(board, playerTwoSym)) {
      setWinnerMsg("The computer overcame you");
      endGame();
    } else if (checkDraw(board)) {
      setWinnerMsg("It's a draw");
      endGame();
    } else {
      currentlyPlayerOne = true;
      setTimeout(function() {
        setBottomBar();
        enableBoard();
      }, 250);
    }
  }, 500);
  console.log(checkWinCons(board, playerTwoSym));
  console.log(checkDraw(board));
}

// Implements the minimax algorithm to determine the ai's next move.
function advancedAiTurn() {
  bestMove = miniMax(board, true, -20, 20);
  board[bestMove.index] = playerTwoSym;
  document.getElementById(bestMove.index).textContent = playerTwoSym;
  console.log(board);
}

// Minimax Algorithm; AI aims for a max score.
function miniMax(newBoard, isMax, alpha, beta) {
  let openBoxes = getOpenBoxes(newBoard);
  shuffle(openBoxes);
  if (!openBoxes || !openBoxes.length)
    return {
      score: scoreGame(newBoard)
    };
  let moves = [];
  for (let i = 0; i < openBoxes.length; i++) {
    let move = {};
    move.index = openBoxes[i];
    isMax
      ? (newBoard[openBoxes[i]] = playerTwoSym)
      : (newBoard[openBoxes[i]] = playerOneSym);

    // Recursive call
    let result = miniMax(newBoard, !isMax, alpha, beta);
    move.score = result.score;
    moves.push(move);
    newBoard[openBoxes[i]] = "";

    // Alpha-Beta pruning
    if (isMax && result.score > alpha) alpha = result.score;
    if (!isMax && result.score < beta) beta = result.score;
    if (alpha >= beta) {
      console.log("alpha: " + alpha + ", beta: " + beta);
      break;
    }
  }

  return findBestMove(moves, isMax);
}

// Implements the Fisher-Yates shuffling algorithm.
function shuffle(arr) {
  let i = arr.length;
  while (i) {
    let j = Math.floor(Math.random() * i--);
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

// Finds the best move (i.e. highest/lowest score) for a given turn + returns it.
function findBestMove(moves, isMax) {
  let bestMove;

  // Note: Score will be bound by 20 as depth is at most 9.
  if (isMax) {
    let bestScore = -20;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  } else {
    let bestScore = 20;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  }

  return bestMove;
}

// Scores the board for minimax.
function scoreGame(tempBoard) {
  if (checkWinCons(tempBoard, playerTwoSym)) return 10;
  else if (checkWinCons(tempBoard, playerOneSym)) return -10;
  return 0;
}

// Places a symbol at the first free space.
function basicAiTurn() {
  let openBoxes = getOpenBoxes(board);
  document.getElementById(openBoxes[0]).textContent = playerTwoSym;
  board[openBoxes[0]] = playerTwoSym;
}

// Shows player symbol in box if user hovers over.
function boxHovered() {
  let box = event.target;
  if (board[box.id] == "") {
    currentlyPlayerOne
      ? (box.textContent = playerOneSym)
      : (box.textContent = playerTwoSym);
  }
}

// Removes symbol if user has not clicked button.
function boxNotHovered() {
  let box = event.target;
  if (board[box.id] == "") {
    box.textContent = "";
  }
}

// Handles a box click. Assumes any clicked box is a valid click.
function boxClicked() {
  let box = event.target;
  disableBoard();

  let sym = playerOneSym;
  if (!ai && !currentlyPlayerOne) sym = playerTwoSym;
  board[box.id] = sym;
  box.textContent = sym;

  if (checkWinCons(board, sym)) {
    ai
      ? setWinnerMsg("You conquered the computer")
      : setWinnerMsg(sym + " reigns victorious");
    endGame();
  } else if (checkDraw(board)) {
    setWinnerMsg("It's a draw");
    endGame();
  } else {
    currentlyPlayerOne = !currentlyPlayerOne;
    setBottomBar();
    if (ai) {
      aiTurn();
    } else {
      enableBoard();
    }
  }
}

// Returns the indexes of the open spots on the board.
function getOpenBoxes(tempBoard) {
  let openBoxes = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] == "") {
      openBoxes.push(i);
    }
  }
  return openBoxes;
}

// Checks the win conditions for a given symbol.
function checkWinCons(tempBoard, sym) {
  // Rows
  for (let i = 0; i <= 6; i += 3) {
    if (board[i] == sym) {
      for (let j = 1; j <= 2; j++) {
        if (board[i + j] != sym) break;
        if (j == 2) return true;
      }
    }
  }

  // Columns
  for (let i = 0; i <= 2; i += 1) {
    if (board[i] == sym) {
      for (let j = 3; j <= 6; j += 3) {
        if (board[i + j] != sym) break;
        if (j == 6) return true;
      }
    }
  }

  // Diagonals
  return (
    board[4] == sym &&
    ((board[0] == sym && board[8] == sym) ||
      (board[2] == sym && board[6] == sym))
  );
}

// Checks for a draw.
function checkDraw(tempBoard) {
  for (let i = 0; i < tempBoard.length; i++) {
    if (tempBoard[i] == "") return false;
  }
  return true;
}

// Unhides the menu, cleans up player bar, ect.
function endGame() {
  disableBoard();
  document.getElementById("player-bar-text").textContent = "";
  selectChoices();
  document.getElementById("menu").style.display = "block";
}

// Clears the board.
function clearBoard() {
  board = ["", "", "", "", "", "", "", "", ""];
  let elms = document.getElementsByClassName("btn-box");
  for (let i = 0; i < elms.length; ++i) {
    elms[i].textContent = "";
  }
}

// Enables any unfilled tiles.
function enableBoard() {
  let elms = document.getElementsByClassName("btn-box");
  for (let i = 0; i < elms.length; ++i) {
    if (board[elms[i].id] == "") {
      elms[i].disabled = false;
    }
  }
}

// Disables the board tiles.
function disableBoard() {
  let elms = document.getElementsByClassName("btn-box");
  for (let i = 0; i < elms.length; ++i) {
    elms[i].disabled = true;
  }
}

// Saves the choices on the radio buttons into variables.
function saveChoices() {
  if (document.getElementById("choice-sym-one").checked) {
    playerOneSym = symOne;
    playerTwoSym = symTwo;
    currentlyPlayerOne = true;
  } else {
    playerTwoSym = symOne;
    playerOneSym = symTwo;
    currentlyPlayerOne = false;
  }
  ai = document.getElementById("choice-ai").checked;
}

// Focuses the user's choice of game type and symbol.
function selectChoices() {
  playerOneSym == symOne
    ? (document.getElementById("choice-sym-one").checked = true)
    : (document.getElementById("choice-sym-two").checked = true);
  ai
    ? (document.getElementById("choice-ai").checked = true)
    : (document.getElementById("choice-two-player").checked = true);
}

// Sets the winning message.
function setWinnerMsg(msg) {
  document.getElementById("msg-menu").textContent = msg;
}

// Sets the bottom bar text w/ appropriate symbol.
function setBottomBar() {
  let txt = "It is ";
  currentlyPlayerOne ? (txt += playerOneSym) : (txt += playerTwoSym);
  txt += "'s turn";
  document.getElementById("player-bar-text").textContent = txt;
}
