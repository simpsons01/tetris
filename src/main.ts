import { BaseCube } from "./cube";
import { BlockState, Cube, Canvas, CubeDistance, Move } from "./enum";
import { IBlock, ICubeCoordinate, ICubeCoordinateInfo, ICubeMove } from "./types";
import { getKeys } from "./utils";

let nextTimer: number | null = null, 
   nextCountDownTimer: number | null = null,
   fallTimer: number | null = null

const row = Canvas.Width / CubeDistance
const column = Canvas.Height/ CubeDistance

class Main {
  isPending: boolean
  context: CanvasRenderingContext2D
  cube: null | BaseCube
  blocks: Array<Array<IBlock>> = (
    new Array(column).fill(null).map((rowNoop, columnIndex) => {
      return new Array(row).fill(null).map((colNoop, rowIndex) => {
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

  constructor(context: CanvasRenderingContext2D) {
    this.init(context)
  }

  init = (context: CanvasRenderingContext2D) => {
    this.context = context
    this.next()
  }

  draw = () => {
    this.context.clearRect(0, 0, Canvas.Width, Canvas.Height)
    this.blocks.forEach(row => {
      row.forEach(({ x, y, strokeColor, fillColor, state }) => {
        let _x, _y, _strokeColor, _fillColor
        if(state === BlockState.Filled) {
          _x = x * CubeDistance
          _y = y * CubeDistance
          _strokeColor = strokeColor
          _fillColor = fillColor
        }else if(
          x === this.cube.coordinate.x &&
          y === this.cube.coordinate.y                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
        ) {
          _x = this.cube.coordinate.x * CubeDistance
          _y = this.cube.coordinate.y * CubeDistance
          _strokeColor = this.cube.strokeColor
          _fillColor = this.cube.fillColor
        }
        this.context.strokeStyle = strokeColor
        this.context.fillStyle = fillColor
        this.context.save()
        this.context.fillRect(_x, _y, CubeDistance - 1, CubeDistance - 1)
        this.context.strokeRect(_x, _y, CubeDistance, CubeDistance)
        this.context.restore()
      })
    })
  }

  createAutoFall() {
    fallTimer = window.setInterval(() => {
      this.moveCubeDown()
    }, 1000)
  }

  closeAutoFall() {
    !!fallTimer && window.clearInterval(fallTimer)
  }

  moveCubeLeft = () => {
    const isMoveSuccess = this.moveCube(Move.Left)
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
  
  moveCubeRight = () => {
    const isMoveSuccess = this.moveCube(Move.Right)
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

  moveCubeDown = () => {
    const isMoveSuccess = this.moveCube(Move.Down)
    if(!isMoveSuccess) { 
      if(!this.isPending) {
        this.isPending = true
        // create timer
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
    const cubeInfo = this.cube.getInfo()
    cubeInfo.forEach(({ x, y, strokeColor, fillColor }) => {
      const row = this.blocks[y]
      const index = row.findIndex(({ x: _x }) => _x === x)
      if(index > -1) {
        row[index] = { x, y, strokeColor, fillColor, state: BlockState.Filled }
      }
    })
    this.blocks.forEach(row => {
      const isFilled = row.every(({ state }) => state === BlockState.Filled)
      if(isFilled) {
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
      this.cube = null
      this.blocks.forEach((row, rowIndex) => {
        const lastRow = this.blocks[rowIndex - 1]
        const isUnFilled = row.every(({ state }) => state === BlockState.Unfilled)
        if(isUnFilled && !!lastRow) {
          row.forEach((cube, index) => {
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
    // this.cube.createCube()
    this.createAutoFall()
  }

  checkCollide = (cubeCoordinateInfo: ICubeCoordinateInfo): ICubeMove<boolean> => {
    const status: ICubeMove<boolean> = { left: false, right: false, bottom: false }
    const range = (() => {
      let start = 0, end = 0
      cubeCoordinateInfo.forEach(coordinate => {
        if(coordinate.y < start) start = coordinate.y
        if(coordinate.y > end) end = coordinate.y
      })
      return { start, end }
    })()
    const blocks = this.blocks.slice(range.start, range.end + 1).reduce((acc, row) => [...acc, ...row], [])
    const nearbyCoordinateInfo: Array<ICubeMove<ICubeCoordinate>> = cubeCoordinateInfo.reduce((acc, coordinate) => {
        const _x = coordinate.x * CubeDistance, _y = coordinate.y * CubeDistance
        return [...acc, {
          left: {x: _x - CubeDistance, y: _y },
          right:{ x: _x + CubeDistance, y: _y },
          bottom: { x: _x, y: _y + CubeDistance }
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

  moveCube = (direction: Move) => {
    let isMoveSuccess = false, _x = 0, _y = 0
    const { 
      left: isLeftCollide, right: isRightCollide, bottom: isBottomCollide 
    } = this.checkCollide(this.cube.cubeCoordinateInfo);    
    ({
     [Move.Left]: () => {
       _x = isLeftCollide ? CubeDistance * -1 : 0
       isMoveSuccess = isLeftCollide
     },
     [Move.Right]: () => {
       _x = isRightCollide ? CubeDistance * -1 : 0
       isMoveSuccess = isRightCollide
     },
     [Move.Down]: () => {
      _y = isBottomCollide ? 0 : CubeDistance
      isMoveSuccess = isBottomCollide
     }
    })[direction]()
    if(isMoveSuccess) {
      this.cube.updateCoordinate({ x: _x, y: _y })
      this.draw()
    } 
  
    return isMoveSuccess
  }
}