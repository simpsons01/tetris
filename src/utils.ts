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