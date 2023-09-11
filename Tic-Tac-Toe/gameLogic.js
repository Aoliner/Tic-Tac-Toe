
const newGameButtons = document.getElementsByClassName("newGameButtons")
const GAME_BOX_EMPTY = "empty"
const GAME_BOX_WITH_CROSS = "cross"
const GAME_BOX_WITH_ZERO = "zero"
const NUMBER_OF_GAME_BOXES = 9
const NUMBER_OF_WIN_BOXES = 3
const DISABLED_BOX = "disabled"
const ONE_SECOND_DELAY = 1000
const dialog = document.querySelector('dialog');
const gridWithGameBoxes = document.querySelector(".gridWithGameBoxes")
const winLinesSequences = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
[0, 3, 6], [1, 4, 7], [2, 5, 8],
[0, 4, 8], [2, 4, 6]]
const gameStateText = document.querySelector(".stateOfWinner")
let winLinesSequencesIndexes = [0, 1, 2, 3, 4, 5, 6, 7]
let randomIndexFromWinLines = winLinesSequencesIndexes[Math.floor(Math.random() * winLinesSequencesIndexes.length)];
let winLinePCorUser = []
let winLinePC = []
let winLineUser = []
let gameGridBoxes
let boxClasses

///const 2
// score 
//add stick?
for (let i = 0; i < NUMBER_OF_GAME_BOXES; i++) {
  const gameGridBox = document.createElement("div")
  gameGridBox.classList.add("game-grid-box", GAME_BOX_EMPTY, i)
  gridWithGameBoxes.appendChild(gameGridBox)
  gameGridBox.addEventListener("click", usersTurn)
}
for (const newGameButton of newGameButtons) {
  newGameButton.addEventListener("click", newGame)
}

function blockBoxes(block) {
  gameGridBoxes = document.querySelectorAll("div")
  for (let gameGridBox of gameGridBoxes) {
    boxClasses = gameGridBox.classList
    if (block) {
      boxClasses.add(DISABLED_BOX)
    }
    else if (!block && boxClasses.contains(GAME_BOX_EMPTY)) {
      boxClasses.remove(DISABLED_BOX)
    }
  }
  newGameButtons[0].disabled = block ? true : false
}


function showPopUp() {
  blockBoxes(true)
  setTimeout(() => dialog.showModal(), ONE_SECOND_DELAY)
  setTimeout(() => newGameButtons[0].style.visibility = 'hidden', ONE_SECOND_DELAY)
}

function usersTurn(event) {
  boxClasses = event.target.classList
  if (boxClasses.contains(GAME_BOX_EMPTY)) {
    boxClasses.remove(GAME_BOX_EMPTY)
    boxClasses.add(GAME_BOX_WITH_CROSS)
  }
  blockBoxes(true)

  if (!isWinner(GAME_BOX_WITH_CROSS)) {
    setTimeout(computersTurn, 500)
  }

  else {
    showPopUp()
  }
}


function isWinner(playerMark) {
  gameGridBoxes = document.querySelectorAll("div")
  for (let winLineSequence of winLinesSequences) {
    winLinePCorUser = []
    for (let boxIndex of winLineSequence) {
      if (gameGridBoxes[boxIndex].classList.contains(playerMark)) {
        winLinePCorUser.push(gameGridBoxes[boxIndex])
      }
    }
    if (winLinePCorUser.length === NUMBER_OF_WIN_BOXES) {
      gameStateText.textContent = playerMark === GAME_BOX_WITH_CROSS ? "You won" : "PC won"
      blockBoxes(true)
      winLinePCorUser = []
      return true
    }
  }
}



function computersTurn() {
  gameGridBoxes = document.querySelectorAll("div")

  if (noEmptyBoxes()) { return }

  function areTwoWinBoxes(winLine, playerMark) {
    for (let i = 0; i < winLinesSequences.length; i++) {
      winLine = []
      for (let k = 0; k < winLinesSequences[i].length; k++) {
        boxClasses = gameGridBoxes[winLinesSequences[i][k]].classList
        if (boxClasses.contains(playerMark)) {
          winLine.push(true)
        }
        if (winLine.length === 2) {////////////
          for (let q = 0; q < NUMBER_OF_WIN_BOXES; q++) {
            boxClasses = gameGridBoxes[winLinesSequences[i][q]].classList
            if (boxClasses.contains(GAME_BOX_EMPTY)) {
              boxClasses.remove(GAME_BOX_EMPTY)
              boxClasses.add(GAME_BOX_WITH_ZERO)
              winLine = []
              blockBoxes(false)
              if (isWinner(GAME_BOX_WITH_ZERO)) {
                showPopUp()
              }
              return true
            }
          }
        }
      }
    }
  }

  if (areTwoWinBoxes(winLinePC, GAME_BOX_WITH_ZERO)) { return }
  if (areTwoWinBoxes(winLineUser, GAME_BOX_WITH_CROSS)) { return }


  function fillWinLine() {
    winLinePC = []
    function existsWinLine() {
      if (winLinesSequencesIndexes.length === 0) {
        for (let winLineSequence of winLinesSequences) {
          winLinePC = []
          for (let boxIndex of winLineSequence) {
            boxClasses = gameGridBoxes[boxIndex].classList
            if (boxClasses.contains(GAME_BOX_EMPTY)) {
              boxClasses.remove(GAME_BOX_EMPTY)
              boxClasses.add(GAME_BOX_WITH_ZERO)
              blockBoxes(false)
              return true
            }
          }
        }
      }
    }

    if (existsWinLine()) { return }

    for (let i = 0; i < NUMBER_OF_WIN_BOXES; i++) {
      boxClasses = gameGridBoxes[winLinesSequences[randomIndexFromWinLines][i]].classList
      if (boxClasses.contains(GAME_BOX_EMPTY) || boxClasses.contains(GAME_BOX_WITH_ZERO)) {
        winLinePC.push(true)
      }
    }

    if (winLinePC.length === NUMBER_OF_WIN_BOXES) {
      for (let i = 0; i < NUMBER_OF_WIN_BOXES; i++) {
        boxClasses = gameGridBoxes[winLinesSequences[randomIndexFromWinLines][i]].classList
        if (boxClasses.contains(GAME_BOX_EMPTY)) {
          boxClasses.remove(GAME_BOX_EMPTY)
          boxClasses.add(GAME_BOX_WITH_ZERO)
          winLinePC = []
          blockBoxes(false)
          return
        }
      }
    }
    else {
      winLinePC = []
      winLinesSequencesIndexes.splice(winLinesSequencesIndexes.indexOf(randomIndexFromWinLines), 1)
      randomIndexFromWinLines = winLinesSequencesIndexes[Math.floor(Math.random() * winLinesSequencesIndexes.length)]

      fillWinLine()
    }
  }

  fillWinLine()

  if (isWinner(GAME_BOX_WITH_ZERO)) {
    showPopUp()
  }

}



function newGame() {
  newGameButtons[0].style.visibility = 'visible'
  gameGridBoxes = document.querySelectorAll("div")
  for (let gameGridBox of gameGridBoxes) {
    boxClasses = gameGridBox.classList
    boxClasses.remove(GAME_BOX_WITH_ZERO)
    boxClasses.remove(GAME_BOX_WITH_CROSS)
    boxClasses.add(GAME_BOX_EMPTY)
  }
  winLinesSequencesIndexes = [0, 1, 2, 3, 4, 5, 6, 7]
  randomIndexFromWinLines = winLinesSequencesIndexes[Math.floor(Math.random() * winLinesSequencesIndexes.length)]

  blockBoxes(false)
  dialog.close()
}


function noEmptyBoxes() {
  gameGridBoxes = document.querySelectorAll("div")
  let emptyBoxes = []
  for (let gameGridBox of gameGridBoxes) {

    if (gameGridBox.classList.contains(GAME_BOX_EMPTY)) {
      emptyBoxes.push(gameGridBox)
    }
  }
  if (emptyBoxes.length === 0) {
    gameStateText.textContent = "Tie"
    showPopUp()
    return true
  }
  else return false
}