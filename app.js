// Escape user supplied text before it is placed in innerHTML
const escapeHtml = function (text) {
  return String(text).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]))
}

// Storage Controller
const StorageCtrl = (function () {

  const setUser = function (data) {

    if (typeof data === 'object') {

      const dataX = JSON.stringify(data)

      localStorage.setItem('user', dataX)

    }

  }

  const getUser = function () {

    const data = localStorage.getItem('user')

    const dataX = JSON.parse(data)

    if (typeof dataX === 'object' && dataX !== null) {

      dataX.calculateStats = function () {
        this.statTotal.forEach((item, index) => {

          this.statTotal[index] = this.statEasy[index] +
            this.statMedium[index] + this.statHard[index] +
            this.statFriend[index]

        })
      }

      return dataX

    } else {

      return ''

    }

  }

  return {

    setUser: (data) => setUser(data),

    getUser: () => getUser(),

  }
})();


//  Controller
const UserCtrl = (function () {

  const getData = function (dataName) {

    const profile = StorageCtrl.getUser()

    let result = ''

    if (profile !== '') {

      switch (dataName) {

        case 'name':

          result = profile.name

          if (result === undefined) {
            result = ''
          }

          break;

        case 'xname':

          result = profile.xname

          if (result === undefined) {
            result = ''
          }

          break;

        case 'letter':

          result = profile.letter

          if (result === undefined) {
            result = ''
          }

          break;

        case 'difficulty':

          result = profile.difficulty

          if (result === undefined) {
            result = ''
          }

          break;

        case 'numb players':

          result = profile.numbPlay

          if (result === undefined) {
            result = ''
          }

          break;

        case 'first move':

          result = profile.firstMove

          if (result === undefined) {
            result = ''
          }

          break;

        case 'stat easy':

          profile.calculateStats()

          result = profile.statEasy

          if (result === undefined) {
            result = [0, 0, 0]
          }

          break;

        case 'stat medium':

          profile.calculateStats()

          result = profile.statMedium

          if (result === undefined) {
            result = [0, 0, 0]
          }

          break;

        case 'stat hard':

          profile.calculateStats()

          result = profile.statHard

          if (result === undefined) {
            result = [0, 0, 0]
          }

          break;

        case 'stat friend':

          profile.calculateStats()

          result = profile.statFriend

          if (result === undefined) {
            result = [0, 0, 0]
          }

          break;

        case 'stat total':

          profile.calculateStats()

          result = profile.statTotal

          if (result === undefined) {
            result = [0, 0, 0]
          }

          break;

        case 'board':

          result = profile.board

          if (result === undefined) {
            result = ['', '', '', '', '', '', '', '', '']
          }

          break;

        case 'ext-board':

          result = profile.extBoard

          if (result === undefined) {
            result = ''
          }

          break;

        default:
          break;

      }

    }

    return result

  }

  const setData = function (dataName, data) {

    const profile = StorageCtrl.getUser()

    if (profile !== '') {

      switch (dataName) {

        case 'name':

          profile.name = data

          break;

        case 'xname':

          profile.xname = data

          break;

        case 'letter':

          profile.letter = data

          break;

        case 'difficulty':

          profile.difficulty = data

          break;

        case 'numb players':

          profile.numbPlay = data

          break;

        case 'first move':

          profile.firstMove = data

          break;

        case 'stat easy':

          profile.statEasy = data

          profile.calculateStats()

          break;

        case 'stat medium':

          profile.statMedium = data

          profile.calculateStats()

          break;

        case 'stat hard':

          profile.statHard = data

          profile.calculateStats()

          break;

        case 'stat friend':

          profile.statFriend = data

          profile.calculateStats()

          break;

        case 'board':

          profile.board = data

          break;

        case 'ext-board':

          profile.extBoard = data

          break;

        default:
          break;

      }

      StorageCtrl.setUser(profile)

    }

  }

  return {

    getData: (dataName) => getData(dataName),

    setData: (dataName, data) => setData(dataName, data),

  }
})();


// Global Controller
const GlobalCtrl = (function () {

  return {

  }

})();


// UI Controller
const UICtrl = (function () {

  const findElement = function (tag) {
    return document.querySelector(tag)
  }

  const findElements = function (tag) {
    return document.querySelectorAll(tag)
  }

  const addClass = function (element, clas) {
    element.classList.add(clas)
  }

  const toggleClass = function (element, clas) {

    if (element.classList.contains(clas)) {
      removeClass(element, clas)
    } else {
      addClass(element, clas)
    }

  }

  const removeClass = function (element, clas) {
    element.classList.remove(clas)
  }

  const sendMessage = function (message) {

    UIVars.message.innerHTML = message

    addClass(UIVars.messageHolder, 'show')

    const firstField = UIVars.message.querySelector('input, button')

    if (firstField) { firstField.focus() } else { UIVars.message.focus() }

  }

  const removeMessage = function () {

    removeClass(UIVars.messageHolder, 'show')

  }

  let smallMessageTimer = null

  const sendSmallMessage = function (message, time) {

    UIVars.smallMessage.textContent = message

    addClass(UIVars.smallMessageHolder, 'show')

    // A newer message must not be closed by an older message's timer
    clearTimeout(smallMessageTimer)

    if (time) {

      smallMessageTimer = setTimeout(() => {
        removeSmallMessage()
      }, time);

    }

  }

  const removeSmallMessage = function () {

    removeClass(UIVars.smallMessageHolder, 'show')

  }

  const tabilize = function (tabHolder, elemHolder, tabName, elemName) {

    const tabChildren = tabHolder.children

    const elementChildren = elementHolder.children

    tabHolder.addEventListener('click', (e) => {

      if (e.target.classList.contains(tabName)) {

        const caughtNum = `${elementName}-${e.target.id.split('-')[1]}`

        for (let i = 0; i < tabChildren.length; i++) {
          const element = tabChildren[i];

          removeClass(element, 'active')

        }

        addClass(e.target, 'active')

        for (let i = 0; i < elementChildren.length; i++) {
          const element = elementChildren[i];

          removeClass(element, 'show')

          if (element.id === caughtNum) {
            addClass(element, 'show')
          }
        }
      }

    })

  }


  const UIVars = {

    // Rest Elements
    body: findElement('body'),
    html: findElement('html'),

    // Navigational Elements
    nav: findElement('.site-topper nav'),
    navOpener: findElement('.site-settings-nav'),
    navCloser: findElement('.site-settings-close'),
    navBlur: findElement('.site-settings-holder'),


    // Message & XMessage Elements
    message: findElement('.message'),
    messageHolder: findElement('.message-holder'),
    msgX: findElement('#mess-cancel'),
    msgBlur: findElement('.message-blur'),


    // Small Message Elements
    smallMessageHolder: findElement('.small-message-holder'),
    smallMessage: findElement('.small-message'),
    smallMsgX: findElement('#small-mess-cancel'),
    smallMsgBlur: findElement('.small-message-blur'),

    // Settings Elements
    settName: findElement('#sett-name'),
    settXname: findElement('#sett-xname'),
    settLetter: findElement('.sett-letter-cont'),
    settDifficulty: findElement('.sett-difficulty-cont'),
    settNumbOPlay: findElement('.sett-numb-cont'),
    settFirstMove: findElement('.sett-firstm-cont'),
    settSave: findElement('#sett-save-sett'),

    // Stats Elements
    statsTable: findElement('#stats-table'),
    statsReset: findElement('#stats-reset'),

    // Board Elements
    boardBody: findElement('#board-body'),
    boardUndo: findElement('.board-undo'),
    boardRedo: findElement('.board-redo'),
    boardReset: findElement('.board-reset'),
    boardName: findElement('.board-name'),
    boardXname: findElement('.board-xname'),
    boardDraws: findElement('.board-draws'),
    boardCover: findElement('.board-cover'),
    gameStatus: findElement('#game-status'),
  }

  return {

    UIVars: UIVars,

    findElement: (tag) => findElement(tag),

    findElements: (tag) => findElements(tag),

    addClass: (element, clas) => addClass(element, clas),

    toggleClass: (element, clas) => toggleClass(element, clas),

    removeClass: (element, clas) => removeClass(element, clas),

    tabilize: (tabHolder, elementHolder, tabName, elementName) =>
      tabilize(tabHolder, elementHolder, tabName, elementName),

    sendMessage: (message) => sendMessage(message),

    removeMessage: () => removeMessage(),

    resetState: () => resetState(),

    sendSmallMessage: (message, time) => sendSmallMessage(message, time),

    removeSmallMessage: () => removeSmallMessage(),

  }
})();


// API Controller
const BoardCtrl = (function () {

  const newBoard = function () {

    const board = {

      name: UserCtrl.getData('name'),

      xname: UserCtrl.getData('xname'),

      playerLetter: UserCtrl.getData('letter'),

      difficulty: UserCtrl.getData('difficulty'),

      numbPlay: UserCtrl.getData('numb players'),

      firstMove: (() => {

        let firstmove = UserCtrl.getData('first move')

        if (UserCtrl.getData('first move') === 'XO') {

          if (UserCtrl.getData('board').hasOwnProperty('firstMove')) {

            firstmove = UserCtrl.getData('board').firstMove == 'X' ? 'O' : 'X'

          } else {

            firstmove = UserCtrl.getData('letter')

          }

        }

        return firstmove
      })(),

      playingPoints: [],

      redoPoints: [],

      boardPoints: ['', '', '', '', '', '', '', '', ''],

      turn: (() => {

        let firstmove = UserCtrl.getData('first move')

        if (UserCtrl.getData('first move') === 'XO') {

          if (UserCtrl.getData('board').hasOwnProperty('firstMove')) {

            firstmove = UserCtrl.getData('board').firstMove == 'X' ? 'O' : 'X'

          } else {

            firstmove = UserCtrl.getData('letter')

          }

        }

        const item = firstmove === UserCtrl.getData('letter')

        let ment = item ? UserCtrl.getData('name') : UserCtrl.getData('xname')

        return ment
      })(),

      legitBoard: true,

      won: false

    }

    return board

  }

  const verifyBoard = function (board) {

    try {

      if (board.hasOwnProperty('legitBoard')) {

        if (board.legitBoard) {

          // Board is OK

        } else {

          board = newBoard()

        }

      } else {

        board = newBoard()

      }

    } catch (e) {

      console.warn(e)

      board = newBoard()

    }

    return board

  }

  const getUIBoard = function () {

    let board = Array.from(UICtrl.UIVars.boardBody.children)

    board = board.map((item) => Array.from(item.children))

    const newBoard = []

    board.forEach((item) => { item.forEach((nx) => { newBoard.push(nx) }) })

    return newBoard
  }

  const fillBoard = function () {

    let board = UserCtrl.getData('board')

    const UIBoard = getUIBoard()

    board = verifyBoard(board)

    const boardX = board.boardPoints

    boardX.forEach((item, index) => {

      if (item === "") {

        UICtrl.removeClass(UIBoard[index], 'i-am-F')

        UICtrl.removeClass(UIBoard[index], 'i-am-D')

        UICtrl.removeClass(UIBoard[index], 'i-am-E')

        if (UIBoard[index].innerHTML === "") {
          UIBoard[index].innerHTML = boardVars.emptySocket
        }

        UICtrl.addClass(UIBoard[index], 'hide')

        setTimeout(() => {

          UICtrl.removeClass(UIBoard[index], 'hide')

          UIBoard[index].innerHTML = boardVars.emptySocket

          UICtrl.removeClass(UIBoard[index], 'i-am-x')

          UICtrl.removeClass(UIBoard[index], 'i-am-o')

        }, 500)

      } else if (item === "X") {

        UICtrl.removeClass(UIBoard[index], 'i-am-F')

        UICtrl.removeClass(UIBoard[index], 'i-am-E')

        UICtrl.removeClass(UIBoard[index], 'i-am-D')

        if (!UIBoard[index].classList.contains('i-am-x')) {

          UIBoard[index].innerHTML = boardVars.xSocket

          UICtrl.removeClass(UIBoard[index], 'i-am-o')

          UICtrl.addClass(UIBoard[index], 'i-am-x')

        }

      } else if (item === "O") {

        UICtrl.removeClass(UIBoard[index], 'i-am-F')

        UICtrl.removeClass(UIBoard[index], 'i-am-E')

        UICtrl.removeClass(UIBoard[index], 'i-am-D')

        if (!UIBoard[index].classList.contains('i-am-o')) {

          UIBoard[index].innerHTML = boardVars.oSocket

          UICtrl.removeClass(UIBoard[index], 'i-am-x')

          UICtrl.addClass(UIBoard[index], 'i-am-o')

        }

      } else if (item === "E") {

        UICtrl.removeClass(UIBoard[index], 'i-am-x')

        UICtrl.removeClass(UIBoard[index], 'i-am-o')

        UICtrl.removeClass(UIBoard[index], 'i-am-F')

        UICtrl.removeClass(UIBoard[index], 'i-am-D')

        UICtrl.addClass(UIBoard[index], 'i-am-E')

      } else if (item === "D") {

        UICtrl.removeClass(UIBoard[index], 'i-am-x')

        UICtrl.removeClass(UIBoard[index], 'i-am-o')

        UICtrl.removeClass(UIBoard[index], 'i-am-E')

        UICtrl.removeClass(UIBoard[index], 'i-am-F')

        UICtrl.addClass(UIBoard[index], 'i-am-D')

      } else if (item === "F") {

        UICtrl.removeClass(UIBoard[index], 'i-am-x')

        UICtrl.removeClass(UIBoard[index], 'i-am-o')

        UICtrl.removeClass(UIBoard[index], 'i-am-E')

        UICtrl.removeClass(UIBoard[index], 'i-am-D')

        UICtrl.addClass(UIBoard[index], 'i-am-F')

      } else {

        UICtrl.removeClass(UIBoard[index], 'i-am-D')

        UICtrl.removeClass(UIBoard[index], 'i-am-E')

        if (UIBoard[index].innerHTML === "") {
          UIBoard[index].innerHTML = boardVars.emptySocket
        }

        UICtrl.addClass(UIBoard[index], 'hide')

        setTimeout(() => {

          UICtrl.removeClass(UIBoard[index], 'hide')

          UIBoard[index].innerHTML = boardVars.emptySocket

          UICtrl.removeClass(UIBoard[index], 'i-am-x')

          UICtrl.removeClass(UIBoard[index], 'i-am-o')

        }, 500)

      }

    });

    updateScoreboard(board)

    updateCellLabels(board)

    updateStatus(board)

    UICtrl.addClass(UICtrl.UIVars.boardCover, 'cover')

    setTimeout(() => {

      UICtrl.removeClass(UICtrl.UIVars.boardCover, 'cover')

    }, 700);

    redoUndoStatus()

  }

  // Scoreboard, turn highlight, accessible labels and status line
  const letterChip = function (letter) {

    return `<span class="letter letter-${letter.toLowerCase()}" aria-hidden="true">${letter}</span>`

  }

  const updateScoreboard = function (board) {

    const letter = board.playerLetter === 'O' ? 'O' : 'X'

    const xletter = letter === 'X' ? 'O' : 'X'

    const total = UserCtrl.getData('stat total')

    UICtrl.UIVars.boardName.innerHTML = `
      <span class="who">${letterChip(letter)}<span class="who-name">${escapeHtml(board.name)}</span></span><span class="score">${total[0]}</span>
    `

    UICtrl.UIVars.boardXname.innerHTML = `
      <span class="who">${letterChip(xletter)}<span class="who-name">${escapeHtml(board.xname)}</span></span><span class="score">${total[1]}</span>
    `

    UICtrl.UIVars.boardDraws.innerHTML = `
      <span class="who"><span class="who-name">Draw</span></span><span class="score">${total[2]}</span>
    `

    const over = isGameOver(board)

    const nameTurn = board.turn === board.name

    UICtrl.UIVars.boardName.classList.toggle('is-turn', !over && nameTurn)

    UICtrl.UIVars.boardXname.classList.toggle('is-turn', !over && !nameTurn)

  }

  const isGameOver = function (board) {

    return board.boardPoints.some(item => ['E', 'D', 'F'].includes(item))

  }

  const updateCellLabels = function (board) {

    const states = { '': 'empty', X: 'X', O: 'O', E: 'X, winning cell', D: 'O, winning cell', F: 'draw' }

    getUIBoard().forEach((cell, index) => {

      const state = states[board.boardPoints[index]] || 'empty'

      cell.setAttribute('aria-label',
        `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}: ${state}`)

      cell.setAttribute('aria-disabled', board.boardPoints[index] !== '' || isGameOver(board))

    })

  }

  const updateStatus = function (board) {

    const status = UICtrl.UIVars.gameStatus

    if (!status) { return }

    let text = ''

    let over = true

    if (board.boardPoints.includes('F')) {

      text = 'The match ends in a tie'

    } else if (board.boardPoints.includes('E') || board.boardPoints.includes('D')) {

      const winLetter = board.boardPoints.includes('E') ? 'X' : 'O'

      const winner = board.playerLetter === winLetter ? board.name : board.xname

      text = `${winner} (${winLetter}) wins`

    } else {

      over = false

      const letter = board.turn === board.name ? board.playerLetter : (board.playerLetter === 'X' ? 'O' : 'X')

      text = board.numbPlay === 'one' && board.turn === board.xname
        ? `${board.xname} is thinking...`
        : `${board.turn}'s turn (${letter})`

    }

    status.textContent = text

    status.classList.toggle('is-over', over)

  }

  const checkForWin = function () {

    const board = UserCtrl.getData('board')

    const theBoard = board.boardPoints

    const winningConditions = [

      // Horisontal Conditions
      [(theBoard[0] === theBoard[3] && theBoard[3] === theBoard[6] && theBoard[6] !== ''), theBoard[6]],

      [(theBoard[1] === theBoard[4] && theBoard[4] === theBoard[7] && theBoard[7] !== ''), theBoard[7]],

      [(theBoard[2] === theBoard[5] && theBoard[5] === theBoard[8] && theBoard[8] !== ''), theBoard[8]],


      // Vertical Conditions
      [(theBoard[0] === theBoard[1] && theBoard[1] === theBoard[2] && theBoard[2] !== ''), theBoard[2]],

      [(theBoard[3] === theBoard[4] && theBoard[4] === theBoard[5] && theBoard[5] !== ''), theBoard[5]],

      [(theBoard[6] === theBoard[7] && theBoard[7] === theBoard[8] && theBoard[8] !== ''), theBoard[8]],


      // Diaginal Conditions
      [(theBoard[0] === theBoard[4] && theBoard[4] === theBoard[8] && theBoard[8] !== ''), theBoard[8]],

      [(theBoard[2] === theBoard[4] && theBoard[4] === theBoard[6] && theBoard[6] !== ''), theBoard[6]],

    ]

    let won = false; let winner = ''

    winningConditions.forEach((item) => {

      if (item[0]) {

        won = true

        winner = item[1]

      }

    })

    if (won) {

      winner = board.playerLetter === winner ? board.name : board.xname

      if (!board.won) {

        endMessage(winner)

        endAction(winner)

        const xer = UserCtrl.getData('board')

        xer.won = true

        UserCtrl.setData('board', xer)

      }

    }

  }

  const endAction = function (winner) {

    const board = UserCtrl.getData('board')

    switch (winner) {

      case board.name:

        if (board.numbPlay === 'one') {

          const stats = UserCtrl.getData(`stat ${board.difficulty}`)

          stats[0]++

          UserCtrl.setData(`stat ${board.difficulty}`, stats)

        } else {

          const stats = UserCtrl.getData(`stat friend`)

          stats[0]++

          UserCtrl.setData(`stat friend`, stats)

        }

        break;

      case board.xname:

        if (board.numbPlay === 'one') {

          const stats = UserCtrl.getData(`stat ${board.difficulty}`)

          stats[1]++

          UserCtrl.setData(`stat ${board.difficulty}`, stats)

        } else {

          const stats = UserCtrl.getData(`stat friend`)

          stats[1]++

          UserCtrl.setData(`stat friend`, stats)

        }

        break;

      case 'draw':

        if (board.numbPlay === 'one') {

          const stats = UserCtrl.getData(`stat ${board.difficulty}`)

          stats[2]++

          UserCtrl.setData(`stat ${board.difficulty}`, stats)

        } else {

          const stats = UserCtrl.getData(`stat friend`)

          stats[2]++

          UserCtrl.setData(`stat friend`, stats)

        }

        break;

      default:
        break;
    }

    const winningConditions = [

      // Horisontal Conditions
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      // Vertical Conditions
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      // Diaginal Conditions
      [0, 4, 8],
      [2, 4, 6],

    ]

    for (let i = 0; i < winningConditions.length; i++) {
      const item = winningConditions[i];

      const bp = board.boardPoints

      if (bp[item[0]] === bp[item[1]] && bp[item[1]] === bp[item[2]]) {

        if (bp[item[2]] !== "") {

          board.boardPoints[item[0]] = bp[item[2]] === 'X' ? 'E' : 'D'

          board.boardPoints[item[1]] = bp[item[2]] === 'X' ? 'E' : 'D'

          board.boardPoints[item[2]] = bp[item[2]] === 'X' ? 'E' : 'D'

        }

      }

    }

    board.boardPoints.forEach((item, index) => {
      if (item !== 'E' && item !== 'D') { board.boardPoints[index] = '' }
      if (winner === 'draw') { board.boardPoints[index] = 'F' }
    })

    UserCtrl.setData('board', board)

    fillBoard()

    setTimeout(() => {

      const boards = verifyBoard(newBoard())

      UserCtrl.setData('board', boards)

      fillBoard()

      checkComputerTurn()

    }, 2000)

  }

  const endMessage = function (winner) {

    const board = UserCtrl.getData('board')

    let message = '';

    switch (winner) {

      case board.name:

        if (board.numbPlay === 'one') {

          if (board.difficulty === 'hard') {

            message = `Congratulations, you have won`

          } else {

            const stats = UserCtrl.getData(`stat ${board.difficulty}`)

            if (stats[0] >= (stats[1] + 10)) {

              message = `Congratulations, you have won. Try increasing the diffiulty`

            } else {

              message = `Congratulations, you have won`

            }

          }

        } else {

          message = `Congratulations, ${board.name} have won, and ${board.xname} has lost`

        }

        break;

      case board.xname:

        if (board.numbPlay === 'one') {

          if (board.difficulty === 'easy') {

            message = `Unfortunately, you have lost`

          } else {

            const stats = UserCtrl.getData(`stat ${board.difficulty}`)

            if (stats[1] >= (stats[0] + 10)) {

              message = `Unfortunately, you have lost. Try reducing the diffiulty`

            } else {

              message = `Unfortunately, you have lost`

            }

          }

        } else {

          message = `Congratulations, ${board.xname} have won, and ${board.name} has lost`

        }

        break;

      case 'draw':

        message = 'The match ends in a Tie!'

        break;

      default:

        message = `Who won`

        break;

    }

    UICtrl.sendSmallMessage(message, 2000)

  }

  const redoUndoStatus = function () {

    const board = UserCtrl.getData('board')

    const redoList = board.redoPoints

    const undoList = board.playingPoints

    if (redoList.length === 0) {

      UICtrl.addClass(UICtrl.UIVars.boardRedo, 'hide')

    } else {

      if (board.numbPlay === 'one') {

        if (redoList.length === 1) {

          UICtrl.addClass(UICtrl.UIVars.boardRedo, 'hide')

        } else {

          UICtrl.removeClass(UICtrl.UIVars.boardRedo, 'hide')

        }

      } else {

        UICtrl.removeClass(UICtrl.UIVars.boardRedo, 'hide')

      }

    }

    if (undoList.length === 0) {

      UICtrl.addClass(UICtrl.UIVars.boardUndo, 'hide')

    } else {

      if (board.numbPlay === 'one') {

        if (undoList.length === 1) {

          UICtrl.addClass(UICtrl.UIVars.boardUndo, 'hide')

        } else {

          UICtrl.removeClass(UICtrl.UIVars.boardUndo, 'hide')

        }

      } else {

        UICtrl.removeClass(UICtrl.UIVars.boardUndo, 'hide')

      }


    }

  }

  const checkForFullBoard = function () {

    const board = UserCtrl.getData('board')

    const theBoard = board.boardPoints

    let draw = true

    theBoard.forEach((item) => {

      if (item === '') {

        draw = false

      }

    })

    if (draw) {

      if (!board.won) {

        endAction('draw')

        endMessage('draw')

        const xer = UserCtrl.getData('board')

        xer.won = true

        UserCtrl.setData('board', xer)

      }

    }

  }

  const storePattern = function (name, letter, index) {

    const board = UserCtrl.getData('board')

    const playingPoints = board.playingPoints

    playingPoints.push([name, letter, index, playingPoints.length])

    board.playingPoints = playingPoints

    UserCtrl.setData('board', board)

  }

  const boardEventListeners = function () {

    UICtrl.UIVars.boardReset.addEventListener('click', () => {

      const board = verifyBoard(newBoard())

      UserCtrl.setData('board', board)

      fillBoard()

      UICtrl.sendSmallMessage('Board has been reset!', 1000)

      checkComputerTurn()

    })

    UICtrl.UIVars.boardUndo.addEventListener('click', () => {

      redoUndoStatus()

      const board = UserCtrl.getData('board')

      if (board.numbPlay === 'one') {

        if (UICtrl.UIVars.boardUndo.classList.contains('hide')) {

          UICtrl.sendSmallMessage('Nothing to Undo!', 700)

        } else {

          const pointList = []

          board.playingPoints.forEach((item) => {

            pointList.push(item)

          })

          pointList.sort((a, b) => a[3] - b[3])

          const pointItem = pointList[pointList.length - 1]

          const pointItem2 = pointList[pointList.length - 2]

          board.boardPoints[pointItem[2]] = ''

          board.boardPoints[pointItem2[2]] = ''

          board.playingPoints.pop()

          board.playingPoints.pop()

          board.redoPoints.push(pointItem)

          board.redoPoints.push(pointItem2)

          UserCtrl.setData('board', board)

          fillBoard()

        }

      } else {

        if (UICtrl.UIVars.boardUndo.classList.contains('hide')) {

          UICtrl.sendSmallMessage('Nothing to Undo!', 700)

        } else {

          const pointList = []

          board.playingPoints.forEach((item) => {

            pointList.push(item)

          })

          pointList.sort((a, b) => a[3] - b[3])

          const pointItem = pointList[pointList.length - 1]

          board.boardPoints[pointItem[2]] = ''

          board.playingPoints.pop()

          board.redoPoints.push(pointItem)

          board.turn = board.turn === board.name ? board.xname : board.name

          UserCtrl.setData('board', board)

          fillBoard()

        }

      }

      checkComputerTurn()

    })

    UICtrl.UIVars.boardRedo.addEventListener('click', () => {

      redoUndoStatus()

      const board = UserCtrl.getData('board')

      if (board.numbPlay === 'one') {

        if (UICtrl.UIVars.boardRedo.classList.contains('hide')) {

          UICtrl.sendSmallMessage('Nothing to Redo!', 700)

        } else {

          const pointList = []

          board.redoPoints.forEach((item) => {

            pointList.push(item)

          })

          pointList.sort((a, b) => b[3] - a[3])

          const pointItem = pointList[pointList.length - 1]

          const pointItem2 = pointList[pointList.length - 2]

          board.boardPoints[pointItem[2]] = pointItem[1]

          board.boardPoints[pointItem2[2]] = pointItem2[1]

          board.redoPoints.pop()

          board.redoPoints.pop()

          board.playingPoints.push(pointItem)

          board.playingPoints.push(pointItem2)

          UserCtrl.setData('board', board)

          fillBoard()

        }

      } else {

        if (UICtrl.UIVars.boardRedo.classList.contains('hide')) {

          UICtrl.sendSmallMessage('Nothing to Redo!', 700)

        } else {

          const pointList = []

          board.redoPoints.forEach((item) => {

            pointList.push(item)

          })

          pointList.sort((a, b) => b[3] - a[3])

          const pointItem = pointList[pointList.length - 1]

          board.boardPoints[pointItem[2]] = pointItem[1]

          board.redoPoints.pop()

          board.playingPoints.push(pointItem)

          board.turn = board.turn === board.name ? board.xname : board.name

          UserCtrl.setData('board', board)

          fillBoard()

        }

      }

      checkComputerTurn()

    })

    getUIBoard().forEach((item, index) => {

      item.setAttribute('tabindex', '0')

      item.setAttribute('role', 'button')

      item.addEventListener('keydown', (e) => {

        if (e.key === 'Enter' || e.key === ' ') {

          e.preventDefault()

          // Keyboard input must respect the same animation lock as the mouse
          if (!UICtrl.UIVars.boardCover.classList.contains('cover')) { item.click() }

        }

      })

      item.addEventListener('click', (e) => {

        const board = UserCtrl.getData('board')

        if (board.won) { return }

        if (board.boardPoints[index] === '') {

          if (board.numbPlay === 'one') {

            if (board.turn === board.name) {

              board.boardPoints[index] = board.playerLetter

              board.redoPoints = []

              board.turn = board.xname

              UserCtrl.setData('board', board)

              storePattern(board.name, board.playerLetter, index)

              fillBoard()

              redoUndoStatus()

              checkForWin()

              checkForFullBoard()

              checkComputerTurn()

            } else {

              UICtrl.sendSmallMessage(`It is not your turn`, 700)

            }

          } else {

            if (board.turn === board.name) {

              board.boardPoints[index] = board.playerLetter

              board.turn = board.xname

              board.redoPoints = []

              UserCtrl.setData('board', board)

              storePattern(board.name, board.playerLetter, index)

              fillBoard()

              redoUndoStatus()

              checkForWin()

              checkForFullBoard()

            } else {

              board.boardPoints[index] = board.playerLetter === 'X' ? 'O' : 'X'

              board.redoPoints = []

              board.turn = board.name

              UserCtrl.setData('board', board)

              storePattern(board.xname, board.boardPoints[index], index)

              fillBoard()

              redoUndoStatus()

              checkForWin()

              checkForFullBoard()

            }

            UICtrl.sendSmallMessage(`${board.turn} turn`, 700)

          }

        } else {

          UICtrl.sendSmallMessage('Position is taken!', 700)

        }

        checkComputerTurn()

      })

    })

  }

  const checkComputerTurn = function () {

    const board = UserCtrl.getData('board')

    if (board.numbPlay === 'one') {

      if (board.turn === board.xname) {

        if (!board.won) {

          computerTurn()

        }

      }

    }

  }

  const randomAmong = function (a, b) {

    return (a + Math.floor(Math.random() * (b - a + 1)))

  }

  const chooseFrom = function (arr) {

    return arr[randomAmong(0, arr.length - 1)]

  }

  const computerTurn = function () {

    // Init Begins

    checkForFullBoard()

    checkForWin()

    const board = UserCtrl.getData('board')

    const letter = board.playerLetter === 'O' ? 'X' : 'O'

    let theNumber;

    // Init Ends


    // Logic Begins

    switch (board.difficulty) {

      case 'easy':

        theNumber = computerEasyMode()

        break;

      case 'medium':

        theNumber = computerMediumMode()

        break;

      case 'hard':

        theNumber = computerHardMode()

        break;

      default:

        theNumber = computerEasyMode()

        break;

    }

    // Logic Ends


    // End Works Begins

    board.boardPoints[theNumber] = letter

    board.redoPoints = []

    board.turn = board.name

    UserCtrl.setData('board', board)

    storePattern(board.xname, letter, theNumber)

    // End Works Ends

    setTimeout(() => {

      fillBoard()

      redoUndoStatus()

      checkForWin()

      checkForFullBoard()

    }, 700)

  }

  const computerEasyMode = function () {

    const board = UserCtrl.getData('board')

    const allPos = board.boardPoints.map((item, index) => {

      return [item, index]

    })

    const takenPos = allPos.filter(x => x[0] !== '')

    const freePos = allPos.filter(x => x[0] === '')

    const oppPos = takenPos.filter(x => x[0] == board.playerLetter)

    const letter = board.playerLetter === 'O' ? 'X' : 'O'

    const yourPos = takenPos.filter(x => x[0] == letter)

    let theNumber = getEasyNum(oppPos, yourPos, freePos)

    return theNumber

  }

  const computerMediumMode = function () {

    const board = UserCtrl.getData('board')

    const allPos = board.boardPoints.map((item, index) => {

      return [item, index]

    })

    const takenPos = allPos.filter(x => x[0] !== '')

    const freePos = allPos.filter(x => x[0] === '')

    const oppPos = takenPos.filter(x => x[0] == board.playerLetter)

    const letter = board.playerLetter === 'O' ? 'X' : 'O'

    const yourPos = takenPos.filter(x => x[0] == letter)

    let theNumber = getMedNum(oppPos, yourPos, freePos)

    return theNumber

  }

  const computerHardMode = function () {

    const board = UserCtrl.getData('board')

    const allPos = board.boardPoints.map((item, index) => {

      return [item, index]

    })

    const takenPos = allPos.filter(x => x[0] !== '')

    const freePos = allPos.filter(x => x[0] === '')

    const oppPos = takenPos.filter(x => x[0] == board.playerLetter)

    const letter = board.playerLetter === 'O' ? 'X' : 'O'

    const yourPos = takenPos.filter(x => x[0] == letter)

    let theNumber = getHardNum(oppPos, yourPos, freePos)

    return theNumber

  }

  const getEasyNum = function (opTaken, myTaken, frePos) {

    const op = opTaken.map(item => item[1])

    const mp = myTaken.map(item => item[1])

    const fp = frePos.map(item => item[1])

    const almostConditions = [

      // Horisontal Conditions
      [0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 1, 0], [2, 0, 1],
      [3, 4, 5], [3, 5, 4], [4, 3, 5], [4, 5, 3], [5, 4, 3], [5, 3, 4],
      [6, 7, 8], [6, 8, 7], [7, 6, 8], [7, 8, 6], [8, 7, 6], [8, 6, 7],

      // Vertical Conditions
      [0, 3, 6], [0, 6, 3], [3, 0, 6], [3, 6, 0], [6, 3, 0], [6, 0, 3],
      [1, 4, 7], [1, 7, 4], [4, 1, 7], [4, 7, 1], [7, 4, 1], [7, 1, 4],
      [2, 5, 8], [2, 8, 5], [5, 2, 8], [5, 8, 2], [8, 5, 2], [8, 2, 5],

      // Diagonal Conditions
      [0, 4, 8], [0, 8, 4], [4, 0, 8], [4, 8, 0], [8, 4, 0], [8, 0, 4],
      [2, 4, 6], [2, 6, 4], [4, 2, 6], [4, 6, 2], [6, 4, 2], [6, 2, 4]

    ]

    let returnNumb = undefined;

    // Wins if free path is open
    if (returnNumb === undefined) {

      almostConditions.forEach(item => {

        if (mp.indexOf(item[0]) !== -1 && mp.indexOf(item[1]) !== -1) {
          // Check if computer has two almost taken

          if (fp.indexOf(item[2]) !== -1) {
            // Check if the position is free

            returnNumb = item[2]

          }

        }

      })

    }

    // Blocks opponent chance of winning
    if (returnNumb === undefined) {

      almostConditions.forEach(item => {

        if (op.indexOf(item[0]) !== -1 && op.indexOf(item[1]) !== -1) {
          // Check if human has two almost taken

          if (fp.indexOf(item[2]) !== -1) {
            // Check if the position is free

            returnNumb = item[2]

          }

        }

      })

    }

    // Work basic pattern to follow
    if (returnNumb === undefined) {

      // works to continue pattern to follow

      let xcon = almostConditions.slice()

      while (xcon.length > 1) {

        let testList = chooseFrom(xcon);

        let tester = mp.indexOf(testList[0]) !== -1 &&
          fp.indexOf(testList[1]) !== -1 &&
          fp.indexOf(testList[2]) !== -1

        if (tester) {

          returnNumb = chooseFrom([testList[1], testList[2]])

          break

        } else {

          for (let i = 0; i < xcon.length; i++) {
            const item = xcon[i].toString();

            if (item == testList.toString()) { xcon.splice(i, 1) }
          }

        }

      }

    }

    // Start basic pattern to follow
    if (returnNumb === undefined) {

      // works to start pattern to follow

      let xcon = almostConditions.slice()

      while (xcon.length > 1) {

        let testList = chooseFrom(xcon);

        let tester = fp.indexOf(testList[0]) !== -1 &&
          fp.indexOf(testList[1]) !== -1 &&
          fp.indexOf(testList[2]) !== -1

        if (tester) {

          returnNumb = chooseFrom(testList)

          break

        } else {


          for (let i = 0; i < xcon.length; i++) {
            const item = xcon[i].toString();

            if (item == testList.toString()) { xcon.splice(i, 1) }
          }

        }

      }

    }

    // Ultimate Fall back chooses at random
    if (returnNumb === undefined) {

      returnNumb = chooseFrom(fp)

    }

    return returnNumb

  }

  const getMedNum = function (opTaken, myTaken, frePos) {

    const op = opTaken.map(item => item[1])

    const mp = myTaken.map(item => item[1])

    const fp = frePos.map(item => item[1])

    const almostConditions = [

      // Horisontal Conditions
      [0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 1, 0], [2, 0, 1],
      [3, 4, 5], [3, 5, 4], [4, 3, 5], [4, 5, 3], [5, 4, 3], [5, 3, 4],
      [6, 7, 8], [6, 8, 7], [7, 6, 8], [7, 8, 6], [8, 7, 6], [8, 6, 7],

      // Vertical Conditions
      [0, 3, 6], [0, 6, 3], [3, 0, 6], [3, 6, 0], [6, 3, 0], [6, 0, 3],
      [1, 4, 7], [1, 7, 4], [4, 1, 7], [4, 7, 1], [7, 4, 1], [7, 1, 4],
      [2, 5, 8], [2, 8, 5], [5, 2, 8], [5, 8, 2], [8, 5, 2], [8, 2, 5],

      // Diagonal Conditions
      [0, 4, 8], [0, 8, 4], [4, 0, 8], [4, 8, 0], [8, 4, 0], [8, 0, 4],
      [2, 4, 6], [2, 6, 4], [4, 2, 6], [4, 6, 2], [6, 4, 2], [6, 2, 4]

    ]

    const defs = {
      center: [4],
      edge: [1, 3, 5, 7],
      corner: [0, 2, 6, 8],
      all: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    }

    // To get Two Ways
    const twWork = [

      [4, 1, 6], [4, 1, 8], [4, 5, 0], [4, 5, 6], [4, 7, 0], [4, 7, 2],
      [4, 3, 8], [4, 3, 2],
      // Center, Edge, Corner //

      [4, 0, 8, 3, 6], [4, 0, 8, 1, 2], [4, 0, 8, 5, 6], [4, 0, 8, 7, 2],
      // Center, Corner, Corner, Edge, Corner//

      [0, 1, 6, 3, 8], [0, 1, 2, 3, 4], [0, 2, 6, 3, 8], [0, 2, 8, 4, 6],
      [0, 5, 6, 3, 4], [0, 5, 2, 1, 6], [0, 5, 2, 1, 4], [0, 8, 6, 3, 2],
      [0, 8, 2, 1, 6], [0, 7, 2, 1, 4], [0, 7, 6, 3, 2], [0, 7, 6, 3, 4],
      [0, 6, 2, 1, 8], [0, 3, 6, 7, 4], [0, 3, 2, 1, 4], [0, 3, 6, 7, 4],
      [0, 3, 6, 1, 4], [0, 3, 6, 5, 4], [0, 3, 2, 1, 8],
      // Corner, Not Center //

      [2, 0, 6, 4, 8], [2, 0, 8, 5, 6], [2, 1, 0, 5, 4], [2, 1, 0, 3, 4],
      [2, 1, 0, 7, 4], [2, 1, 8, 5, 4], [2, 1, 8, 5, 6], [2, 5, 8, 1, 4],
      [2, 5, 8, 7, 4], [2, 5, 8, 3, 4], [2, 5, 8, 1, 6], [2, 5, 8, 0, 6],
      [2, 5, 8, 6, 0], [2, 5, 8, 7, 0], [2, 5, 8, 1, 6], [2, 5, 0, 1, 6],
      [2, 5, 0, 1, 4], [2, 8, 0, 1, 6], [2, 8, 6, 4, 0], [2, 8, 0, 1, 6],
      [2, 7, 8, 5, 4], [2, 7, 8, 5, 0], [2, 7, 0, 1, 4], [2, 6, 8, 5, 0],
      [2, 6, 0, 1, 8], [2, 6, 0, 1, 8], [2, 3, 8, 5, 4], [2, 3, 0, 1, 8],
      [2, 3, 0, 1, 8], [2, 0, 8, 5, 6], [2, 0, 6, 4, 8],
      // Corner, Not Center //

      [8, 0, 6, 7, 2], [8, 0, 2, 5, 6], [8, 1, 2, 5, 6], [8, 1, 6, 7, 4],
      [8, 2, 6, 7, 0], [8, 5, 2, 1, 4], [8, 5, 2, 7, 4], [8, 5, 2, 3, 4],
      [8, 5, 2, 7, 0], [8, 5, 2, 1, 6], [8, 5, 2, 6, 0], [8, 5, 2, 0, 6],
      [8, 5, 6, 7, 0], [8, 7, 2, 5, 0], [8, 7, 6, 3, 4], [8, 7, 6, 0, 2],
      [8, 7, 6, 1, 4], [8, 7, 6, 3, 2], [8, 7, 6, 3, 4], [8, 7, 6, 2, 0],
      [8, 7, 6, 5, 4], [8, 7, 6, 5, 0], [8, 7, 2, 5, 4], [8, 7, 2, 5, 0],
      [8, 6, 2, 5, 0], [8, 3, 6, 7, 4], [8, 3, 2, 5, 4], [8, 3, 6, 7, 2],
      [8, 3, 6, 7, 4],
      // Corner, Not Center //

      [6, 0, 8, 7, 2], [6, 1, 8, 7, 4], [6, 1, 0, 3, 4], [6, 1, 0, 3, 8],
      [6, 2, 0, 3, 8], [6, 2, 8, 7, 0], [6, 2, 0, 3, 8], [6, 5, 8, 7, 4],
      [6, 5, 0, 3, 4], [6, 5, 8, 7, 0], [6, 8, 0, 3, 2], [6, 7, 8, 5, 4],
      [6, 7, 8, 5, 0], [6, 7, 8, 2, 0], [6, 7, 8, 1, 4], [6, 7, 8, 0, 2],
      [6, 7, 8, 3, 4], [6, 7, 8, 3, 2], [6, 7, 0, 3, 4], [6, 7, 0, 3, 2],
      [6, 3, 0, 7, 4], [6, 3, 0, 7, 2], [6, 3, 0, 8, 2], [6, 3, 0, 5, 4],
      [6, 3, 0, 2, 8], [6, 3, 0, 1, 4], [6, 3, 0, 1, 4], [6, 3, 0, 1, 8],
      [6, 3, 8, 7, 4], [6, 3, 8, 7, 2], [6, 0, 2, 4, 8]
      // Corner, Not Center //

    ]

    let returnNumb = undefined;

    // Wins if free path is open
    if (returnNumb === undefined) {

      almostConditions.forEach(item => {

        if (mp.indexOf(item[0]) !== -1 && mp.indexOf(item[1]) !== -1) {
          // Check if computer has two almost taken

          if (fp.indexOf(item[2]) !== -1) {
            // Check if the position is free

            returnNumb = item[2]

          }

        }

      })

    }

    // Blocks opponent chance of winning
    if (returnNumb === undefined) {

      almostConditions.forEach(item => {

        if (op.indexOf(item[0]) !== -1 && op.indexOf(item[1]) !== -1) {
          // Check if human has two almost taken

          if (fp.indexOf(item[2]) !== -1) {
            // Check if the position is free

            returnNumb = item[2]

          }

        }

      })

    }

    // Work Two Ways
    if (returnNumb === undefined) {

      if (fp.length > 9) {

        returnNumb = chooseFrom(defs.all.concat(defs.corner, defs.center, defs.corner, defs.center, defs.center, defs.center, defs.center))

      } else if (fp.length <= 9) {

        // Third play in two ways
        if (returnNumb === undefined) {

          // works to play third part in 2 way pattern 

          let xcon = twWork.slice();

          while (xcon.length > 1) {

            let testList = chooseFrom(xcon);

            if (testList.length >= 5) {

              let tester = true

              // Check for conditions to use two ways
              testList.forEach((item, index) => {

                let medium

                // check if all items are free but item 0 and item 2 
                // should be taken by the computer and 
                // item 1 and item 3 should be taken by the opponent
                if (index === 0 || index === 2) {

                  medium = mp.includes(item)

                } else if (index === 1 || index === 3) {

                  medium = op.includes(item)

                } else {

                  medium = fp.includes(item)

                }

                tester = tester && medium

              })

              if (tester) {

                returnNumb = testList[4]

                break

              } else {

                for (let i = 0; i < xcon.length; i++) {
                  const item = xcon[i].toString();

                  if (item == testList.toString()) { xcon.splice(i, 1) }
                }

              }

            } else {

              for (let i = 0; i < xcon.length; i++) {
                const item = xcon[i].toString();

                if (item == testList.toString()) { xcon.splice(i, 1) }
              }

            }

          }

        }

        // Second play in two ways
        if (returnNumb === undefined) {

          // works to play second part in 2 way pattern 

          let xcon = twWork.slice()

          while (xcon.length >= 1) {

            let testList = chooseFrom(xcon);

            if (testList.length >= 3) {

              let tester = true

              // Check for conditions to use two ways
              testList.forEach((item, index) => {

                let medium

                // check if all items are free but item 0 should be taken
                // by the computer and item 1 should be taken by the opponent
                if (index === 0) {

                  medium = mp.includes(item)

                } else if (index === 1) {

                  medium = op.includes(item)

                } else {

                  medium = fp.includes(item)

                }

                tester = tester && medium

              })

              if (tester) {

                returnNumb = testList[2]

                break

              } else {

                for (let i = 0; i < xcon.length; i++) {
                  const item = xcon[i].toString();

                  if (item == testList.toString()) { xcon.splice(i, 1) }
                }

              }

            } else {

              for (let i = 0; i < xcon.length; i++) {
                const item = xcon[i].toString();

                if (item == testList.toString()) { xcon.splice(i, 1) }
              }

            }

          }

        }

        // Initialize Two ways
        if (returnNumb === undefined) {

          // works to start 2 way pattern to win

          let xcon = twWork.slice();

          while (xcon.length > 1) {

            let testList = chooseFrom(xcon);

            let tester = true

            // Check for conditions to use two ways
            testList.forEach(item => {

              // chek if all items are free
              let medium = fp.includes(item)

              tester = tester && medium

            })

            if (tester) {

              returnNumb = testList[0]

              break

            } else {

              for (let i = 0; i < xcon.length; i++) {
                const item = xcon[i].toString();

                if (item == testList.toString()) { xcon.splice(i, 1) }
              }

            }

          }

        }

      }

    }

    // Work basic pattern to follow
    if (returnNumb === undefined) {

      // works to continue pattern to follow

      let xcon = almostConditions.slice()

      while (xcon.length > 1) {

        let testList = chooseFrom(xcon);

        let tester = mp.indexOf(testList[0]) !== -1 &&
          fp.indexOf(testList[1]) !== -1 &&
          fp.indexOf(testList[2]) !== -1

        if (tester) {

          returnNumb = chooseFrom([testList[1], testList[2]])

          break

        } else {

          for (let i = 0; i < xcon.length; i++) {
            const item = xcon[i].toString();

            if (item == testList.toString()) { xcon.splice(i, 1) }
          }

        }

      }

    }

    // Start basic pattern to follow
    if (returnNumb === undefined) {

      // works to start pattern to follow

      let xcon = almostConditions.slice()

      while (xcon.length > 1) {

        let testList = chooseFrom(xcon);

        let tester = fp.indexOf(testList[0]) !== -1 &&
          fp.indexOf(testList[1]) !== -1 &&
          fp.indexOf(testList[2]) !== -1

        if (tester) {

          returnNumb = chooseFrom(testList)

          break

        } else {


          for (let i = 0; i < xcon.length; i++) {
            const item = xcon[i].toString();

            if (item == testList.toString()) { xcon.splice(i, 1) }
          }

        }

      }

    }

    // Ultimate Fall back chooses at random
    if (returnNumb === undefined) {

      returnNumb = chooseFrom(fp)

    }

    return returnNumb

  }

  const getHardNum = function (opTaken, myTaken, frePos) {

    const op = opTaken.map(item => item[1])

    const mp = myTaken.map(item => item[1])

    const fp = frePos.map(item => item[1])

    const almostConditions = [

      // Horisontal Conditions
      [0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 1, 0], [2, 0, 1],
      [3, 4, 5], [3, 5, 4], [4, 3, 5], [4, 5, 3], [5, 4, 3], [5, 3, 4],
      [6, 7, 8], [6, 8, 7], [7, 6, 8], [7, 8, 6], [8, 7, 6], [8, 6, 7],

      // Vertical Conditions
      [0, 3, 6], [0, 6, 3], [3, 0, 6], [3, 6, 0], [6, 3, 0], [6, 0, 3],
      [1, 4, 7], [1, 7, 4], [4, 1, 7], [4, 7, 1], [7, 4, 1], [7, 1, 4],
      [2, 5, 8], [2, 8, 5], [5, 2, 8], [5, 8, 2], [8, 5, 2], [8, 2, 5],

      // Diagonal Conditions
      [0, 4, 8], [0, 8, 4], [4, 0, 8], [4, 8, 0], [8, 4, 0], [8, 0, 4],
      [2, 4, 6], [2, 6, 4], [4, 2, 6], [4, 6, 2], [6, 4, 2], [6, 2, 4]

    ]

    const defs = {
      center: [4],
      edge: [1, 3, 5, 7],
      corner: [0, 2, 6, 8],
      all: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    }

    // To get Two Ways
    const twWork = [

      [4, 1, 6], [4, 1, 8], [4, 5, 0], [4, 5, 6], [4, 7, 0], [4, 7, 2],
      [4, 3, 8], [4, 3, 2],
      // Center, Edge, Corner //

      [4, 0, 8, 3, 6], [4, 0, 8, 1, 2], [4, 0, 8, 5, 6], [4, 0, 8, 7, 2],
      // Center, Corner, Corner, Edge, Corner//

      [0, 1, 6, 3, 8], [0, 1, 2, 3, 4], [0, 2, 6, 3, 8], [0, 2, 8, 4, 6],
      [0, 5, 6, 3, 4], [0, 5, 2, 1, 6], [0, 5, 2, 1, 4], [0, 8, 6, 3, 2],
      [0, 8, 2, 1, 6], [0, 7, 2, 1, 4], [0, 7, 6, 3, 2], [0, 7, 6, 3, 4],
      [0, 6, 2, 1, 8], [0, 3, 6, 7, 4], [0, 3, 2, 1, 4], [0, 3, 6, 7, 4],
      [0, 3, 6, 1, 4], [0, 3, 6, 5, 4], [0, 3, 2, 1, 8],
      // Corner, Not Center //

      [2, 0, 6, 4, 8], [2, 0, 8, 5, 6], [2, 1, 0, 5, 4], [2, 1, 0, 3, 4],
      [2, 1, 0, 7, 4], [2, 1, 8, 5, 4], [2, 1, 8, 5, 6], [2, 5, 8, 1, 4],
      [2, 5, 8, 7, 4], [2, 5, 8, 3, 4], [2, 5, 8, 1, 6], [2, 5, 8, 0, 6],
      [2, 5, 8, 6, 0], [2, 5, 8, 7, 0], [2, 5, 8, 1, 6], [2, 5, 0, 1, 6],
      [2, 5, 0, 1, 4], [2, 8, 0, 1, 6], [2, 8, 6, 4, 0], [2, 8, 0, 1, 6],
      [2, 7, 8, 5, 4], [2, 7, 8, 5, 0], [2, 7, 0, 1, 4], [2, 6, 8, 5, 0],
      [2, 6, 0, 1, 8], [2, 6, 0, 1, 8], [2, 3, 8, 5, 4], [2, 3, 0, 1, 8],
      [2, 3, 0, 1, 8], [2, 0, 8, 5, 6], [2, 0, 6, 4, 8],
      // Corner, Not Center //

      [8, 0, 6, 7, 2], [8, 0, 2, 5, 6], [8, 1, 2, 5, 6], [8, 1, 6, 7, 4],
      [8, 2, 6, 7, 0], [8, 5, 2, 1, 4], [8, 5, 2, 7, 4], [8, 5, 2, 3, 4],
      [8, 5, 2, 7, 0], [8, 5, 2, 1, 6], [8, 5, 2, 6, 0], [8, 5, 2, 0, 6],
      [8, 5, 6, 7, 0], [8, 7, 2, 5, 0], [8, 7, 6, 3, 4], [8, 7, 6, 0, 2],
      [8, 7, 6, 1, 4], [8, 7, 6, 3, 2], [8, 7, 6, 3, 4], [8, 7, 6, 2, 0],
      [8, 7, 6, 5, 4], [8, 7, 6, 5, 0], [8, 7, 2, 5, 4], [8, 7, 2, 5, 0],
      [8, 6, 2, 5, 0], [8, 3, 6, 7, 4], [8, 3, 2, 5, 4], [8, 3, 6, 7, 2],
      [8, 3, 6, 7, 4],
      // Corner, Not Center //

      [6, 0, 8, 7, 2], [6, 1, 8, 7, 4], [6, 1, 0, 3, 4], [6, 1, 0, 3, 8],
      [6, 2, 0, 3, 8], [6, 2, 8, 7, 0], [6, 2, 0, 3, 8], [6, 5, 8, 7, 4],
      [6, 5, 0, 3, 4], [6, 5, 8, 7, 0], [6, 8, 0, 3, 2], [6, 7, 8, 5, 4],
      [6, 7, 8, 5, 0], [6, 7, 8, 2, 0], [6, 7, 8, 1, 4], [6, 7, 8, 0, 2],
      [6, 7, 8, 3, 4], [6, 7, 8, 3, 2], [6, 7, 0, 3, 4], [6, 7, 0, 3, 2],
      [6, 3, 0, 7, 4], [6, 3, 0, 7, 2], [6, 3, 0, 8, 2], [6, 3, 0, 5, 4],
      [6, 3, 0, 2, 8], [6, 3, 0, 1, 4], [6, 3, 0, 1, 4], [6, 3, 0, 1, 8],
      [6, 3, 8, 7, 4], [6, 3, 8, 7, 2], [6, 0, 2, 4, 8]
      // Corner, Not Center //

    ]

    // To stop Two Ways
    const twStop = [

      [4, 0, 8, 6], [4, 0, 8, 2], [4, 2, 6, 0], [4, 2, 6, 8], [4, 8, 0, 6],
      [4, 8, 0, 2], [4, 6, 2, 8], [4, 6, 2, 0], [4, 6, 2, 8], [0, 4, 6, 8],

      [0, 4, 8, 7], [0, 4, 8, 3], [0, 4, 8, 1], [0, 4, 8, 5], [2, 4, 6, 1],
      [2, 4, 6, 5], [2, 4, 6, 7], [2, 4, 6, 3], [8, 4, 0, 1], [8, 4, 0, 5],
      [8, 4, 0, 7], [8, 4, 0, 3], [6, 4, 2, 1], [6, 4, 2, 7], [6, 4, 2, 5],
      [6, 4, 2, 3]

    ]

    let returnNumb = undefined;

    // Wins if free path is open
    if (returnNumb === undefined) {

      almostConditions.forEach(item => {

        if (mp.indexOf(item[0]) !== -1 && mp.indexOf(item[1]) !== -1) {
          // Check if computer has two almost taken

          if (fp.indexOf(item[2]) !== -1) {
            // Check if the position is free

            returnNumb = item[2]

          }

        }

      })

    }

    // Blocks opponent chance of winning
    if (returnNumb === undefined) {

      almostConditions.forEach(item => {

        if (op.indexOf(item[0]) !== -1 && op.indexOf(item[1]) !== -1) {
          // Check if human has two almost taken

          if (fp.indexOf(item[2]) !== -1) {
            // Check if the position is free

            returnNumb = item[2]

          }

        }

      })

    }

    // Block Two Ways
    if (returnNumb === undefined) {

      if (fp.length <= 9) {

        // Third play in block
        if (returnNumb === undefined) {

          // works to play third part to block 

          let xcon = twStop.slice();

          while (xcon.length > 1) {

            let testList = chooseFrom(xcon);

            if (testList.length >= 6) {

              let tester = true

              // Check if blocking is necessary
              testList.forEach((item, index) => {

                let medium

                // check if all items are free but item 0, item 2 and item 4
                // should be taken by the opponent and item 1 and item 3 
                // should be taken by the computer
                if (index === 0 || index === 2 || index === 4) {

                  medium = op.includes(item)

                } else if (index === 1 || index === 3) {

                  medium = mp.includes(item)

                } else {

                  medium = fp.includes(item)

                }

                tester = tester && medium

              })

              if (tester) {

                returnNumb = testList[5]

                break

              } else {

                for (let i = 0; i < xcon.length; i++) {
                  const item = xcon[i].toString();

                  if (item == testList.toString()) { xcon.splice(i, 1) }
                }

              }

            } else {

              for (let i = 0; i < xcon.length; i++) {
                const item = xcon[i].toString();

                if (item == testList.toString()) { xcon.splice(i, 1) }
              }

            }

          }

        }

        // Second play in block
        if (returnNumb === undefined) {

          // works to play second part to block 

          let xcon = twStop.slice(); let a = 0

          while (xcon.length >= 1) {

            let testList = chooseFrom(xcon); a++

            if (testList.length >= 4) {

              let tester = true


              // Check if blocking is necessary
              testList.forEach((item, index) => {

                let medium

                // check if all items are free but item 0 and item 2 should 
                // be taken by the opponent and item 1 should be taken by
                // the computer
                if (index === 0 && index === 2) {

                  medium = op.includes(item)

                } else if (index === 1) {

                  medium = mp.includes(item)

                } else {

                  medium = fp.includes(item)

                }

                tester = tester && medium

              })

              if (tester) {

                returnNumb = testList[3]

                break

              } else {

                for (let i = 0; i < xcon.length; i++) {
                  const item = xcon[i].toString();

                  if (item == testList.toString()) { xcon.splice(i, 1) }
                }

              }

            } else {

              for (let i = 0; i < xcon.length; i++) {
                const item = xcon[i].toString();

                if (item == testList.toString()) { xcon.splice(i, 1) }
              }

            }

          }

        }

        // Initialize block
        if (returnNumb === undefined) {

          // works to block

          let xcon = twStop.slice();

          while (xcon.length > 1) {

            let testList = chooseFrom(xcon);

            let tester = true

            // Check if blocking is neccessary
            testList.forEach((item, index) => {

              // check if all items are free but item 0 should be taken
              // by the opponent
              if (index === 0) {

                medium = op.includes(item)

              } else {

                medium = fp.includes(item)

              }

              tester = tester && medium

            })

            if (tester) {

              returnNumb = testList[1]

              break

            } else {

              for (let i = 0; i < xcon.length; i++) {
                const item = xcon[i].toString();

                if (item == testList.toString()) { xcon.splice(i, 1) }
              }

            }

          }

        }

      }

    }

    // Work Two Ways
    if (returnNumb === undefined) {

      if (fp.length <= 9) {

        // Third play in two ways
        if (returnNumb === undefined) {

          // works to play third part in 2 way pattern 

          let xcon = twWork.slice();

          while (xcon.length > 1) {

            let testList = chooseFrom(xcon);

            if (testList.length >= 5) {

              let tester = true

              // Check for conditions to use two ways
              testList.forEach((item, index) => {

                let medium

                // check if all items are free but item 0 and item 2 
                // should be taken by the computer and 
                // item 1 and item 3 should be taken by the opponent
                if (index === 0 || index === 2) {

                  medium = mp.includes(item)

                } else if (index === 1 || index === 3) {

                  medium = op.includes(item)

                } else {

                  medium = fp.includes(item)

                }

                tester = tester && medium

              })

              if (tester) {

                returnNumb = testList[4]

                break

              } else {

                for (let i = 0; i < xcon.length; i++) {
                  const item = xcon[i].toString();

                  if (item == testList.toString()) { xcon.splice(i, 1) }
                }

              }

            } else {

              for (let i = 0; i < xcon.length; i++) {
                const item = xcon[i].toString();

                if (item == testList.toString()) { xcon.splice(i, 1) }
              }

            }

          }

        }

        // Second play in two ways
        if (returnNumb === undefined) {

          // works to play second part in 2 way pattern 

          let xcon = twWork.slice()

          while (xcon.length >= 1) {

            let testList = chooseFrom(xcon);

            if (testList.length >= 3) {

              let tester = true

              // Check for conditions to use two ways
              testList.forEach((item, index) => {

                let medium

                // check if all items are free but item 0 should be taken
                // by the computer and item 1 should be taken by the opponent
                if (index === 0) {

                  medium = mp.includes(item)

                } else if (index === 1) {

                  medium = op.includes(item)

                } else {

                  medium = fp.includes(item)

                }

                tester = tester && medium

              })

              if (tester) {

                returnNumb = testList[2]

                break

              } else {

                for (let i = 0; i < xcon.length; i++) {
                  const item = xcon[i].toString();

                  if (item == testList.toString()) { xcon.splice(i, 1) }
                }

              }

            } else {

              for (let i = 0; i < xcon.length; i++) {
                const item = xcon[i].toString();

                if (item == testList.toString()) { xcon.splice(i, 1) }
              }

            }

          }

        }

        // Initialize Two ways
        if (returnNumb === undefined) {

          // works to start 2 way pattern to win

          let xcon = twWork.slice();

          while (xcon.length > 1) {

            let testList = chooseFrom(xcon);

            let tester = true

            // Check for conditions to use two ways
            testList.forEach(item => {

              // chek if all items are free
              let medium = fp.includes(item)

              tester = tester && medium

            })

            if (tester) {

              returnNumb = testList[0]

              break

            } else {

              for (let i = 0; i < xcon.length; i++) {
                const item = xcon[i].toString();

                if (item == testList.toString()) { xcon.splice(i, 1) }
              }

            }

          }

        }

      }

    }

    // Work basic pattern to follow
    if (returnNumb === undefined) {

      // works to continue pattern to follow

      let xcon = almostConditions.slice()

      while (xcon.length > 1) {

        let testList = chooseFrom(xcon);

        let tester = mp.indexOf(testList[0]) !== -1 &&
          fp.indexOf(testList[1]) !== -1 &&
          fp.indexOf(testList[2]) !== -1

        if (tester) {

          returnNumb = chooseFrom([testList[1], testList[2]])

          break

        } else {

          for (let i = 0; i < xcon.length; i++) {
            const item = xcon[i].toString();

            if (item == testList.toString()) { xcon.splice(i, 1) }
          }

        }

      }

    }

    // Start basic pattern to follow
    if (returnNumb === undefined) {

      // works to start pattern to follow

      let xcon = almostConditions.slice()

      while (xcon.length > 1) {

        let testList = chooseFrom(xcon);

        let tester = fp.indexOf(testList[0]) !== -1 &&
          fp.indexOf(testList[1]) !== -1 &&
          fp.indexOf(testList[2]) !== -1

        if (tester) {

          returnNumb = chooseFrom(testList)

          break

        } else {


          for (let i = 0; i < xcon.length; i++) {
            const item = xcon[i].toString();

            if (item == testList.toString()) { xcon.splice(i, 1) }
          }

        }

      }

    }

    // Ultimate Fall back chooses at random
    if (returnNumb === undefined) {

      returnNumb = chooseFrom(fp)

    }

    return returnNumb

  }

  // Send out Function
  const startBoard = function () {

    let board = UserCtrl.getData('board')

    board = verifyBoard(board)

    UserCtrl.setData('board', board)

    fillBoard()

    boardEventListeners()

    checkForWin()

    checkForFullBoard()

    checkComputerTurn()

  }

  const boardVars = {

    emptySocket: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path></path></svg>`,

    xSocket: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512">
      <path
        d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
    </svg>

    `,

    oSocket: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path
        d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z" />
    </svg>
    `,

  }

  return {

    startBoard: () => startBoard(),

    fillBoard: () => fillBoard()

  };
})();


// App Controller
const App = (function (UICtrl, BoardCtrl,
  StorageCtrl, UserCtrl) {

  const loadEventListeners = function () {

    UICtrl.UIVars.navOpener.addEventListener('click', openSettings)

    UICtrl.UIVars.navCloser.addEventListener('click', closeSettings)

    UICtrl.UIVars.navBlur.addEventListener('click', (e) => {

      if (e.target.classList.contains('site-settings-holder')) {

        closeSettings()

      }

    })

    document.addEventListener('keydown', (e) => {

      if (e.key === 'Escape' && settingsOpen()) {

        closeSettings()

      }

      // Keep Tab inside the settings drawer while it is open
      if (e.key === 'Tab' && settingsOpen()) {

        const focusable = Array.from(UICtrl.UIVars.navBlur.querySelectorAll('button, input'))

        const first = focusable[0]

        const last = focusable[focusable.length - 1]

        if (!UICtrl.UIVars.navBlur.contains(document.activeElement)) {

          e.preventDefault()

          first.focus()

        } else if (e.shiftKey && document.activeElement === first) {

          e.preventDefault()

          last.focus()

        } else if (!e.shiftKey && document.activeElement === last) {

          e.preventDefault()

          first.focus()

        }

      }

    })

    UICtrl.UIVars.msgBlur.addEventListener('click', () => {

      // UICtrl.removeMessage()

    })

    UICtrl.UIVars.smallMsgX.addEventListener('click', () => {

      UICtrl.removeSmallMessage()

    })

    UICtrl.UIVars.settSave.addEventListener('click', () => {

      const name = UICtrl.UIVars.settName.value

      const xname = UICtrl.UIVars.settXname.value

      let playerLetter = Array.from(UICtrl.UIVars.settLetter.children)

      let gameDiff = Array.from(UICtrl.UIVars.settDifficulty.children)

      let playersNumber = Array.from(UICtrl.UIVars.settNumbOPlay.children)

      let firstMove = Array.from(UICtrl.UIVars.settFirstMove.children)


      playerLetter = playerLetter.map(item => item.lastElementChild)

      gameDiff = gameDiff.map(item => item.lastElementChild)

      playersNumber = playersNumber.map(item => item.lastElementChild)

      firstMove = firstMove.map(item => item.lastElementChild)

      if (name.trim() === '' || xname.trim() === '') {

        UICtrl.sendSmallMessage(`Name fields can't be empty`, 2000)

      } else if (name.trim().toLowerCase() === xname.trim().toLowerCase()) {

        UICtrl.sendSmallMessage(`Player and opponent names must be different`, 2500)

      } else {

        UserCtrl.setData('name', name.trim())

        UserCtrl.setData('xname', xname.trim())

        playerLetter.forEach(item => {

          if (item.checked === true) {

            UserCtrl.setData('letter', item.id.split('-')[1])

          }

        })

        gameDiff.forEach(item => {

          if (item.checked === true) {

            UserCtrl.setData('difficulty', item.id.split('-')[1])

          }

        })

        playersNumber.forEach(item => {

          if (item.checked === true) {

            UserCtrl.setData('numb players', item.id.split('-')[1])

          }

        })

        firstMove.forEach(item => {

          if (item.checked === true) {

            UserCtrl.setData('first move', item.id.split('-')[1])

          }

        })


        UICtrl.sendSmallMessage(`Settings are saved but won't take effect until next match`, 2000)

        fillAllSettings()
      }

    })

    UICtrl.UIVars.statsReset.addEventListener('click', () => {

      UserCtrl.setData('stat easy', [0, 0, 0])

      UserCtrl.setData('stat medium', [0, 0, 0])

      UserCtrl.setData('stat hard', [0, 0, 0])

      UserCtrl.setData('stat friend', [0, 0, 0])

      fillAllStats()

      BoardCtrl.fillBoard()

      UICtrl.sendSmallMessage('Statistics have been reset', 1500)
    })

  }

  const SETTINGS_ANIMATION = 250

  const settingsOpen = function () {

    return UICtrl.UIVars.nav.classList.contains('show-sett') &&
      !UICtrl.UIVars.nav.classList.contains('hide-sett')

  }

  const openSettings = function () {

    fillAllSettings()

    fillAllStats()

    UICtrl.addClass(UICtrl.UIVars.nav, 'show-sett')

    UICtrl.UIVars.navOpener.setAttribute('aria-expanded', 'true')

    UICtrl.UIVars.navCloser.focus()

  }

  const closeSettings = function () {

    if (!settingsOpen()) { return }

    UICtrl.addClass(UICtrl.UIVars.nav, 'hide-sett')

    UICtrl.UIVars.navOpener.setAttribute('aria-expanded', 'false')

    setTimeout(() => {

      UICtrl.removeClass(UICtrl.UIVars.nav, 'hide-sett')

      UICtrl.removeClass(UICtrl.UIVars.nav, 'show-sett')

      UICtrl.UIVars.navOpener.focus()

    }, SETTINGS_ANIMATION);

  }

  const firstInit = function () {

    if (StorageCtrl.getUser() === '') {

      UICtrl.sendMessage(`
      <form class="begin-xtr-form">
        <h2>Welcome to Tic Tac Toe</h2>
        <p class="lead">Who is playing today?</p>
        <div class="field">
          <label for="begin-xtr-name">Your name</label>
          <input type="text" required id="begin-xtr-name" placeholder="Your Name" maxlength="16" autocomplete="off">
        </div>
        <div class="field">
          <label for="begin-xtr-xame">Opponent name</label>
          <input type="text" required id="begin-xtr-xame" placeholder="Opponent Name" maxlength="16" autocomplete="off">
        </div>
        <button type="submit" class="btn btn-primary">Start playing</button>
        <small>We use your browser's local storage to save your settings and stats. Starting the game grants that permission.</small>
      </form>
      `)

      UICtrl.findElement('.begin-xtr-form')
        .addEventListener('submit', (e) => {

          e.preventDefault()

          const name = UICtrl.findElement('#begin-xtr-name').value.trim()

          const xname = UICtrl.findElement('#begin-xtr-xame').value.trim()

          if (name.toLowerCase() === xname.toLowerCase() && name !== '') {

            UICtrl.sendSmallMessage(`Player and opponent names must be different`, 2500)

          } else if (name !== '' && xname !== '') {

            const data = {
              name: name,
              xname: xname,
              letter: 'X',
              difficulty: 'easy',
              numbPlay: 'one',
              firstMove: 'XO',
              statEasy: [0, 0, 0],
              statMedium: [0, 0, 0],
              statHard: [0, 0, 0],
              statFriend: [0, 0, 0],
              statTotal: [0, 0, 0],
              extBoard: true,
              calculateStats: function () {
                this.statTotal.forEach((item, index) => {

                  this.statTotal[index] = this.statEasy[index] +
                    this.statMedium[index] + this.statHard[index] +
                    this.statFriend[index]

                })
              },
              board: {}
            }

            data.calculateStats()

            StorageCtrl.setUser(data)

            UICtrl.removeMessage()

            loadInit()

          } else {

            UICtrl.sendSmallMessage(`Name fields can't be empty`, 2000)

          }

        })
    }

  }

  const loadInit = function () {

    if (StorageCtrl.getUser() !== '') {

      fillAllSettings()

      fillAllStats()

      BoardCtrl.startBoard()
    }

  }


  // Other Functions
  const fillAllSettings = function () {

    const name = UICtrl.UIVars.settName

    const xname = UICtrl.UIVars.settXname

    let playerLetter = Array.from(UICtrl.UIVars.settLetter.children)

    let gameDiff = Array.from(UICtrl.UIVars.settDifficulty.children)

    let playersNumber = Array.from(UICtrl.UIVars.settNumbOPlay.children)

    let firstMove = Array.from(UICtrl.UIVars.settFirstMove.children)


    name.value = UserCtrl.getData('name')

    xname.value = UserCtrl.getData('xname')

    playerLetter = playerLetter.map(item => item.lastElementChild)

    gameDiff = gameDiff.map(item => item.lastElementChild)

    playersNumber = playersNumber.map(item => item.lastElementChild)

    firstMove = firstMove.map(item => item.lastElementChild)


    playerLetter.forEach(item => {

      if (item.id.split('-')[1] === UserCtrl.getData('letter')) {

        item.checked = true

      }

    })

    gameDiff.forEach(item => {

      if (item.id.split('-')[1] === UserCtrl.getData('difficulty')) {

        item.checked = true

      }

    })

    playersNumber.forEach(item => {

      if (item.id.split('-')[1] === UserCtrl.getData('numb players')) {

        item.checked = true

      }

    })

    firstMove.forEach(item => {

      if (item.id.split('-')[1] === UserCtrl.getData('first move')) {

        item.checked = true

      }

    })

  }

  const fillAllStats = function () {

    const statsTable = Array.from(UICtrl.UIVars.statsTable.children)

    statsTable[0].children[1].innerText = UserCtrl.getData('name')

    statsTable[0].children[2].innerText = UserCtrl.getData('xname')

    statsTable[0].children[3].innerText = 'Draw'

    Array.from(statsTable[1].children).forEach((item, index) => {

      if (index === 0) {

        item.innerHTML = 'Easy'

      } else {

        item.innerHTML = UserCtrl.getData('stat easy')[index - 1]

      }

    })

    Array.from(statsTable[2].children).forEach((item, index) => {

      if (index === 0) {

        item.innerHTML = 'Medium'

      } else {

        item.innerHTML = UserCtrl.getData('stat medium')[index - 1]

      }

    })

    Array.from(statsTable[3].children).forEach((item, index) => {

      if (index === 0) {

        item.innerHTML = 'Hard'

      } else {

        item.innerHTML = UserCtrl.getData('stat hard')[index - 1]

      }

    })

    Array.from(statsTable[4].children).forEach((item, index) => {

      if (index === 0) {

        item.innerHTML = 'Friend'

      } else {

        item.innerHTML = UserCtrl.getData('stat friend')[index - 1]

      }

    })

    Array.from(statsTable[5].children).forEach((item, index) => {

      if (index === 0) {

        item.innerHTML = 'Total'

      } else {

        item.innerHTML = UserCtrl.getData('stat total')[index - 1]

      }

    })

  }


  return {
    init: () => {

      loadEventListeners()

      firstInit()

      loadInit()

      console.log('Application is successfully running...')

    }
  }
})
  (UICtrl, BoardCtrl, StorageCtrl, UserCtrl)


// Initialize Application
document.addEventListener('DOMContentLoaded', App.init)