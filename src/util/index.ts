export const useInterval = function (
  action: Function,
  interval: number = 3000,
  count: number = 1,
  immediate: boolean = false,
  ...args: Array<any>
): Promise<void> {
  let timer: number,
    times: number = 0
  const execute = () => {
    times += 1
    action.apply(null, [...args, times])
  }
  return new Promise((resolve) => {
    if (immediate) execute()
    if (times >= count) resolve()
    timer = window.setInterval(() => {
      execute()
      if (times >= count) {
        window.clearInterval(timer)
        resolve()
      }
    }, interval)
  })
}

export const deepColne = function <T = any>(val: T): T {
  return JSON.parse(JSON.stringify(val))
}

export const getKeys = function <U extends object, T extends keyof U>(obj: U): Array<T> {
  return Object.keys(obj) as Array<T>
}

export const getKeyValue = function <U extends object, T extends keyof U>(obj: U, key: T): any {
  return obj[key]
}

export const isNil = (value: any): boolean => value == null

abstract class Timer {
  sec: number
  overwritAble: boolean
  timer: null | number = null
  action: null | Function = null

  constructor(sec: number, isOverwritAble: boolean = false) {
    this.sec = sec
    this.overwritAble = isOverwritAble
  }

  abstract create(): void

  abstract start(cb: Function, ...args: Array<any>): void

  abstract continue(): void

  abstract close(): void
}

export class IntervalTimer extends Timer {
  constructor(sec: number, isOverwritAble: boolean = false) {
    super(sec, isOverwritAble)
  }

  create() {
    const action = () => {
      this.timer = window.setInterval(() => {
        if (!!this.action) this.action()
      }, this.sec * 1000)
    }
    if (this.overwritAble) {
      this.close()
      action()
    } else {
      if (!this.timer) action()
    }
  }

  start(cb: Function, ...args: Array<any>) {
    this.action = () => cb(args)
    this.create()
  }

  continue() {}

  close() {
    if (this.timer) {
      window.clearInterval(this.timer)
      this.timer = null
    }
  }
}

export class CountDownTimer extends Timer {
  leftsec: number = 0

  constructor(sec: number, isOverwritAble: boolean = false) {
    super(sec * 10, isOverwritAble)
  }

  create() {
    const action = () => {
      this.timer = window.setInterval(() => {
        this.leftsec -= 1
        if (this.leftsec === 0) {
          if (!!this.action) this.action()
          this.leftsec = this.sec
          this.close()
        }
      }, 100)
    }
    if (this.overwritAble) {
      this.close()
      action()
    } else {
      if (!this.timer) action()
    }
  }

  start(cb: Function, ...args: Array<any>) {
    this.action = () => cb(args)
    this.leftsec = this.sec
    this.create()
  }

  continue() {
    if (!!this.action) {
      this.create()
    }
  }

  close() {
    if (this.timer) {
      window.clearInterval(this.timer)
      this.timer = null
    }
  }
}
