import { BasePolyomino } from "./polyomino";
import { BlockState, Canvas, BlcokDistance, Direction } from "./enum";
import { IBlock, ICoordinate, IPolyominoCoordinate, IDirection } from "./types";
import { getKeys, useInterval } from "./utils";
import { stat } from "fs";

let nextTimer: number | null = null, 
   nextCountDownTimer: number | null = null,
   fallTimer: number | null = null

const rowNum = Canvas.Width / BlcokDistance
const columnNum = Canvas.Height/ BlcokDistance

class Main {
  isPending: boolean
  context: CanvasRenderingContext2D
  polyomino: null | BasePolyomino
  tertis: Array<Array<IBlock>> = (
    new Array(columnNum).fill(null).map((rowNull, columnIndex) => {
      return new Array(rowNum).fill(null).map((colNull, rowIndex) => {
        return {
          x: rowIndex,
          y: columnIndex,
          strokeColor: '#696969',
          fillColor: '#C0C0C0',
          state: BlockState.Unfilled
        }
      })
    })
  )

  constructor() {
    this.init()
  }

  init = () => {
    const canvas = document.querySelector("canvas")
    if(!canvas) {
      throw new Error("canvas is not exist!")
    }else {        
      this.context = canvas.getContext("2d")
      this.next()
    }
  }

  draw = () => {
    this.context.clearRect(0, 0, Canvas.Width, Canvas.Height)
    const polyominoBlockInfo = this.polyomino.getInfo()
    this.tertis.forEach(row => {
      row.forEach(({ x, y, strokeColor, fillColor, state }) => {
        let _x, _y, _strokeColor, _fillColor, polyominoBlock
        polyominoBlock = polyominoBlockInfo.find(polyominoBlock => {
          return (
            polyominoBlock.x === x &&
            polyominoBlock.y === y
          )
        })
        if(state === BlockState.Filled) {
          _x = x * BlcokDistance
          _y = y * BlcokDistance
          _strokeColor = strokeColor
          _fillColor = fillColor
        }else if(!!polyominoBlock) {
          _x = polyominoBlock.x * BlcokDistance
          _y = polyominoBlock.y * BlcokDistance
          _strokeColor = polyominoBlock.strokeColor
          _fillColor = polyominoBlock.fillColor
        }
        this.context.strokeStyle = _strokeColor
        this.context.fillStyle = _fillColor
        this.context.save()
        this.context.fillRect(_x, _y, BlcokDistance - 1, BlcokDistance - 1)
        this.context.strokeRect(_x, _y, BlcokDistance, BlcokDistance)
        this.context.restore()
      })
    })
  }

  clear = (rowIndexList: Array<number>) => {
    let orderIndex = 0
    const order = [
      [5, 6],
      [4, 7],
      [3, 8],
      [2, 9],
      [1, 10]
    ]
    return new Promise(resolve => {
      useInterval(() => {
        rowIndexList.forEach(rowIndex => {
          const unFilledList = order[orderIndex]
          unFilledList.forEach(unFilledIndex => {
            this.tertis[rowIndex][unFilledIndex].state = BlockState.Unfilled
          })
        })
        this.draw()
        orderIndex += 1
      }, 250, 4, true).then(() => {
        // @ts-ignore
        resolve()
      })
    })
  }

  xxx = () => {
    
  }

  createAutoFall() {
    fallTimer = window.setInterval(() => {
      this.movePolyominoDown()
    }, 1000)
  }

  closeAutoFall() {
    !!fallTimer && window.clearInterval(fallTimer)
  }

  movePolyominoLeft = () => {
    const isMoveSuccess = this.movePolyomino(Direction.Left)
    if(!isMoveSuccess) { 
      if(this.isPending) {
        nextTimer = window.setTimeout(() => {
          this.beforeNext()
          if(nextCountDownTimer) window.clearTimeout(nextCountDownTimer)
          nextTimer = null
          nextCountDownTimer = null
        }, 1000)
      }
    }
    return isMoveSuccess
  }
  
  movePolyominoRight = () => {
    const isMoveSuccess = this.movePolyomino(Direction.Right)
    if(!isMoveSuccess) { 
      if(this.isPending) {
        nextTimer = window.setTimeout(() => {
          this.beforeNext()
          if(nextCountDownTimer) window.clearTimeout(nextCountDownTimer)
          nextTimer = null
          nextCountDownTimer = null
        }, 1000)
      }
    }
    return isMoveSuccess
  }

  movePolyominoDown = () => {
    const isMoveSuccess = this.movePolyomino(Direction.Down)
    if(!isMoveSuccess) { 
      this.closeAutoFall()
      if(!this.isPending) {
        this.isPending = true
        nextCountDownTimer = window.setTimeout(() => {
          this.beforeNext()
          if(nextTimer) window.clearTimeout(nextTimer)
          nextTimer = null
          nextCountDownTimer = null
        }, 3000)
        nextTimer = window.setTimeout(() => {
          this.beforeNext()
          if(nextCountDownTimer) window.clearTimeout(nextCountDownTimer)
          nextTimer = null
          nextCountDownTimer = null
        }, 1000)
      }
    }
    return isMoveSuccess
  }

  resetPolyomino = () => {
    this.polyomino = null
  }

  getFilledRow = () => {
    return this.tertis.reduce((acc: Array<number>, row, index) => {
      const isAllFilled = row.every(({ state }) => state === BlockState.Filled)
      if(isAllFilled) acc.push(index)
      return acc
    }, [])
  }

  clearBlock = () => {
    return new Promise(resolve => {
      this.tertis.forEach(row => {
        const isAllFilled = row.every(({ state }) => state === BlockState.Filled)
        if(isAllFilled) {
          row.forEach(({ strokeColor, fillColor }, index) => {
            row[index].strokeColor = strokeColor
            row[index].fillColor = fillColor
            row[index].state = BlockState.Unfilled
          })
        }
      })
      this.draw()
      // @ts-ignore
      resolve()
    })
  }
  
  beforeNext = () => {
    return new Promise(resolve => {
      const polyominoBlockInfo = this.polyomino.getInfo()
      this.resetPolyomino()
      polyominoBlockInfo.forEach(({ x, y, strokeColor, fillColor }) => {
        const row = this.tertis[y]
        const index = row.findIndex(({ x: _x }) => _x === x)
        if(index > -1) {
          row[index].strokeColor = strokeColor
          row[index].fillColor = fillColor
          row[index].state = BlockState.Filled
        }
      })
      const filledRowInedxList = this.getFilledRow()
      if(filledRowInedxList.length > 0) {
        this.clear(filledRowInedxList).then(() => {
          this.tertis.forEach((row, rowIndex) => {
            const lastRow = this.tertis[rowIndex - 1]
            const isAllUnFilled = row.every(({ state }) => state === BlockState.Unfilled)
            if(isAllUnFilled && !!lastRow) {
              row.forEach((block, index) => {
                row[index].strokeColor = lastRow[index].strokeColor
                row[index].fillColor = lastRow[index].fillColor
                row[index].state = lastRow[index].state
              })
            }
          })
          this.draw()
          // @ts-ignore
          resolve()
        })
      }else {
        // @ts-ignore
        resolve()
      }
    })
  }

  next = () => {
    // this.polyomino.creat  polyomino()
    this.createAutoFall()
  }

  checkPolyominoCollide = (polyominoCoordinate: IPolyominoCoordinate): IDirection<boolean> => {
    const status: IDirection<boolean> = { left: false, right: false, bottom: false }
    const nearbyBlockCoordinate: Array<IDirection<ICoordinate>> = polyominoCoordinate.reduce((acc, coordinate) => {
        const _x = coordinate.x, _y = coordinate.y
        return [...acc, {
          left: {x: _x - 1, y: _y },
          right:{ x: _x + 1, y: _y },
          bottom: { x: _x, y: _y + 1 }
        }]
    }, [])
    nearbyBlockCoordinate.forEach((directionMap) => {
      getKeys(directionMap).forEach(direction => {
        const naerByBlock = directionMap[direction]
        if(
          naerByBlock.y === columnNum ||
          naerByBlock.x === rowNum ||
          naerByBlock.x < 0
        ) {
          status[direction] = true
        }
        if(!status[direction]) {
          const row = this.tertis[naerByBlock.y]
          if(!!row) {
            const block = row.find(block => {
              return block.x === naerByBlock.x && block.y === naerByBlock.y
            })
            if(!!block && block.state === BlockState.Filled) {
              status[direction] = true
            }
          }
        }
      })
    })
    return status
  }

  movePolyomino = (direction: Direction) => {
    let isMoveSuccess = false, _x = 0, _y = 0
    const { 
      left: isLeftCollide, right: isRightCollide, bottom: isBottomCollide 
    } = this.checkPolyominoCollide(this.polyomino.coordinate);    
    ({
     [Direction.Left]: () => {
       _x = isLeftCollide ? -1 : 0
       isMoveSuccess = isLeftCollide
     },
     [Direction.Right]: () => {
       _x = isRightCollide ? -1 : 0
       isMoveSuccess = isRightCollide
     },
     [Direction.Down]: () => {
      _y = isBottomCollide ? 0 : BlcokDistance
      isMoveSuccess = isBottomCollide
     }
    })[direction]()
    if(isMoveSuccess) {
      this.polyomino.updateCoordinate({ 
        x: this.polyomino.anchor.x + _x, 
        y: this.polyomino.anchor.y + _y 
       })
      this.draw()
    } 
    return isMoveSuccess
  }
}