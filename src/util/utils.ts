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

export const isPromise = (value: any): boolean => (!isNil(value) ? typeof value.then === 'function' : false)
