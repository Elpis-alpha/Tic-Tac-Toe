/* Tic Tac Toe by Elpis: the drawing kit.

   Sketch draws chalk and pencil strokes on a <canvas> the way a hand would:
   a stroke is a run of small speckled stamps laid along a slightly wobbly
   path, pressed harder at the start than at the end. Rubbing out uses the
   same stamps to remove what is there and leave a faint smear behind.

   Sound makes the matching noises with Web Audio. Nothing is downloaded.

   Neither knows anything about the game. app.js decides what to draw. */

const Sketch = (function () {

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  const still = () => motionQuery.matches

  // Small seeded random generator, so a mark looks the same every time it
  // is redrawn (on resize, on reload, when the theme changes).
  const random = function (seed) {

    let s = seed >>> 0

    return function () {

      s = (s + 0x6D2B79F5) | 0

      let t = Math.imul(s ^ (s >>> 15), 1 | s)

      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t

      return ((t ^ (t >>> 14)) >>> 0) / 4294967296

    }

  }

  const hash = function (...numbers) {

    let h = 2166136261

    numbers.forEach((n) => { h = Math.imul(h ^ (n | 0), 16777619) })

    return h >>> 0

  }

  // width is in board units (the board is 300 units wide). alpha and
  // spacing shape how solid the line is, speck how ragged its edge is.
  const MATERIALS = {
    chalk: { name: 'chalk', width: 9.6, alpha: 0.5, spacing: 0.13, speck: 0.8, soft: 0.5, shake: 0.05, smear: 0.004, dust: true },
    pencil: { name: 'pencil', width: 6, alpha: 0.42, spacing: 0.13, speck: 0.6, soft: 0.5, shake: 0.04, smear: 0.003, dust: false }
  }

  let material = MATERIALS.chalk

  const setMaterial = function (name) {

    material = MATERIALS[name] || MATERIALS.chalk

  }

  const rgb = function (hex) {

    const value = hex.trim().replace('#', '')

    const full = value.length === 3 ? value.split('').map(c => c + c).join('') : value

    return [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16))

  }

  // Stamps: a few speckled discs per colour and size
  const stampCache = new Map()

  const getStamps = function (color, size) {

    const key = `${material.name}|${color}|${size}`

    if (stampCache.has(key)) { return stampCache.get(key) }

    const rand = random(hash(size, key.length, 7))

    const [r, g, b] = rgb(color)

    const half = size / 2

    const set = []

    for (let k = 0; k < 4; k++) {

      const canvas = document.createElement('canvas')

      canvas.width = canvas.height = size

      const ctx = canvas.getContext('2d')

      const image = ctx.createImageData(size, size)

      for (let y = 0; y < size; y++) {

        for (let x = 0; x < size; x++) {

          const d = Math.hypot(x + 0.5 - half, y + 0.5 - half) / half

          if (d >= 1) { continue }

          const edge = d < material.soft ? 1 : 1 - (d - material.soft) / (1 - material.soft)

          // Holes get more likely toward the rim, which frays the edge
          const hole = rand() < material.speck * d

          const o = (y * size + x) * 4

          image.data[o] = r

          image.data[o + 1] = g

          image.data[o + 2] = b

          image.data[o + 3] = hole ? 0 : Math.round(255 * edge * (0.6 + 0.4 * rand()))

        }

      }

      ctx.putImageData(image, 0, 0)

      set.push(canvas)

    }

    stampCache.set(key, set)

    return set

  }

  // One soft disc, used by the eraser and for its smear
  const getSoftStamp = function (color) {

    const key = `soft|${color}`

    if (stampCache.has(key)) { return stampCache.get(key) }

    const size = 64

    const canvas = document.createElement('canvas')

    canvas.width = canvas.height = size

    const ctx = canvas.getContext('2d')

    const [r, g, b] = rgb(color)

    const fill = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)

    fill.addColorStop(0, `rgba(${r},${g},${b},1)`)

    fill.addColorStop(0.55, `rgba(${r},${g},${b},0.75)`)

    fill.addColorStop(1, `rgba(${r},${g},${b},0)`)

    ctx.fillStyle = fill

    ctx.fillRect(0, 0, size, size)

    stampCache.set(key, canvas)

    return canvas

  }

  // ---- Animation: every running stroke is a job, one loop drives them all

  const jobs = []

  let frame = 0

  const STRIDE = 5 // x, y, size, alpha, stamp index

  // Sound and dust ride along with a stroke. If one of them fails, the
  // drawing must still finish.
  const safely = function (callback, ...args) {

    if (!callback) { return }

    try {

      callback(...args)

    } catch (e) {

      console.warn(e)

    }

  }

  const advance = function (job, target) {

    const ctx = job.surface.ctx

    const data = job.data

    ctx.globalCompositeOperation = job.rub ? 'destination-out' : 'source-over'

    for (; job.done < target; job.done++) {

      const o = job.done * STRIDE

      const size = data[o + 2]

      ctx.globalAlpha = data[o + 3]

      ctx.drawImage(job.rub ? job.soft : job.stamps[data[o + 4]], data[o] - size / 2, data[o + 1] - size / 2, size, size)

    }

    // The eraser leaves a little of what it rubbed out
    if (job.rub && job.smear) {

      ctx.globalCompositeOperation = 'source-over'

      ctx.globalAlpha = job.smear

      for (; job.smeared < target; job.smeared++) {

        const o = job.smeared * STRIDE

        const size = data[o + 2] * 1.15

        ctx.drawImage(job.soft, data[o] - size / 2, data[o + 1] - size / 2, size, size)

      }

    }

    ctx.globalAlpha = 1

    ctx.globalCompositeOperation = 'source-over'

    if (job.onMove && target > 0 && target <= job.count) {

      const o = (target - 1) * STRIDE

      safely(job.onMove, data[o] / job.surface.scale, data[o + 1] / job.surface.scale)

    }

  }

  const finish = function (job) {

    advance(job, job.count)

    const index = jobs.indexOf(job)

    if (index !== -1) { jobs.splice(index, 1) }

    job.resolve()

  }

  // A hand speeds up and slows down a little; it does not ease like a UI
  const pace = (t) => 0.55 * t + 0.45 * (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

  const tick = function (now) {

    frame = 0

    jobs.slice().forEach((job) => {

      if (now < job.start) { return }

      if (!job.begun) {

        job.begun = true

        safely(job.onStart)

      }

      const t = job.duration > 0 ? Math.min(1, (now - job.start) / job.duration) : 1

      if (t >= 1) {

        finish(job)

      } else {

        advance(job, Math.ceil(pace(t) * job.count))

      }

    })

    if (jobs.length && !frame) { frame = requestAnimationFrame(tick) }

  }

  const schedule = function (job, opts) {

    const promise = new Promise((resolve) => { job.resolve = resolve })

    job.done = 0

    job.smeared = 0

    job.onMove = opts.onMove

    job.onStart = opts.onStart

    const duration = opts.duration || 0

    if (opts.instant || still() || duration <= 0) {

      job.onMove = null

      advance(job, job.count)

      job.resolve()

      return promise

    }

    job.duration = duration

    job.start = performance.now() + (opts.delay || 0)

    jobs.push(job)

    if (!frame) { frame = requestAnimationFrame(tick) }

    return promise

  }

  // Completes whatever is still being drawn, at once
  const flush = function (surface) {

    jobs.slice().forEach((job) => {

      if (!surface || job.surface === surface) {

        job.onMove = null

        finish(job)

      }

    })

  }

  // Walks a polyline (device pixels) and returns evenly spaced points
  const resample = function (points, step) {

    const out = []

    let carry = 0

    for (let i = 1; i < points.length; i++) {

      const [x1, y1] = points[i - 1]

      const [x2, y2] = points[i]

      const length = Math.hypot(x2 - x1, y2 - y1)

      if (length === 0) { continue }

      let at = carry

      while (at <= length) {

        const t = at / length

        out.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t])

        at += step

      }

      carry = at - length

    }

    return out

  }

  // ---- A surface is a canvas with its own unit system

  const createSurface = function (canvas, unitsWide, maxRatio) {

    const surface = { canvas: canvas, ctx: canvas.getContext('2d'), scale: 1, width: 0, height: 0 }

    // Matches the canvas bitmap to its size on screen. Returns true when
    // the bitmap changed (and so was cleared).
    surface.fit = function () {

      const box = canvas.getBoundingClientRect()

      const ratio = Math.min(window.devicePixelRatio || 1, maxRatio || 3)

      const w = Math.max(1, Math.round(box.width * ratio))

      const h = Math.max(1, Math.round(box.height * ratio))

      const changed = canvas.width !== w || canvas.height !== h

      if (changed) {

        flush(surface)

        canvas.width = w

        canvas.height = h

      }

      // With unitsWide the surface is that many units across, whatever
      // its size. Without it, one unit is one CSS pixel.
      surface.scale = unitsWide ? w / unitsWide : ratio

      surface.width = w / surface.scale

      surface.height = h / surface.scale

      return changed

    }

    surface.clear = function () {

      flush(surface)

      surface.ctx.clearRect(0, 0, canvas.width, canvas.height)

    }

    /* Draws a stroke through points (in units).
       opts: color (hex), width (units), seed, duration and delay (ms),
       strength (0-1), soft, instant, onStart(), onMove(x, y) */
    surface.stroke = function (points, opts) {

      const scale = surface.scale

      const width = (opts.width || material.width) * scale

      const size = Math.max(3, Math.round(width))

      // soft: one blurred disc instead of speckled ones, for smears
      const stamps = opts.soft ? [getSoftStamp(opts.color)] : getStamps(opts.color, size)

      const rand = random(opts.seed || 1)

      const path = resample(points.map(p => [p[0] * scale, p[1] * scale]), Math.max(0.7, width * material.spacing))

      const count = path.length

      const data = new Float32Array(count * STRIDE)

      const strength = (opts.strength === undefined ? 1 : opts.strength) * (opts.soft ? 1 : material.alpha)

      const shake = width * material.shake

      path.forEach((point, i) => {

        const t = count > 1 ? i / (count - 1) : 0

        // Pressed on at the start, lifting off toward the end
        const pressure = 1 - 0.3 * t * t + (rand() - 0.5) * 0.12

        const o = i * STRIDE

        data[o] = point[0] + (rand() - 0.5) * shake

        data[o + 1] = point[1] + (rand() - 0.5) * shake

        data[o + 2] = size * (0.84 + 0.16 * pressure) * (0.95 + 0.1 * rand())

        data[o + 3] = Math.min(1, strength * pressure * (0.75 + 0.5 * rand()))

        data[o + 4] = Math.floor(rand() * stamps.length)

      })

      return schedule({ surface: surface, data: data, count: count, stamps: stamps }, opts)

    }

    /* Rubs out along points (in units) with an eraser `width` units wide.
       opts: width, color (the smear left behind), strength (0-1, how
       hard it rubs), duration, delay, instant, onStart() */
    surface.rub = function (points, opts) {

      const scale = surface.scale

      const width = (opts.width || 60) * scale

      const path = resample(points.map(p => [p[0] * scale, p[1] * scale]), Math.max(1, width * 0.16))

      const count = path.length

      const data = new Float32Array(count * STRIDE)

      path.forEach((point, i) => {

        const o = i * STRIDE

        data[o] = point[0]

        data[o + 1] = point[1]

        data[o + 2] = width

        data[o + 3] = opts.strength === undefined ? 0.7 : opts.strength

      })

      return schedule({
        surface: surface, data: data, count: count, rub: true,
        soft: getSoftStamp(opts.color || '#ffffff'),
        smear: opts.color ? material.smear : 0
      }, opts)

    }

    return surface

  }

  // ---- Paths. Each takes a random generator and returns points.

  // A ruled-by-hand line: nearly straight, with a slow drift and a bow
  const line = function (rand, x1, y1, x2, y2, wobble) {

    const length = Math.hypot(x2 - x1, y2 - y1)

    const amount = wobble === undefined ? 1 : wobble

    const steps = Math.max(6, Math.round(length / 5))

    const nx = -(y2 - y1) / (length || 1)

    const ny = (x2 - x1) / (length || 1)

    const bow = (rand() - 0.5) * length * 0.022 * amount

    const drift = (0.5 + rand()) * Math.min(1.6, length * 0.008) * amount

    const phase = rand() * Math.PI * 2

    const waves = 1.2 + rand() * 1.6

    const points = []

    for (let i = 0; i <= steps; i++) {

      const t = i / steps

      const off = bow * Math.sin(Math.PI * t) + drift * Math.sin(phase + t * Math.PI * waves)

      points.push([x1 + (x2 - x1) * t + nx * off, y1 + (y2 - y1) * t + ny * off])

    }

    return points

  }

  // A circle drawn in one go: slightly squashed, tilted, and the end
  // overshoots the start instead of meeting it.
  const ring = function (rand, cx, cy, rx, ry, wildness) {

    const wild = wildness === undefined ? 1 : wildness

    const start = -Math.PI / 2 + (rand() - 0.5) * 1.4

    const sweep = (Math.PI * 2 + 0.25 + rand() * 0.45) * (rand() < 0.5 ? 1 : -1)

    const tilt = (rand() - 0.5) * 0.5 * wild

    const squash = 1 - (0.1 - rand() * 0.14) * wild

    const grow = 1 + (rand() - 0.35) * 0.1 * wild

    const steps = 44

    const points = []

    for (let i = 0; i <= steps; i++) {

      const t = i / steps

      const angle = start + sweep * t

      const reach = 1 + (grow - 1) * t

      const x = Math.cos(angle) * rx * reach

      const y = Math.sin(angle) * ry * reach * squash

      points.push([cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)])

    }

    return points

  }

  // Back and forth across a box, the way a hand wipes with an eraser
  const scrub = function (rand, x, y, w, h, rows) {

    const points = []

    for (let i = 0; i < rows; i++) {

      const t = rows === 1 ? 0.5 : i / (rows - 1)

      const yy = y + h * t

      const lean = (rand() - 0.5) * h * 0.18

      const a = [x + (rand() - 0.5) * w * 0.08, yy + lean]

      const b = [x + w + (rand() - 0.5) * w * 0.08, yy - lean]

      if (i % 2 === 0) { points.push(a, b) } else { points.push(b, a) }

    }

    return points

  }

  // SVG path data for a hand-drawn loop that fits a box w by h, used to
  // circle the chosen option in a list.
  const loopPath = function (seed, w, h) {

    const points = ring(random(seed), w / 2, h / 2, w / 2 - 2, h / 2 - 6, 0.35)

    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')

  }

  /* A tile of surface grain as an image address, used as a CSS mask so chalk
     skips over the pits in the board and pencil over the tooth of the
     paper. depth is how much is lost in the pits (0-1). */
  const grain = function (depth, seed) {

    const size = 256

    const canvas = document.createElement('canvas')

    canvas.width = canvas.height = size

    const ctx = canvas.getContext('2d')

    const image = ctx.createImageData(size, size)

    const rand = random(seed || 11)

    // Coarse noise, repeated at the edges so the tile is seamless
    const cell = 8

    const cells = size / cell

    const coarse = new Float32Array(cells * cells)

    for (let i = 0; i < coarse.length; i++) { coarse[i] = rand() }

    const at = (cx, cy) => coarse[((cy + cells) % cells) * cells + ((cx + cells) % cells)]

    const smooth = (t) => t * t * (3 - 2 * t)

    for (let y = 0; y < size; y++) {

      for (let x = 0; x < size; x++) {

        const gx = x / cell

        const gy = y / cell

        const x0 = Math.floor(gx)

        const y0 = Math.floor(gy)

        const tx = smooth(gx - x0)

        const ty = smooth(gy - y0)

        const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * tx

        const bottom = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * tx

        const value = 0.58 * rand() + 0.42 * (top + (bottom - top) * ty)

        // Most of the surface takes the mark fully, the pits take less
        const taken = Math.min(1, Math.max(0, (value - 0.24) / 0.3))

        image.data[(y * size + x) * 4 + 3] = Math.round(255 * (1 - depth + depth * smooth(taken)))

      }

    }

    ctx.putImageData(image, 0, 0)

    // Handed over as a short blob: address rather than a data: one. The
    // address ends up in a CSS variable that many elements use, and a
    // hundred thousand characters there slows every style change down.
    const bytes = atob(canvas.toDataURL('image/png').split(',')[1])

    const buffer = new Uint8Array(bytes.length)

    for (let i = 0; i < bytes.length; i++) { buffer[i] = bytes.charCodeAt(i) }

    return URL.createObjectURL(new Blob([buffer], { type: 'image/png' }))

  }

  // ---- Dust: specks that fall from the chalk. One canvas over the page.

  const dust = (function () {

    let canvas = null

    let ctx = null

    let ratio = 1

    let loop = 0

    let last = 0

    const specks = []

    const fit = function () {

      ratio = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.round(window.innerWidth * ratio)

      canvas.height = Math.round(window.innerHeight * ratio)

    }

    const step = function (now) {

      loop = 0

      const dt = Math.min(0.05, (now - last) / 1000)

      last = now

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = specks.length - 1; i >= 0; i--) {

        const s = specks[i]

        s.age += dt

        if (s.age >= s.life) { specks.splice(i, 1); continue }

        s.vy += 260 * dt

        s.vx *= 0.985

        s.x += s.vx * dt

        s.y += s.vy * dt

        ctx.globalAlpha = s.alpha * (1 - s.age / s.life)

        ctx.fillStyle = s.color

        ctx.fillRect(s.x * ratio, s.y * ratio, s.size * ratio, s.size * ratio)

      }

      ctx.globalAlpha = 1

      if (specks.length) { loop = requestAnimationFrame(step) }

    }

    return {

      attach: function (element) {

        canvas = element

        ctx = canvas.getContext('2d')

        fit()

        window.addEventListener('resize', fit)

      },

      // x and y are viewport coordinates
      puff: function (x, y, color, amount) {

        if (!canvas || !material.dust || still()) { return }

        for (let i = 0; i < amount; i++) {

          if (specks.length > 400) { break }

          specks.push({
            x: x + (Math.random() - 0.5) * 6,
            y: y + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 34,
            vy: 8 + Math.random() * 50,
            size: 0.7 + Math.random() * 1.3,
            alpha: 0.35 + Math.random() * 0.5,
            life: 0.45 + Math.random() * 0.75,
            age: 0,
            color: color
          })

        }

        if (!loop) {

          last = performance.now()

          loop = requestAnimationFrame(step)

        }

      }

    }

  })()

  return {

    createSurface: createSurface,

    setMaterial: setMaterial,

    material: () => material,

    flush: flush,

    random: random,

    hash: hash,

    line: line,

    ring: ring,

    scrub: scrub,

    loopPath: loopPath,

    grain: grain,

    dust: dust,

    still: still

  }

})();


const Sound = (function () {

  let context = null

  let master = null

  let noise = null

  let enabled = true

  let armed = false

  let voice = 'chalk'


  // Browsers only allow sound after the player has touched the page, so
  // nothing plays before that, and the audio graph is built the first
  // time something needs to.
  const ready = function () {

    if (!enabled || !armed) { return false }

    const Engine = window.AudioContext || window.webkitAudioContext

    if (!Engine) { return false }

    if (!context) {

      try {

        context = new Engine()

      } catch (e) {

        enabled = false

        return false

      }

      master = context.createGain()

      master.gain.value = 1

      master.connect(context.destination)

      const length = context.sampleRate * 2

      noise = context.createBuffer(1, length, context.sampleRate)

      const channel = noise.getChannelData(0)

      for (let i = 0; i < length; i++) { channel[i] = Math.random() * 2 - 1 }

    }

    if (context.state === 'suspended') { context.resume() }

    return context.state !== 'closed'

  }

  // Some browsers (iOS Safari) only start audio from inside the handler
  // of a tap or a key press, and stop it again when the page is left.
  // So every such event wakes the audio up, before the game reacts to it.
  const wake = function () {

    armed = true

    if (enabled) { ready() }

  }

  ;['pointerup', 'touchend', 'click', 'keydown'].forEach((type) => {

    window.addEventListener(type, wake, { capture: true, passive: true })

  })

  const hiss = function (when, duration) {

    const source = context.createBufferSource()

    source.buffer = noise

    source.loop = true

    source.start(when, Math.random() * 1.5)

    source.stop(when + duration + 0.1)

    return source

  }

  // The scrape of chalk (or pencil) for as long as a stroke takes
  const scratch = function (seconds, weight) {

    if (!ready()) { return }

    const now = context.currentTime

    const duration = Math.max(0.05, seconds)

    const chalk = voice === 'chalk'

    const source = hiss(now, duration)

    const band = context.createBiquadFilter()

    band.type = 'bandpass'

    band.frequency.value = (chalk ? 2500 : 5200) * (0.9 + Math.random() * 0.25)

    band.Q.value = chalk ? 1.1 : 0.7

    const high = context.createBiquadFilter()

    high.type = 'highpass'

    high.frequency.value = chalk ? 900 : 2200

    const gain = context.createGain()

    const level = (chalk ? 0.2 : 0.07) * (weight || 1)

    // A hand does not press evenly, so the scrape flutters
    const points = Math.max(4, Math.round(duration * 60))

    const curve = new Float32Array(points)

    for (let i = 0; i < points; i++) {

      const t = i / (points - 1)

      const shape = Math.min(1, t * 10) * Math.min(1, (1 - t) * 5)

      curve[i] = level * shape * (0.55 + Math.random() * 0.45)

    }

    gain.gain.setValueAtTime(0, now)

    gain.gain.setValueCurveAtTime(curve, now, duration)

    source.connect(band)

    band.connect(high)

    high.connect(gain)

    gain.connect(master)

    // The knock of chalk touching the board
    if (chalk) {

      const knock = context.createOscillator()

      const knockGain = context.createGain()

      knock.frequency.setValueAtTime(260, now)

      knock.frequency.exponentialRampToValueAtTime(110, now + 0.04)

      knockGain.gain.setValueAtTime(0.1 * (weight || 1), now)

      knockGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)

      knock.connect(knockGain)

      knockGain.connect(master)

      knock.start(now)

      knock.stop(now + 0.07)

    }

  }

  // The soft sweep of an eraser
  const wipe = function (seconds) {

    if (!ready()) { return }

    const now = context.currentTime

    const duration = Math.max(0.1, seconds)

    const source = hiss(now, duration)

    const low = context.createBiquadFilter()

    low.type = 'lowpass'

    low.frequency.setValueAtTime(700, now)

    low.frequency.linearRampToValueAtTime(1500, now + duration * 0.5)

    low.frequency.linearRampToValueAtTime(600, now + duration)

    const gain = context.createGain()

    gain.gain.setValueAtTime(0.0001, now)

    gain.gain.linearRampToValueAtTime(voice === 'chalk' ? 0.16 : 0.08, now + duration * 0.3)

    gain.gain.linearRampToValueAtTime(0.0001, now + duration)

    source.connect(low)

    low.connect(gain)

    gain.connect(master)

  }

  const note = function (frequency, when, length, level) {

    const tone = context.createOscillator()

    const gain = context.createGain()

    tone.type = 'triangle'

    tone.frequency.value = frequency

    gain.gain.setValueAtTime(0.0001, when)

    gain.gain.linearRampToValueAtTime(level, when + 0.012)

    gain.gain.exponentialRampToValueAtTime(0.0001, when + length)

    tone.connect(gain)

    gain.connect(master)

    tone.start(when)

    tone.stop(when + length + 0.05)

  }

  // A few plain notes when a game ends
  const chime = function (kind) {

    if (!ready()) { return }

    const now = context.currentTime + 0.02

    if (kind === 'win') {

      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => note(f, now + i * 0.085, 0.5, 0.09))

    } else if (kind === 'lose') {

      [392, 311.13].forEach((f, i) => note(f, now + i * 0.16, 0.55, 0.07))

    } else {

      [440, 440].forEach((f, i) => note(f, now + i * 0.14, 0.35, 0.06))

    }

  }

  return {

    scratch: scratch,

    wipe: wipe,

    chime: chime,

    setVoice: (name) => { voice = name },

    setEnabled: (on) => {

      enabled = on

      if (!on && context && context.state === 'running') { context.suspend() }

    },

    isEnabled: () => enabled

  }

})();
