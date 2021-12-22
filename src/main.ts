import { BasePolyomino } from "./polyomino";
import { BlockState, Canvas, BlcokDistance, Direction } from "./enum";
import { IBlock, ICoordinate, IPolyominoCoordinate, IDirection } from "./types";
import { getKeys } from "./utils";

let nextTimer: number | null = null, 
   nextCountDownTimer: number | null = null,
   fallTimer: number | null = null

const row = Canvas.Width / BlcokDistance
const column = Canvas.Height/ BlcokDistance

class Main {
  isPending: boolean
  context: CanvasRenderingContext2D
  polyomino: null | BasePolyomino
  tertis: Array<Array<IBlock>> = (
    new Array(column).fill(null).map((rowNull, columnIndex) => {
      return new Array(row).fill(null).map((colNull, rowIndex) => {
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
      this.context = document.querySelector("canvas").getContext("2d")
      this.next()
    }
  }

  draw = () => {
    this.context.clearRect(0, 0, Canvas.Width, Canvas.Height)
    this.tertis.forEach(row => {
      row.forEach(({ x, y, strokeColor, fillColor, state }) => {
        let _x, _y, _strokeColor, _fillColor
        if(state === BlockState.Filled) {
          _x = x * BlcokDistance
          _y = y * BlcokDistance
          _strokeColor = strokeColor
          _fillColor = fillColor
        }else if(
          x === this.polyomino.coordinate.x &&
          y === this.polyomino.coordinate.y                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
        ) {
          _x = this.polyomino.coordinate.x * BlcokDistance
          _y = this.polyomino.coordinate.y * BlcokDistance
          _strokeColor = this.polyomino.strokeColor
          _fillColor = this.polyomino.fillColor
        }
        this.context.strokeStyle = strokeColor
        this.context.fillStyle = fillColor
        this.context.save()
        this.context.fillRect(_x, _y, BlcokDistance - 1, BlcokDistance - 1)
        this.context.strokeRect(_x, _y, BlcokDistance, BlcokDistance)
        this.context.restore()
      })
    })
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
  
  beforeNext = () => {
    this.closeAutoFall()
    const polyominoInfo = this.polyomino.getInfo()
    polyominoInfo.forEach(({ x, y, strokeColor, fillColor }) => {
      const row = this.tertis[y]
      const index = row.findIndex(({ x: _x }) => _x === x)
      if(index > -1) {
        row[index].strokeColor = strokeColor
        row[index].fillColor = fillColor
        row[index].state = BlockState.Filled
      }
    })
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
    // mock animation
    setTimeout(() => {
      this.polyomino = null
      this.tertis.forEach((row, rowIndex) => {
        const lastRow = this.tertis[rowIndex - 1]
        const isAllUnFilled = row.every(({ state }) => state === BlockState.Unfilled)
        if(isAllUnFilled && !!lastRow) {
          row.forEach((block, index) => {
            row[index].strokeColor = lastRow[index].strokeColor
            row[index].fillColor = lastRow[index].fillColor
            row[index].state = BlockState.Filled
          })
        }
      })
      this.draw()
      this.next()
    }, 1000)
  }

  next = () => {
    // this.polyomino.creat  polyomino()
    this.createAutoFall()
  }

  checkCollide = (polyominoCoordinateInfo: IPolyominoCoordinate): IDirection<boolean> => {
    const status: IDirection<boolean> = { left: false, right: false, bottom: false }
    const range = (() => {
      let start = 0, end = 0
      polyominoCoordinateInfo.forEach(coordinate => {
        if(coordinate.y < start) start = coordinate.y
        if(coordinate.y > end) end = coordinate.y
      })
      return { start, end }
    })()
    const blocks = this.tertis.slice(range.start, range.end + 1)
    const nearbyCoordinateInfo: Array<IDirection<ICoordinate>> =  polyominoCoordinateInfo.reduce((acc, coordinate) => {
        const _x = coordinate.x * BlcokDistance, _y = coordinate.y * BlcokDistance
        return [...acc, {
          left: {x: _x - BlcokDistance, y: _y },
          right:{ x: _x + BlcokDistance, y: _y },
          bottom: { x: _x, y: _y + BlcokDistance }
        }]
    }, [])
    nearbyCoordinateInfo.forEach(coordinateInfo => {
      blocks.forEach(({ x, y, state }) => {
        getKeys(coordinateInfo).forEach(key => {
          if(
            coordinateInfo[key].x === x &&
            coordinateInfo[key].y === y &&
            state === BlockState.Filled
          ) {
            status[key] = true
          }
        })
      })
      getKeys(coordinateInfo).forEach(key => {
        if(
          coordinateInfo[key].x == 0 ||
          coordinateInfo[key].x == Canvas.Width ||
          coordinateInfo[key].y == Canvas.Height
        ) {
          status[key] = true
        }
      })
    })
    return status
  }

  movePolyomino = (direction: Direction) => {
    let isMoveSuccess = false, _x = 0, _y = 0
    const { 
      left: isLeftCollide, right: isRightCollide, bottom: isBottomCollide 
    } = this.checkCollide(this.polyomino.coordinate);    
    ({
     [Direction.Left]: () => {
       _x = isLeftCollide ? BlcokDistance * -1 : 0
       isMoveSuccess = isLeftCollide
     },
     [Direction.Right]: () => {
       _x = isRightCollide ? BlcokDistance * -1 : 0
       isMoveSuccess = isRightCollide
     },
     [Direction.Down]: () => {
      _y = isBottomCollide ? 0 : BlcokDistance
      isMoveSuccess = isBottomCollide
     }
    })[direction]()
    if(isMoveSuccess) {
      this.polyomino.updateCoordinate({ x: _x, y: _y })
      this.draw()
    } 
  
    return isMoveSuccess
  }
}