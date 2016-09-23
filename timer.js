// TODO: module / lib

const EventEmitter = require('events')

function tick () {
  if (this._status === 'paused') return
  if (Date.now() >= this._endTime) {
    this.stop()
    this.emit('tick', this._stopwatch ? this._duration : 0)
    this.emit('done')
  } else {
    this.emit('tick', this.time)
  }
}

class Timer extends EventEmitter {
  constructor (options) {
    super()
    this._interval = options && options.interval || 1000
    this._stopwatch = options && options.stopwatch || false
    this._endTime = 0
    this._pauseTime = 0
    this._duration = null
    this._timeoutID = null
    this._status = 'stopped' // 'running' or 'paused'
  }

  start (duration) {
    if (this._status !== 'stopped') return
    if (duration == null) throw new TypeError('must provide duration parameter')
    this._duration = duration
    this._endTime = Date.now() + duration
    this._status = 'running'
    this.emit('tick', this._stopwatch ? 0 : this._duration)
    this._timeoutID = setInterval(tick.bind(this), this._interval)
  }

  stop () {
    clearInterval(this._timeoutID)
    this._status = 'stopped'
  }

  pause () {
    if (this._status !== 'running') return
    this._pauseTime = Date.now()
    this._status = 'paused'
  }

  resume () {
    if (this._status !== 'paused') return
    this._endTime += Date.now() - this._pauseTime
    this._pauseTime = 0
    this._status = 'running'
  }

  get time () {
    if (this._status === 'stopped') return 0
    if (this._status === 'paused') return this._endTime - this._pauseTime
    let left = this._endTime - Date.now()
    return this._stopwatch ? this._duration - left : left
  }

  get duration () {
    return this._duration
  }

  get status () {
    return this._status
  }
}

module.exports = Timer
