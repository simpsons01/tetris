import { isPromise } from './utils'

export class EventEmitter {
  events: { [key: string]: Array<{ isOnce: boolean; action: Function }> } = {}

  on(event: string, action: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push({
      isOnce: false,
      action
    })
    return () => {
      this.remove(event, action)
    }
  }

  once(event: string, action: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push({
      isOnce: true,
      action
    })
    return () => {
      this.remove(event, action)
    }
  }

  emit(event: string, ...args: Array<any>) {
    const events = this.events[event]
    const list = []
    if (events) {
      for (const { action, isOnce } of events) {
        const res = action.apply(null, args)
        list.push(res)
        if (isOnce) {
          this.remove(event, action)
        }
      }
    }
    return list
  }

  async emitAsync(event: string, ...args: Array<any>) {
    const events = this.events[event]
    const list = []
    if (events) {
      for (const { action, isOnce } of events) {
        const _res = action.apply(null, args)
        if (isPromise(_res)) {
          const res = await _res
          list.push(res)
        }
        if (isOnce) {
          this.remove(event, action)
        }
      }
    }
    return list
  }

  remove(event: string, action: Function) {
    let isSuccess = false
    const events = this.events[event]
    if (events) {
      const index = events.findIndex(({ action: _action }) => _action === action)
      if (index > -1) {
        events.splice(index, 1)
        if (events.length === 0) {
          delete this.events[event]
        }
        isSuccess = true
      }
    }
    return isSuccess
  }

  removeAll() {
    this.events = {}
  }
}
