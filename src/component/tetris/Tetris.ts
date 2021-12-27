import { BasePolyomino, PolyominoFactory } from "../polyomino";
import { BlockState, Canvas, BlcokDistance, Direction } from "../../enum";
import { IBlock, ICoordinate, IPolyominoCoordinate, IDirection } from "../../types";
import { getKeys, useInterval } from "../../utils";

let nextTimer: number | null = null, 
   nextCountDownTimer: number | null = null,
   fallTimer: number | null = null

const rowNum = Canvas.Width / BlcokDistance
const columnNum = Canvas.Height/ BlcokDistance

export class Tetris {
  isPending: boolean
  polyominoFactory: PolyominoFactory
  context: CanvasRenderingContext2D
  polyomino: null | BasePolyomino
  data: Array<Array<IBlock>> = (
    new Array(columnNum).fill(null).map((rowNull, columnIndex) => {
      return new Array(rowNum).fill(null).map((colNull, rowIndex) => {
        return {
          x: rowIndex,
          y: columnIndex,
          strokeColor: "#D3D3D3",
          fillColor: "#696969",
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
      this.polyominoFactory = new PolyominoFactory()
      this.context = canvas.getContext("2d")
    }
  }

  startAutoFall = () => {
    fallTimer = window.setInterval(() => {
      this.movePolyominoDown()
    }, 1000)
  }

  closeAutoFall = () => {
    !!fallTimer && window.clearInterval(fallTimer)
  }

  startCountDownTimer = () => {
    nextCountDownTimer = window.setTimeout(() => {
      this.closeCountDownTimer()
      this.closeNextTimer()
      this.beforeNext().then(() => {
        this.next()
      })
    }, 3000)
  }

  closeCountDownTimer = () => {
    if(nextCountDownTimer) {
      window.clearTimeout(nextCountDownTimer)
      nextCountDownTimer = null
    }
  }

  startNextTimer = () => {
    nextTimer = window.setTimeout(() => {
      this.closeCountDownTimer()
      this.closeNextTimer()
      this.beforeNext().then(() => {
        this.next()
      })
    }, 1000)
  }

  closeNextTimer = () => {
    if(nextTimer) {
      window.clearTimeout(nextTimer)
      nextTimer = null
    }
  }

  resetPolyomino = () => {
    this.polyomino = null
  }

  createPolyomino = () => {
    if(!this.polyomino) {
      this.polyomino = this.polyominoFactory.create()
      const { 
        range: { minX, maxX, minY }, 
        anchor: { y: anchorY } 
      } = this.polyomino
      this.polyomino.updateCoordinate({
        x: Math.ceil((rowNum - (maxX - minX + 1)) / 2) - minX,
        y: anchorY - minY
      })
    }
  }

  draw = () => {
    this.context.clearRect(0, 0, Canvas.Width, Canvas.Height)
    const polyominoBlockInfo = !!this.polyomino ? null : this.polyomino.getInfo()
    this.data.forEach(row => {
      row.forEach(({ x, y, strokeColor, fillColor, state }) => {
        let _strokeColor, _fillColor, polyominoBlock
        if(!!polyominoBlockInfo) {
          polyominoBlock = polyominoBlockInfo.find(polyominoBlock => {
            return (
              polyominoBlock.x === x &&
              polyominoBlock.y === y
            )
          })
        }
        if(!!polyominoBlock) {
          _strokeColor = polyominoBlock.strokeColor
          _fillColor = polyominoBlock.fillColor
        }else {
          _strokeColor = strokeColor
          _fillColor = fillColor
        }
        this.context.strokeStyle = _strokeColor
        this.context.fillStyle = _fillColor
        this.context.save()
        this.context.fillRect(x * BlcokDistance, y * BlcokDistance, BlcokDistance - 1, BlcokDistance - 1)
        this.context.strokeRect(x * BlcokDistance, y * BlcokDistance, BlcokDistance, BlcokDistance)
        this.context.restore()
      })
    })
  }

  clearFilledRow = () => {
    let orderIndex = 0
    const order = [
      [5, 6],
      [4, 7],
      [3, 8],
      [2, 9],
      [1, 10]
    ]
    const filledRowInedxList = this.data.reduce((acc: Array<number>, row, index) => {
      const isAllFilled = row.every(({ state }) => state === BlockState.Filled)
      if(isAllFilled) acc.push(index)
      return acc
    }, [])
    return new Promise(resolve => {
      useInterval(() => {
        filledRowInedxList.forEach(rowIndex => {
          order[orderIndex].forEach(unFilledIndex => {
            this.data[rowIndex][unFilledIndex].state = BlockState.Unfilled
          })
        })
        this.draw()
        orderIndex += 1
      }, 250, order.length - 1, true).then(() => {
        // @ts-ignore
        resolve()
      })
    })
  }
  
  fillEmptyRow = () => {
    return new Promise(resolve => {
      const data = (() => {
        let current = 0
        return this.data.reduce((acc, row, rowIndex) => {
          const isRowUnFilled = row.every(({ state }) => state === BlockState.Unfilled)
          const isLasRowUnFilled = (this.data[rowIndex + 1] || []).every(({ state }) => state === BlockState.Unfilled)
          if(!isLasRowUnFilled && isRowUnFilled) {
            current += 1
          }
          const field = isRowUnFilled ? "unFilled" : "notAllFilled"
          acc[current][field].push(rowIndex)
          return acc
        }, [{ unFilled: [], notAllFilled: [] }])
      })()
      if(
        data.length === 1 && 
        Math.min(...data[0].notAllFilled) > Math.max(...data[0].unFilled)
      ) {
        // @ts-ignore
        resolve()
      }else {
        const executeTimes = 4
        resolve(
          useInterval(() => {
            data.forEach(({ unFilled, notAllFilled }) => {
              const from = Math.max(...notAllFilled)
              const to = Math.max(...unFilled)
              const add = (to - from) / executeTimes
              notAllFilled.forEach(rowIndex => {
                this.data[rowIndex].forEach(block => block.y = block.y + add)
              })
            })
            this.draw()
          }, 50, executeTimes, true)
          .then(() => {
            return this.fillEmptyRow()
          })
        )
      }
    })
  }

  movePolyominoLeft = () => {
    const isMoveSuccess = this.movePolyomino(Direction.Left)
    if(!isMoveSuccess) { 
      if(this.isPending) {
        this.startNextTimer()
      }
    }
    return isMoveSuccess
  }
  
  movePolyominoRight = () => {
    const isMoveSuccess = this.movePolyomino(Direction.Right)
    if(!isMoveSuccess) { 
      if(this.isPending) {
        this.startNextTimer()
      }
    }
    return isMoveSuccess
  }

  movePolyominoDown = () => {
    const isMoveSuccess = this.movePolyomino(Direction.Down)
    if(!isMoveSuccess) { 
      this.closeAutoFall()
      if(this.isPending) {
        this.startCountDownTimer()
        this.startNextTimer()
      }else {
        this.isPending = true
      }
    }
    return isMoveSuccess
  }
  
  beforeNext = () => {
    return new Promise(resolve => {
      const polyominoBlockInfo = this.polyomino.getInfo()
      this.resetPolyomino()
      polyominoBlockInfo.forEach(({ x, y, strokeColor, fillColor }) => {
        const row = this.data[y]
        const index = row.findIndex(({ x: _x }) => _x === x)
        if(index > -1) {
          row[index].strokeColor = strokeColor
          row[index].fillColor = fillColor
          row[index].state = BlockState.Filled
        }
      })
      const filledRowInedxList = this.data.reduce((acc: Array<number>, row, index) => {
        const isAllFilled = row.every(({ state }) => state === BlockState.Filled)
        if(isAllFilled) acc.push(index)
        return acc
      }, [])
      if(filledRowInedxList.length > 0) {
        this.clearFilledRow()
         .then(() => {
           return this.fillEmptyRow()
         })
         .then(() => {
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
    this.createPolyomino()
    this.startAutoFall()
  }

  checkPolyominoCollide = (polyominoCoordinate: IPolyominoCoordinate['coordinate']): IDirection<boolean> => {
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
          const row = this.data[naerByBlock.y]
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
       _x = isLeftCollide ? 0 : -1
       isMoveSuccess = !isLeftCollide
     },
     [Direction.Right]: () => {
       _x = isRightCollide ? 0 : 1
       isMoveSuccess = !isRightCollide
     },
     [Direction.Down]: () => {
      _y = isBottomCollide ? 0 : 1
      isMoveSuccess = !isBottomCollide
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