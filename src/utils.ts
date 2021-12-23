export const useInterval = function(
  action: Function, 
  interval: number = 3000, 
  count: number = 1,
  immediate: boolean = false,
  ...args: Array<any>
): Promise<void> {
  let timer: number, times: number = 0
  const excute = () => {
    action.apply(null, args)
    times += 1
  }
  return new Promise(resolve => {
    if(immediate) excute()
    if(times >= count) resolve()
    timer = window.setInterval(() => {
      excute()
      if(times >= count) {
        window.clearInterval(timer)
        resolve()
      }
    }, interval)
  })
}

export const getKeys = function<U extends object, T extends keyof U>(obj: U): Array<T> {
  return Object.keys(obj) as Array<T>
}

export const getKeyValue = function<U extends object, T extends keyof U>(obj: U, key: T): any {
  return obj[key]
}