/* Tic Tac Toe by Elpis: the game.

   StorageCtrl  reads and writes the browser's storage
   UserCtrl     the saved profile: names, settings, statistics, the board
   UICtrl       page elements and the toast
   DrawCtrl     puts the board, marks and tally marks on the canvases
   BoardCtrl    the rules and the flow of a game
   App          settings, toggles and start-up

   draw.js supplies Sketch and Sound, ai.js supplies ComputerCtrl. */

// index.html?test plays on a separate save and shows the move order
const TEST_MODE = /[?&]test\b/.test(window.location.search)


// Storage Controller
const StorageCtrl = (function () {

  const KEY = TEST_MODE ? 'user-test' : 'user'

  const VISIT_KEY = `${KEY}-visit`

  // Everything saved is kept here too. Once a value has been read or
  // written this copy is the one used, so the game carries on for the
  // rest of the visit when storage is blocked or full.
  const memory = {}

  const load = function (store, key) {

    if (memory[key] === undefined) {

      try {

        memory[key] = window[store].getItem(key) || 'null'

      } catch (e) {

        memory[key] = 'null'

      }

    }

    try {

      return JSON.parse(memory[key])

    } catch (e) {

      return null

    }

  }

  const save = function (store, key, data) {

    const text = JSON.stringify(data)

    memory[key] = text

    try {

      window[store].setItem(key, text)

    } catch (e) {

      // Storage is full or blocked. The copy in memory lasts the visit.
    }

  }

  const setUser = function (data) {

    if (typeof data === 'object') {

      save('localStorage', KEY, data)

    }

  }

  const getUser = function () {

    const dataX = load('localStorage', KEY)

    if (typeof dataX === 'object' && dataX !== null) {

      ;['statEasy', 'statMedium', 'statHard', 'statFriend', 'statTotal'].forEach((stat) => {

        if (!Array.isArray(dataX[stat]) || dataX[stat].length !== 3) { dataX[stat] = [0, 0, 0] }

      })

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

  // The score of this visit. It lasts until the tab is closed.
  const getVisit = function () {

    const data = load('sessionStorage', VISIT_KEY)

    return (typeof data === 'object' && data !== null) ? data : {}

  }

  const setVisit = function (data) {

    save('sessionStorage', VISIT_KEY, data)

  }

  return {

    setUser: (data) => setUser(data),

    getUser: () => getUser(),

    getVisit: () => getVisit(),

    setVisit: (data) => setVisit(data),

  }
})();


// User Controller
const UserCtrl = (function () {

  // What the rest of the game calls a value, where it is kept in the
  // profile, and what to answer when it has never been set.
  const FIELDS = {
    'name': ['name', ''],
    'xname': ['xname', ''],
    'letter': ['letter', ''],
    'difficulty': ['difficulty', ''],
    'numb players': ['numbPlay', ''],
    'first move': ['firstMove', ''],
    'stat easy': ['statEasy', [0, 0, 0]],
    'stat medium': ['statMedium', [0, 0, 0]],
    'stat hard': ['statHard', [0, 0, 0]],
    'stat friend': ['statFriend', [0, 0, 0]],
    'stat total': ['statTotal', [0, 0, 0]],
    'board': ['board', {}],
    'theme': ['theme', ''],
    'sound': ['sound', true],
  }

  const getData = function (dataName) {

    const profile = StorageCtrl.getUser()

    const field = FIELDS[dataName]

    if (profile === '' || !field) { return '' }

    if (dataName.startsWith('stat ')) { profile.calculateStats() }

    const result = profile[field[0]]

    return result === undefined ? field[1] : result

  }

  const setData = function (dataName, data) {

    const profile = StorageCtrl.getUser()

    const field = FIELDS[dataName]

    if (profile === '' || !field) { return }

    profile[field[0]] = data

    profile.calculateStats()

    StorageCtrl.setUser(profile)

  }

  // A first visit starts playing straight away, with nothing to fill in
  const ensureProfile = function () {

    if (StorageCtrl.getUser() !== '') { return }

    StorageCtrl.setUser({
      name: 'You',
      xname: 'Computer',
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
      theme: '',
      sound: true,
      board: {}
    })

  }

  return {

    getData: (dataName) => getData(dataName),

    setData: (dataName, data) => setData(dataName, data),

    ensureProfile: () => ensureProfile(),

  }
})();


// UI Controller
const UICtrl = (function () {

  const findElement = function (tag) {
    return document.querySelector(tag)
  }

  const findElements = function (tag) {
    return Array.from(document.querySelectorAll(tag))
  }

  const UIVars = {

    html: document.documentElement,
    themeColor: findElement('meta[name="theme-color"]'),

    // Header
    soundToggle: findElement('#sound-toggle'),
    themeToggle: findElement('#theme-toggle'),
    settingsOpen: findElement('#settings-open'),

    // Game
    game: findElement('.game'),
    sides: findElements('.scoreboard .side'),
    status: findElement('#game-status'),
    statusText: findElement('#game-status > span'),
    board: findElement('.board'),
    gridCanvas: findElement('.board-grid'),
    marksCanvas: findElement('.board-marks'),
    cells: findElements('#cells .cell'),
    cellsHolder: findElement('#cells'),
    controls: findElement('.controls'),
    undo: findElement('#undo'),
    redo: findElement('#redo'),
    newGame: findElement('#new-game'),
    newGameLabel: findElement('#new-game .ctrl-label'),
    opponent: findElement('#opponent'),

    // Settings
    settings: findElement('#settings'),
    settingsClose: findElement('#settings-close'),
    settName: findElement('#sett-name'),
    settXname: findElement('#sett-xname'),
    settLetter: findElement('#sett-letter'),
    settFirst: findElement('#sett-first'),
    statsTable: findElement('#stats-table'),
    statsReset: findElement('#stats-reset'),

    // Toast
    toast: findElement('#toast'),
    toastText: findElement('.toast-text'),
    toastAction: findElement('.toast-action'),
    toastClose: findElement('.toast-close'),

    // Canvases that sit behind and above the page
    backdrop: findElement('.backdrop'),
    dust: findElement('.dust'),
  }

  let toastTimer = null

  let toastRun = null

  const hideToast = function () {

    clearTimeout(toastTimer)

    UIVars.toast.classList.remove('show')

  }

  /* A short note at the bottom of the page.
     action: { label, run } adds one button that does something about it. */
  const showToast = function (message, time, action) {

    // The open settings drawer is modal: nothing outside it can be seen
    // clearly or pressed, so the note goes inside it.
    const home = UIVars.settings.open ? UIVars.settings : document.body

    if (UIVars.toast.parentElement !== home) { home.appendChild(UIVars.toast) }

    UIVars.toastText.textContent = message

    toastRun = action ? action.run : null

    UIVars.toastAction.hidden = !action

    UIVars.toastAction.textContent = action ? action.label : ''

    UIVars.toast.classList.add('show')

    // A newer note must not be closed by an older note's timer
    clearTimeout(toastTimer)

    toastTimer = setTimeout(hideToast, time || 3000)

  }

  UIVars.toastClose.addEventListener('click', hideToast)

  UIVars.toastAction.addEventListener('click', () => {

    const run = toastRun

    hideToast()

    if (run) { run() }

  })

  // Ticks the radio button in a group that carries a value
  const setChoice = function (group, value) {

    Array.from(group.querySelectorAll('input')).forEach((input) => {

      input.checked = input.value === value

    })

  }

  return {

    UIVars: UIVars,

    findElement: (tag) => findElement(tag),

    findElements: (tag) => findElements(tag),

    showToast: (message, time, action) => showToast(message, time, action),

    hideToast: () => hideToast(),

    setChoice: (group, value) => setChoice(group, value),

  }
})();


// Drawing Controller
const DrawCtrl = (function () {

  const UIVars = UICtrl.UIVars

  // The board is 300 units across: three squares of 100
  const UNITS = 300

  const THEMES = {
    board: { material: 'chalk', grain: 0.62, softGrain: 0.36, themeColor: '#24302d' },
    paper: { material: 'pencil', grain: 0.42, softGrain: 0.2, themeColor: '#f7f8fa' }
  }

  // A new set of wobbles for the grid and the surface on every visit
  const pageSeed = Math.floor(Math.random() * 1e9)

  let grid = null

  let marks = null

  let backdrop = null

  let tallies = []

  let colors = { ink: '#f2efe4', x: '#8fd3f7', o: '#f8c66a' }

  const grains = {}

  // What is on the marks canvas right now
  const shown = { seed: null, cells: ['', '', '', '', '', '', '', '', ''], strike: '' }

  let lastBoard = null

  let lastScores = null

  const themeName = () => UIVars.html.dataset.theme === 'paper' ? 'paper' : 'board'

  const centre = (index) => [(index % 3) * 100 + 50, Math.floor(index / 3) * 100 + 50]

  const letterColor = (letter) => letter === 'X' ? colors.x : (letter === 'O' ? colors.o : colors.ink)

  // Where the board is on screen. Measuring forces the browser to lay
  // the page out, so it is only done again after a resize or a scroll.
  let boardBox = null

  const forgetBoardBox = function () { boardBox = null }

  // Lets dust fall from where the chalk is, given a point on the board
  const dustFrom = function (color, amount) {

    if (!boardBox) { boardBox = UIVars.marksCanvas.getBoundingClientRect() }

    const box = boardBox

    return (x, y) => Sketch.dust.puff(box.left + x / UNITS * box.width, box.top + y / UNITS * box.height, color, amount)

  }

  // ---- The grid

  const drawGrid = function (animated) {

    grid.clear()

    const rand = Sketch.random(pageSeed)

    const lean = () => (rand() - 0.5) * 5

    const lines = [
      [100 + lean(), 7, 100 + lean(), 293],
      [200 + lean(), 6, 200 + lean(), 294],
      [7, 100 + lean(), 293, 100 + lean()],
      [6, 200 + lean(), 294, 200 + lean()]
    ]

    lines.forEach((l, i) => {

      grid.stroke(Sketch.line(rand, l[0], l[1], l[2], l[3]), {
        color: colors.ink,
        width: Sketch.material().width * 0.8,
        strength: 0.9,
        seed: Sketch.hash(pageSeed, i),
        instant: !animated,
        duration: 420,
        delay: 150 + i * 170,
        onMove: animated ? dustFrom(colors.ink, 1) : null
      })

    })

  }

  // ---- Marks

  const drawMark = function (index, letter, seed, animated, delay) {

    const rand = Sketch.random(Sketch.hash(seed, index, letter === 'X' ? 1 : 2))

    const [cx, cy] = centre(index).map(v => v + (rand() - 0.5) * 6)

    const color = letterColor(letter)

    const base = { color: color, instant: !animated, onMove: animated ? dustFrom(color, 1) : null }

    if (letter === 'X') {

      const reach = 28

      const j = () => (rand() - 0.5) * 9

      const first = Sketch.line(rand, cx - reach + j(), cy - reach + j(), cx + reach + j(), cy + reach + j())

      const second = Sketch.line(rand, cx + reach + j(), cy - reach + j(), cx - reach + j(), cy + reach + j())

      marks.stroke(first, Object.assign({}, base, {
        seed: Sketch.hash(seed, index, 11), duration: 150, delay: delay,
        onStart: () => Sound.scratch(0.15)
      }))

      marks.stroke(second, Object.assign({}, base, {
        seed: Sketch.hash(seed, index, 12), duration: 150, delay: delay + 210,
        onStart: () => Sound.scratch(0.15)
      }))

    } else {

      marks.stroke(Sketch.ring(rand, cx, cy, 29, 29), Object.assign({}, base, {
        seed: Sketch.hash(seed, index, 13), duration: 380, delay: delay,
        onStart: () => Sound.scratch(0.38)
      }))

    }

  }

  // The line through three in a row
  const drawStrike = function (line, letter, seed, animated, delay) {

    const rand = Sketch.random(Sketch.hash(seed, line[0], line[2], 5))

    const [x1, y1] = centre(line[0])

    const [x2, y2] = centre(line[2])

    const dx = (x2 - x1) * 0.2

    const dy = (y2 - y1) * 0.2

    const j = () => (rand() - 0.5) * 7

    const color = letterColor(letter)

    marks.stroke(Sketch.line(rand, x1 - dx + j(), y1 - dy + j(), x2 + dx + j(), y2 + dy + j(), 0.7), {
      color: color,
      width: Sketch.material().width * 1.2,
      seed: Sketch.hash(seed, line[0], line[2], 6),
      instant: !animated,
      duration: 430,
      delay: delay,
      onStart: () => Sound.scratch(0.43, 1.3),
      onMove: animated ? dustFrom(color, 4) : null
    })

  }

  const eraseCell = function (index, animated) {

    const rand = Sketch.random(Sketch.hash(shown.seed || 1, index, 21))

    const x = (index % 3) * 100

    const y = Math.floor(index / 3) * 100

    marks.rub(Sketch.scrub(rand, x + 20, y + 22, 60, 56, 3), {
      width: 50, color: colors.ink, instant: !animated, duration: 260,
      onStart: () => Sound.wipe(0.26)
    })

  }

  const wipeBoard = function (animated) {

    const rand = Sketch.random(Sketch.hash(shown.seed || 1, 31))

    marks.rub(Sketch.scrub(rand, 14, 18, 272, 264, 6), {
      width: 104, color: colors.ink, instant: !animated, duration: WIPE_TIME,
      onStart: () => Sound.wipe(WIPE_TIME / 1000)
    })

  }

  const WIPE_TIME = 460

  /* Makes the marks canvas match a board, drawing what is new and
     rubbing out what is gone. A board with a new seed is a new game,
     so the old one is wiped first. */
  const sync = function (board, instant) {

    const animated = !instant && !Sketch.still()

    let delay = 0

    lastBoard = board

    if (shown.seed !== null && shown.seed !== board.seed) {

      Sketch.flush(marks)

      if (shown.cells.some(cell => cell !== '')) {

        wipeBoard(animated)

        delay = animated ? WIPE_TIME : 0

      }

      shown.cells.fill('')

      shown.strike = ''

    }

    shown.seed = board.seed

    // Finish whatever is still being drawn or rubbed out before changing
    // the board again, so a late stroke cannot land on a square that has
    // since been emptied, and an eraser cannot pass over a new mark.
    if (!delay && board.boardPoints.some((letter, index) => shown.cells[index] !== letter)) {

      Sketch.flush(marks)

    }

    let rubbed = false

    board.boardPoints.forEach((letter, index) => {

      if (shown.cells[index] === letter) { return }

      if (shown.cells[index] !== '') {

        // One eraser sound is enough when two marks go at once
        eraseCell(index, animated && !rubbed)

        rubbed = true

      }

      if (letter !== '') { drawMark(index, letter, board.seed, animated, delay) }

      shown.cells[index] = letter

    })

    const lines = board.result ? board.result.lines : []

    const key = lines.map(line => line.join('')).join('|')

    if (key !== shown.strike) {

      lines.forEach((line, n) => {

        drawStrike(line, board.result.winner, board.seed, animated, delay + STRIKE_DELAY + n * 260)

      })

      shown.strike = key

    }

  }

  // The strike waits for the winning mark to be finished
  const STRIKE_DELAY = 430

  // ---- Tally marks: four uprights and a slash for every five

  const TALLY = { gap: 8, bundle: 34, stride: 44 }

  const tallyStrokes = function (surface, count, align) {

    const h = surface.height

    const full = Math.floor(count / 5)

    const rest = count % 5

    const bundles = full + (rest ? 1 : 0)

    const lastWidth = rest ? (rest - 1) * TALLY.gap + 10 : TALLY.bundle

    const total = Math.max(0, bundles - 1) * TALLY.stride + lastWidth

    const start = align === 'left' ? 1 : (align === 'right' ? surface.width - total - 1 : (surface.width - total) / 2)

    const strokes = []

    for (let k = 0; k < count; k++) {

      const rand = Sketch.random(Sketch.hash(77, k, align.length))

      const x0 = start + Math.floor(k / 5) * TALLY.stride + 5

      const j = () => (rand() - 0.5) * 2

      if (k % 5 < 4) {

        const x = x0 + (k % 5) * TALLY.gap

        strokes.push(Sketch.line(rand, x + 1 + j(), 3 + j(), x - 1 + j(), h - 3 + j(), 0.6))

      } else {

        strokes.push(Sketch.line(rand, x0 - 5 + j(), h * 0.74 + j(), x0 + 3 * TALLY.gap + 5 + j(), h * 0.24 + j(), 0.6))

      }

    }

    return strokes

  }

  const ALIGN = ['left', 'centre', 'right']

  // What each tally canvas shows now, so a move that changes no score
  // does not redraw them
  const tallyShown = ['', '', '']

  const drawTally = function (i, animateNew) {

    const surface = tallies[i]

    const side = UIVars.sides[i]

    const count = lastScores.counts[i]

    const letter = lastScores.letters[i]

    const key = `${count}|${letter}|${Sketch.material().name}`

    if (key === tallyShown[i]) { return }

    tallyShown[i] = key

    side.querySelector('.count').textContent = count

    surface.clear()

    // More marks than there is room for are shown as a number instead
    const capacity = Math.floor((surface.width + 8) / TALLY.stride) * 5

    side.classList.toggle('as-number', count > capacity)

    if (count > capacity) { return }

    const strokes = tallyStrokes(surface, count, ALIGN[i])

    strokes.forEach((points, k) => {

      const fresh = animateNew && k === count - 1 && !Sketch.still()

      surface.stroke(points, {
        color: letterColor(letter),
        width: Math.max(3.2, Sketch.material().width * 0.42),
        strength: letter ? 1 : 0.75,
        seed: Sketch.hash(78, k, i),
        instant: !fresh,
        duration: 200,
        delay: TALLY_DELAY,
        onStart: () => Sound.scratch(0.2, 0.7)
      })

    })

  }

  // A new tally mark is drawn after the strike has landed
  const TALLY_DELAY = 950

  /* counts: [yours, draws, theirs]. letters: whose colour each is drawn
     in ('' for draws). animate: the index that just went up, if any. */
  const setScores = function (counts, letters, animate) {

    lastScores = { counts: counts, letters: letters }

    tallies.forEach((surface, i) => drawTally(i, animate === i))

  }

  // Measures the tally canvases again and redraws them, after anything
  // that changes their size or colour
  const refitTallies = function () {

    tallies.forEach((surface, i) => {

      // A canvas hidden behind a number has no size to measure
      UIVars.sides[i].classList.remove('as-number')

      surface.fit()

      tallyShown[i] = ''

    })

    if (lastScores) { tallies.forEach((surface, i) => drawTally(i, false)) }

  }

  // ---- The surface behind everything: wipe marks and old games

  const miniGame = function (rand, ox, oy, size, angle) {

    const turn = (x, y) => {

      const px = (x - 0.5) * size

      const py = (y - 0.5) * size

      return [ox + px * Math.cos(angle) - py * Math.sin(angle), oy + px * Math.sin(angle) + py * Math.cos(angle)]

    }

    const seg = (x1, y1, x2, y2) => {

      const a = turn(x1, y1)

      const b = turn(x2, y2)

      return Sketch.line(rand, a[0], a[1], b[0], b[1])

    }

    const width = Math.max(2.2, size * 0.028)

    const pen = (points) => backdrop.stroke(points, {
      color: colors.ink, width: width, strength: 0.5, seed: Math.floor(rand() * 1e9), instant: true
    })

    ;[1 / 3, 2 / 3].forEach((t) => {

      pen(seg(t, 0.02, t, 0.98))

      pen(seg(0.02, t, 0.98, t))

    })

    // Somebody's unfinished game
    const squares = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => rand() - 0.5).slice(0, 4 + Math.floor(rand() * 3))

    squares.forEach((square, n) => {

      const cx = (square % 3 + 0.5) / 3

      const cy = (Math.floor(square / 3) + 0.5) / 3

      if (n % 2 === 0) {

        pen(seg(cx - 0.09, cy - 0.09, cx + 0.09, cy + 0.09))

        pen(seg(cx + 0.09, cy - 0.09, cx - 0.09, cy + 0.09))

      } else {

        const c = turn(cx, cy)

        pen(Sketch.ring(rand, c[0], c[1], size * 0.095, size * 0.095))

      }

    })

    // Rubbed out, but not well
    const sweep = []

    for (let i = 0; i < 4; i++) {

      const t = i / 3

      const a = turn(-0.1, t)

      const b = turn(1.1, t + (rand() - 0.5) * 0.2)

      if (i % 2 === 0) { sweep.push(a, b) } else { sweep.push(b, a) }

    }

    // Chalk smears when it is rubbed. Pencil mostly just fades.
    backdrop.rub(sweep, {
      width: size * 0.5, color: themeName() === 'board' ? colors.ink : '', strength: 0.3, instant: true
    })

  }

  const drawBackdrop = function () {

    backdrop.fit()

    backdrop.clear()

    const rand = Sketch.random(pageSeed + 3)

    const w = backdrop.width

    const h = backdrop.height

    const chalk = themeName() === 'board'

    // Broad passes of an eraser across the whole board
    if (chalk) {

      const passes = Math.round(5 + (w * h) / 220000)

      for (let i = 0; i < passes; i++) {

        const x = rand() * w

        const y = rand() * h

        const length = 220 + rand() * Math.max(w, h) * 0.55

        const angle = (rand() - 0.5) * 1.1 + (rand() < 0.3 ? Math.PI / 2 : 0)

        const a = [x - Math.cos(angle) * length / 2, y - Math.sin(angle) * length / 2]

        const b = [x + Math.cos(angle) * length / 2, y + Math.sin(angle) * length / 2]

        backdrop.stroke(Sketch.line(rand, a[0], a[1], b[0], b[1], 14), {
          color: colors.ink, width: 90 + rand() * 170, strength: 0.006 + rand() * 0.008,
          soft: true, seed: Math.floor(rand() * 1e9), instant: true
        })

      }

    }

    // Old games in the margins, where there is room beside the game
    const gameBox = UIVars.game.getBoundingClientRect()

    const spots = [
      [0, gameBox.left, 0.3], [gameBox.right, w - gameBox.right, 0.24],
      [0, gameBox.left, 0.78], [gameBox.right, w - gameBox.right, 0.74]
    ]

    spots.forEach(([from, room, down]) => {

      // Always take the same number of random values, so the games that
      // are drawn do not change when others are left out
      const skip = rand() < 0.38

      const size = Math.min(room * 0.62, 105 + rand() * 95)

      const x = from + room * (0.42 + rand() * 0.16)

      const y = h * (down + (rand() - 0.5) * 0.1)

      const angle = (rand() - 0.5) * 0.5

      const seed = Math.floor(rand() * 1e9)

      if (skip || room < 190) { return }

      miniGame(Sketch.random(seed), x, y, size, angle)

    })

  }

  // ---- Themes and sizes

  // Redraws every canvas from what the game last asked for
  const redraw = function () {

    grid.fit()

    marks.fit()

    drawGrid(false)

    marks.clear()

    shown.seed = null

    shown.cells.fill('')

    shown.strike = ''

    if (lastBoard) { sync(lastBoard, true) }

    refitTallies()

  }

  const applyTheme = function () {

    const name = themeName()

    const theme = THEMES[name]

    Sketch.setMaterial(theme.material)

    Sound.setVoice(theme.material)

    if (!grains[name]) {

      grains[name] = [Sketch.grain(theme.grain, 11), Sketch.grain(theme.softGrain, 23)]

    }

    UIVars.html.style.setProperty('--grain', `url(${grains[name][0]})`)

    UIVars.html.style.setProperty('--grain-soft', `url(${grains[name][1]})`)

    if (UIVars.themeColor) { UIVars.themeColor.setAttribute('content', theme.themeColor) }

    const style = getComputedStyle(UIVars.html)

    colors = {
      ink: style.getPropertyValue('--ink').trim(),
      x: style.getPropertyValue('--x').trim(),
      o: style.getPropertyValue('--o').trim()
    }

  }

  const setTheme = function () {

    applyTheme()

    redraw()

    drawBackdrop()

  }

  const init = function (animateGrid) {

    grid = Sketch.createSurface(UIVars.gridCanvas, UNITS)

    marks = Sketch.createSurface(UIVars.marksCanvas, UNITS)

    backdrop = Sketch.createSurface(UIVars.backdrop, 0, 1.5)

    tallies = UIVars.sides.map(side => Sketch.createSurface(side.querySelector('canvas')))

    Sketch.dust.attach(UIVars.dust)

    applyTheme()

    grid.fit()

    marks.fit()

    refitTallies()

    drawGrid(animateGrid)

    drawBackdrop()

    // Canvases are bitmaps: when their size on screen changes, draw again
    let boardSize = UIVars.board.getBoundingClientRect().width

    let timer = null

    window.addEventListener('resize', () => {

      const size = UIVars.board.getBoundingClientRect().width

      forgetBoardBox()

      if (size !== boardSize) {

        boardSize = size

        redraw()

      } else {

        refitTallies()

      }

      clearTimeout(timer)

      timer = setTimeout(drawBackdrop, 180)

    })

    window.addEventListener('scroll', forgetBoardBox, { passive: true })

  }

  return {

    init: (animateGrid) => init(animateGrid),

    sync: (board, instant) => sync(board, instant),

    setScores: (counts, letters, animate) => setScores(counts, letters, animate),

    setTheme: () => setTheme(),

    WIPE_TIME: WIPE_TIME,

    STRIKE_DELAY: STRIKE_DELAY,

  }
})();


// Board Controller
const BoardCtrl = (function () {

  const UIVars = UICtrl.UIVars

  // Every row, column and diagonal, as board indexes (row-major)
  const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]

  const LEVELS = ['easy', 'medium', 'hard']

  const other = (letter) => letter === 'X' ? 'O' : 'X'

  const getBoard = () => UserCtrl.getData('board')

  const saveBoard = (board) => UserCtrl.setData('board', board)

  // ---- Boards

  // fresh: the settings just changed, so nobody is owed the first move
  const newBoard = function (fresh) {

    const previous = fresh ? null : getBoard()

    const letter = UserCtrl.getData('letter') === 'O' ? 'O' : 'X'

    // 'XO' means take turns: whoever did not start the last game starts
    let first = UserCtrl.getData('first move')

    if (first !== 'X' && first !== 'O') {

      const last = previous ? previous.firstMove : ''

      first = (last === 'X' || last === 'O') ? other(last) : letter

    }

    return {

      playerLetter: letter,

      difficulty: LEVELS.includes(UserCtrl.getData('difficulty')) ? UserCtrl.getData('difficulty') : 'easy',

      numbPlay: UserCtrl.getData('numb players') === 'two' ? 'two' : 'one',

      firstMove: first,

      // Each move is [who, letter, square, order]
      playingPoints: [],

      redoPoints: [],

      boardPoints: ['', '', '', '', '', '', '', '', ''],

      turn: first,

      // Set when the game ends: { winner: 'X' | 'O' | 'draw', lines: [] }
      result: null,

      won: false,

      // Decides how the marks of this game wobble
      seed: Math.floor(Math.random() * 1e9),

      legitBoard: true,

      version: 2

    }

  }

  // Returns the saved board if it can be played on, or a new one
  const verifyBoard = function (board) {

    try {

      const points = board.boardPoints

      const sound = board.legitBoard === true && Array.isArray(points) && points.length === 9 &&
        points.every(item => item === '' || item === 'X' || item === 'O') &&
        Array.isArray(board.playingPoints) && Array.isArray(board.redoPoints) &&
        (board.playerLetter === 'X' || board.playerLetter === 'O')

      if (!sound) { return newBoard() }

      if (board.version === 2) {

        return (board.turn === 'X' || board.turn === 'O') ? board : newBoard()

      }

      // A game saved by the earlier version of this page, which kept the
      // turn as a player's name. One that had ended was already counted,
      // so start afresh. One in progress is carried over.
      if (board.won || evaluate(board)) { return newBoard() }

      board.turn = board.turn === board.name ? board.playerLetter : other(board.playerLetter)

      board.result = null

      board.won = false

      board.seed = Math.floor(Math.random() * 1e9)

      board.version = 2

      return board

    } catch (e) {

      return newBoard()

    }

  }

  // ---- Who is who

  const nameOf = function (board, letter) {

    return UserCtrl.getData(letter === board.playerLetter ? 'name' : 'xname')

  }

  const isComputerTurn = function (board) {

    return !board.won && board.numbPlay === 'one' && board.turn !== board.playerLetter

  }

  const saysYou = (name) => name.trim().toLowerCase() === 'you'

  // Which statistics a game counts toward: a level, or 'friend'
  const tableOf = (board) => board.numbPlay === 'two' ? 'friend' : board.difficulty

  // ---- The score of this visit

  const visitScore = function (table) {

    const score = StorageCtrl.getVisit()[table]

    return Array.isArray(score) && score.length === 3 ? score : [0, 0, 0]

  }

  // column: 0 you won, 1 they won, 2 draw
  const count = function (board, column) {

    const table = tableOf(board)

    const stats = UserCtrl.getData(`stat ${table}`).slice()

    stats[column]++

    UserCtrl.setData(`stat ${table}`, stats)

    const visit = StorageCtrl.getVisit()

    visit[table] = visitScore(table)

    visit[table][column]++

    // Wins in a row against the computer, for the nudge to move up
    const streaks = visit.streaks || {}

    streaks[table] = column === 0 ? (streaks[table] || 0) + 1 : 0

    visit.streaks = streaks

    StorageCtrl.setVisit(visit)

    return streaks[table]

  }

  // ---- Rules

  const evaluate = function (board) {

    const p = board.boardPoints

    const lines = WIN_LINES.filter(line => p[line[0]] !== '' &&
      p[line[0]] === p[line[1]] && p[line[1]] === p[line[2]])

    // One move can complete two lines at once. Both are struck.
    if (lines.length) { return { winner: p[lines[0][0]], lines: lines } }

    if (!p.includes('')) { return { winner: 'draw', lines: [] } }

    return null

  }

  const place = function (board, index, letter) {

    board.boardPoints[index] = letter

    board.playingPoints.push([nameOf(board, letter), letter, index, board.playingPoints.length])

    board.turn = other(letter)

  }

  let thinking = null

  // What follows the end of a game a moment later: the chime, the nudge
  let endTimer = null

  let nudgeTimer = null

  // Taps on the board are ignored until this time (performance.now)
  let lockedUntil = 0

  let nudged = false

  /* Called after any change to the board. Ends the game if it is over,
     saves, draws, and lets the computer take its turn. */
  const afterMove = function (board) {

    const result = board.won ? null : evaluate(board)

    let scored

    if (result) {

      board.result = result

      board.won = true

      const column = result.winner === 'draw' ? 2 : (result.winner === board.playerLetter ? 0 : 1)

      const streak = count(board, column)

      // Scoreboard order is you, draws, them
      scored = [0, 2, 1][column]

      // Long enough to see how it ended before a tap starts the next game
      lockedUntil = performance.now() + 900

      endSounds(board, result)

      suggestHarder(board, column, streak)

    }

    saveBoard(board)

    render(board, { scored: scored })

    // The statistics may be on screen in the settings drawer
    if (result) { App.showStats() }

    if (isComputerTurn(board)) { computerTurn() }

  }

  const endSounds = function (board, result) {

    const lost = board.numbPlay === 'one' && result.winner === other(board.playerLetter)

    const kind = result.winner === 'draw' ? 'draw' : (lost ? 'lose' : 'win')

    clearTimeout(endTimer)

    endTimer = setTimeout(() => {

      Sound.chime(kind)

      if (Sound.isEnabled() && navigator.vibrate) {

        navigator.vibrate(kind === 'win' ? [12, 70, 24] : 18)

      }

    }, Sketch.still() ? 0 : DrawCtrl.STRIKE_DELAY + 200)

  }

  // After three wins in a row against the computer, offer the next level
  const suggestHarder = function (board, column, streak) {

    const level = LEVELS.indexOf(board.difficulty)

    if (nudged || board.numbPlay !== 'one' || column !== 0 || streak < 3 || level === LEVELS.length - 1) { return }

    const next = LEVELS[level + 1]

    const label = next[0].toUpperCase() + next.slice(1)

    clearTimeout(nudgeTimer)

    nudgeTimer = setTimeout(() => {

      // Once a visit is enough
      nudged = true

      UICtrl.showToast(`Three wins in a row. Ready for ${label}?`, 9000, {
        label: `Play ${label}`,
        run: () => App.chooseOpponent(next)
      })

    }, 1500)

  }

  const computerTurn = function () {

    clearTimeout(thinking)

    const asked = getBoard()

    const moves = asked.playingPoints.length

    thinking = setTimeout(() => {

      const board = getBoard()

      // The game moved on while it was thinking (undo, new game)
      if (board.seed !== asked.seed || board.playingPoints.length !== moves ||
        !isComputerTurn(board) || !board.boardPoints.includes('')) { return }

      const letter = board.turn

      place(board, ComputerCtrl.choose(board.difficulty, board.boardPoints, letter), letter)

      board.redoPoints = []

      afterMove(board)

    }, 620 + Math.random() * 380)

  }

  // ---- What the player can do

  const play = function (index) {

    if (performance.now() < lockedUntil) { return }

    const board = getBoard()

    if (board.won) {

      newGame()

      return

    }

    if (board.boardPoints[index] !== '' || isComputerTurn(board)) { return }

    place(board, index, board.turn)

    board.redoPoints = []

    if (Sound.isEnabled() && navigator.vibrate) { navigator.vibrate(8) }

    afterMove(board)

  }

  const canUndo = function (board) {

    if (board.won) { return false }

    // Against the computer there must be a move of your own to take back
    return board.numbPlay === 'two'
      ? board.playingPoints.length > 0
      : board.playingPoints.some(move => move[1] === board.playerLetter)

  }

  const canRedo = (board) => !board.won && board.redoPoints.length > 0

  const undo = function () {

    const board = getBoard()

    if (!canUndo(board)) { return }

    clearTimeout(thinking)

    const takeBack = () => {

      const move = board.playingPoints.pop()

      board.boardPoints[move[2]] = ''

      board.redoPoints.push(move)

      board.turn = move[1]

    }

    takeBack()

    // Against the computer, go back to your own last move
    if (board.numbPlay === 'one') {

      while (board.turn !== board.playerLetter && board.playingPoints.length) { takeBack() }

    }

    saveBoard(board)

    render(board)

  }

  const redo = function () {

    const board = getBoard()

    if (!canRedo(board)) { return }

    clearTimeout(thinking)

    const putBack = () => {

      const move = board.redoPoints.pop()

      board.boardPoints[move[2]] = move[1]

      move[3] = board.playingPoints.length

      board.playingPoints.push(move)

      board.turn = other(move[1])

    }

    putBack()

    // Against the computer, put its reply back as well
    if (board.numbPlay === 'one') {

      while (board.turn !== board.playerLetter && board.redoPoints.length) { putBack() }

    }

    afterMove(board)

  }

  const newGame = function (fresh) {

    clearTimeout(thinking)

    clearTimeout(endTimer)

    clearTimeout(nudgeTimer)

    const marked = getBoard().boardPoints.some(item => item !== '')

    const board = newBoard(fresh === true)

    saveBoard(board)

    // No taps while the old game is being wiped off
    lockedUntil = marked && !Sketch.still() ? performance.now() + DrawCtrl.WIPE_TIME : 0

    render(board)

    if (isComputerTurn(board)) { computerTurn() }

  }

  // ---- Showing the game

  const statusParts = function (board) {

    const result = board.result

    const one = board.numbPlay === 'one'

    if (result && result.winner === 'draw') { return { text: `It's a draw` } }

    if (result) {

      const name = nameOf(board, result.winner)

      const mine = result.winner === board.playerLetter

      if ((one && mine) || (!one && saysYou(name))) { return { text: 'You win!' } }

      return { text: one ? `${name} wins` : `${name} wins!` }

    }

    if (isComputerTurn(board)) { return { text: `${nameOf(board, board.turn)} is thinking`, waiting: true } }

    const name = nameOf(board, board.turn)

    return { text: (one || saysYou(name)) ? 'Your move' : `${name}'s move` }

  }

  let lastStatus = ''

  const updateStatus = function (board) {

    const parts = statusParts(board)

    const over = board.won

    const key = `${parts.text}|${over}`

    if (key !== lastStatus) {

      lastStatus = key

      UIVars.statusText.textContent = parts.text

      if (parts.waiting) {

        const dots = document.createElement('span')

        dots.className = 'dots'

        dots.setAttribute('aria-hidden', 'true')

        dots.innerHTML = '<span>.</span><span>.</span><span>.</span>'

        UIVars.statusText.appendChild(dots)

      }

      // The result lands with a little weight
      UIVars.status.classList.remove('pop')

      if (over) {

        void UIVars.status.offsetWidth

        UIVars.status.classList.add('pop')

      }

    }

    // Lets the stylesheet colour the status line and the hover preview
    UIVars.game.dataset.turn = over ? '' : board.turn

    UIVars.game.dataset.result = over ? board.result.winner : ''

    UIVars.game.toggleAttribute('data-waiting', Boolean(parts.waiting))

    UIVars.game.classList.toggle('is-over', over)

  }

  const updateScoreboard = function (board, scored) {

    const letters = [board.playerLetter, '', other(board.playerLetter)]

    const score = visitScore(tableOf(board))

    ;[0, 2].forEach((i) => {

      const side = UIVars.sides[i]

      const letter = letters[i]

      side.querySelector('.letter').textContent = letter

      side.querySelector('.who-name').textContent = nameOf(board, letter)

      side.classList.toggle('is-x', letter === 'X')

      side.classList.toggle('is-o', letter === 'O')

      side.classList.toggle('is-turn', !board.won && board.turn === letter)

    })

    DrawCtrl.setScores([score[0], score[2], score[1]], letters, scored)

  }

  const updateCells = function (board) {

    const winning = board.result ? board.result.lines.flat() : []

    const waiting = isComputerTurn(board)

    UIVars.cells.forEach((cell, index) => {

      const letter = board.boardPoints[index]

      let state = letter === '' ? 'empty' : letter

      if (winning.includes(index)) { state += ', winning square' }

      if (board.won) { state += '. Press for a new game' }

      cell.setAttribute('aria-label', `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}: ${state}`)

      // Once the game is over any square starts the next one
      cell.setAttribute('aria-disabled', !board.won && (letter !== '' || waiting))

    })

  }

  const updateControls = function (board) {

    UIVars.undo.setAttribute('aria-disabled', !canUndo(board))

    UIVars.redo.setAttribute('aria-disabled', !canRedo(board))

    UIVars.newGameLabel.textContent = board.won ? 'Play again' : 'New game'

  }

  const render = function (board, opts) {

    const options = opts || {}

    DrawCtrl.sync(board, options.instant)

    updateStatus(board)

    updateScoreboard(board, options.scored)

    updateCells(board)

    updateControls(board)

    if (TEST_MODE) {

      UICtrl.findElement('#board-place').textContent = JSON.stringify(board.playingPoints.map(item => item[2]))

    }

  }

  // Draws the saved game again, for when names change
  const refresh = function () {

    render(getBoard(), { instant: true })

  }

  // ---- Listening

  const boardEventListeners = function () {

    UIVars.cells.forEach((cell, index) => {

      cell.addEventListener('click', () => play(index))

    })

    // Arrow keys walk around the board
    UIVars.cellsHolder.addEventListener('keydown', (e) => {

      const index = UIVars.cells.indexOf(document.activeElement)

      if (index === -1) { return }

      const row = Math.floor(index / 3)

      const col = index % 3

      let next = -1

      if (e.key === 'ArrowLeft' && col > 0) { next = index - 1 }

      if (e.key === 'ArrowRight' && col < 2) { next = index + 1 }

      if (e.key === 'ArrowUp' && row > 0) { next = index - 3 }

      if (e.key === 'ArrowDown' && row < 2) { next = index + 3 }

      if (next !== -1) {

        e.preventDefault()

        UIVars.cells[next].focus()

      }

    })

    UIVars.undo.addEventListener('click', undo)

    UIVars.redo.addEventListener('click', redo)

    UIVars.newGame.addEventListener('click', newGame)

    document.addEventListener('keydown', (e) => {

      if (!(e.ctrlKey || e.metaKey) || e.altKey || UIVars.settings.open) { return }

      if (e.target instanceof HTMLInputElement && e.target.type === 'text') { return }

      const key = e.key.toLowerCase()

      if (key === 'z' && !e.shiftKey) {

        e.preventDefault()

        undo()

      } else if ((key === 'z' && e.shiftKey) || key === 'y') {

        e.preventDefault()

        redo()

      }

    })

  }

  const startBoard = function () {

    const board = verifyBoard(getBoard())

    saveBoard(board)

    if (TEST_MODE) {

      const place = document.createElement('div')

      place.className = 'board-place'

      place.id = 'board-place'

      UIVars.controls.insertAdjacentElement('afterend', place)

    }

    // A game that was already on the board is simply there, not redrawn
    render(board, { instant: true })

    boardEventListeners()

    if (isComputerTurn(board)) { computerTurn() }

  }

  // True when the saved game has no marks yet, so the grid can draw itself in
  const startsEmpty = function () {

    const board = verifyBoard(getBoard())

    return board.boardPoints.every(item => item === '')

  }

  return {

    startBoard: () => startBoard(),

    startsEmpty: () => startsEmpty(),

    newGame: (fresh) => newGame(fresh),

    refresh: () => refresh(),

  };
})();


// App Controller
const App = (function (UICtrl, BoardCtrl,
  StorageCtrl, UserCtrl) {

  const UIVars = UICtrl.UIVars

  const useIcon = (button, id) => button.querySelector('use').setAttribute('href', `#${id}`)

  // ---- Opponent

  // value: 'easy', 'medium', 'hard' or 'friend'
  const chooseOpponent = function (value) {

    const xname = UserCtrl.getData('xname')

    if (value === 'friend') {

      UserCtrl.setData('numb players', 'two')

      // Only rename an opponent the player has not named themselves
      if (xname === 'Computer') { UserCtrl.setData('xname', 'Friend') }

    } else {

      UserCtrl.setData('numb players', 'one')

      UserCtrl.setData('difficulty', value)

      if (xname === 'Friend') { UserCtrl.setData('xname', 'Computer') }

    }

    fillAllSettings()

    BoardCtrl.newGame(true)

  }

  // ---- Sound and theme

  const showSound = function () {

    const on = UserCtrl.getData('sound') !== false

    Sound.setEnabled(on)

    useIcon(UIVars.soundToggle, on ? 'i-sound' : 'i-muted')

    UIVars.soundToggle.setAttribute('aria-pressed', on)

    UIVars.soundToggle.title = on ? 'Sound is on' : 'Sound is off'

  }

  const showTheme = function () {

    const paper = UIVars.html.dataset.theme === 'paper'

    // The button shows where it takes you
    useIcon(UIVars.themeToggle, paper ? 'i-board' : 'i-paper')

    const label = paper ? 'Switch to chalkboard' : 'Switch to paper'

    UIVars.themeToggle.setAttribute('aria-label', label)

    UIVars.themeToggle.title = label

  }

  // ---- Settings

  const fillAllSettings = function () {

    UIVars.settName.value = UserCtrl.getData('name')

    UIVars.settXname.value = UserCtrl.getData('xname')

    UICtrl.setChoice(UIVars.settLetter, UserCtrl.getData('letter') === 'O' ? 'O' : 'X')

    const first = UserCtrl.getData('first move')

    UICtrl.setChoice(UIVars.settFirst, (first === 'X' || first === 'O') ? first : 'XO')

    UICtrl.setChoice(UIVars.opponent,
      UserCtrl.getData('numb players') === 'two' ? 'friend' : (UserCtrl.getData('difficulty') || 'easy'))

  }

  const STAT_ROWS = ['stat easy', 'stat medium', 'stat hard', 'stat friend', 'stat total']

  const fillAllStats = function () {

    Array.from(UIVars.statsTable.children).forEach((row, index) => {

      const stats = UserCtrl.getData(STAT_ROWS[index])

      Array.from(row.querySelectorAll('td')).forEach((cell, column) => {

        cell.textContent = stats[column]

      })

    })

  }

  // Circles around the chosen option in every list, sized to each label
  const fitRings = function () {

    UICtrl.findElements('.choice label').forEach((label, index) => {

      let ring = label.querySelector('.ring')

      if (!ring) {

        label.insertAdjacentHTML('beforeend',
          '<svg class="ring" aria-hidden="true" focusable="false"><path pathLength="1" /></svg>')

        ring = label.querySelector('.ring')

      }

      const w = label.offsetWidth

      const h = label.offsetHeight

      // Labels inside the closed settings drawer have no size yet
      if (!w || !h) { return }

      ring.setAttribute('viewBox', `0 0 ${w} ${h}`)

      ring.firstElementChild.setAttribute('d', Sketch.loopPath(40 + index, w, h))

    })

  }

  const openSettings = function () {

    fillAllSettings()

    fillAllStats()

    UIVars.settings.classList.remove('closing')

    UIVars.settings.showModal()

    fitRings()

  }

  const closeSettings = function () {

    if (!UIVars.settings.open || UIVars.settings.classList.contains('closing')) { return }

    UIVars.settings.classList.add('closing')

    setTimeout(() => {

      UIVars.settings.classList.remove('closing')

      // A note showing inside the drawer stays on the page
      if (UIVars.toast.parentElement === UIVars.settings) { document.body.appendChild(UIVars.toast) }

      UIVars.settings.close()

    }, Sketch.still() ? 0 : 200)

  }

  // A name takes effect as it is typed. An empty one goes back to a default.
  const nameField = function (input, dataName, fallback) {

    input.addEventListener('input', () => {

      const value = input.value.trim()

      if (value === '') { return }

      UserCtrl.setData(dataName, value)

      BoardCtrl.refresh()

    })

    input.addEventListener('change', () => {

      if (input.value.trim() === '') {

        UserCtrl.setData(dataName, fallback())

        BoardCtrl.refresh()

      }

      input.value = UserCtrl.getData(dataName)

    })

  }

  const loadEventListeners = function () {

    UIVars.settingsOpen.addEventListener('click', openSettings)

    UIVars.settingsClose.addEventListener('click', closeSettings)

    // A click on the dimmed page beside the drawer closes it
    UIVars.settings.addEventListener('click', (e) => {

      if (e.target === UIVars.settings) { closeSettings() }

    })

    // Escape closes with the same slide as the button
    UIVars.settings.addEventListener('cancel', (e) => {

      e.preventDefault()

      closeSettings()

    })

    UIVars.opponent.addEventListener('change', (e) => {

      chooseOpponent(e.target.value)

    })

    UIVars.settLetter.addEventListener('change', (e) => {

      UserCtrl.setData('letter', e.target.value)

      BoardCtrl.newGame(true)

    })

    UIVars.settFirst.addEventListener('change', (e) => {

      UserCtrl.setData('first move', e.target.value)

      BoardCtrl.newGame(true)

    })

    nameField(UIVars.settName, 'name', () => 'You')

    nameField(UIVars.settXname, 'xname',
      () => UserCtrl.getData('numb players') === 'two' ? 'Friend' : 'Computer')

    UIVars.statsReset.addEventListener('click', () => {

      const names = STAT_ROWS.slice(0, 4)

      const before = names.map(name => UserCtrl.getData(name))

      if (before.every(stats => stats.every(n => n === 0))) {

        UICtrl.showToast('Nothing to reset yet', 2500)

        return

      }

      names.forEach(name => UserCtrl.setData(name, [0, 0, 0]))

      fillAllStats()

      UICtrl.showToast('Statistics reset', 8000, {
        label: 'Undo',
        run: () => {

          // Put the old numbers back, keeping any game finished since
          names.forEach((name, i) => {

            const since = UserCtrl.getData(name)

            UserCtrl.setData(name, before[i].map((n, column) => n + since[column]))

          })

          fillAllStats()

        }
      })

    })

    UIVars.soundToggle.addEventListener('click', () => {

      UserCtrl.setData('sound', UserCtrl.getData('sound') === false)

      showSound()

      // Proof that it is back on
      if (Sound.isEnabled()) { Sound.scratch(0.18) }

    })

    UIVars.themeToggle.addEventListener('click', () => {

      const theme = UIVars.html.dataset.theme === 'paper' ? 'board' : 'paper'

      UIVars.html.dataset.theme = theme

      UserCtrl.setData('theme', theme)

      DrawCtrl.setTheme()

      showTheme()

    })

    window.addEventListener('resize', fitRings)

    // The handwriting font changes the size of every label when it arrives
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(fitRings) }

  }

  return {

    init: () => {

      UserCtrl.ensureProfile()

      DrawCtrl.init(BoardCtrl.startsEmpty())

      showSound()

      showTheme()

      fillAllSettings()

      fitRings()

      loadEventListeners()

      BoardCtrl.startBoard()

    },

    chooseOpponent: (value) => chooseOpponent(value),

    showStats: () => fillAllStats(),

  }
})
  (UICtrl, BoardCtrl, StorageCtrl, UserCtrl)


// Initialize Application
document.addEventListener('DOMContentLoaded', App.init)
