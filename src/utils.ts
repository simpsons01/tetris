export const useInterval = function(
  cb: Function, 
  intervalTime: number = 3000, 
  ...args: Array<any>
): Function {
  let timer = setInterval(() => {
    cb.apply(null, args)
  }, intervalTime)
  return () => clearInterval(timer)
}

export const getKeys = function<U extends object, T extends keyof U>(obj: U): Array<T> {
  return Object.keys(obj) as Array<T>
}

export const getKeyValue = function<U extends object, T extends keyof U>(obj: U, key: T): any {
  return obj[key]
}