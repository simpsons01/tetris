import { BasePolyomino, PolyominoFactory } from '../polyomino'
import { BlockState, Canvas, BlcokDistance, Direction, PolyominoShape } from '../../enum'
import { IBlock, ICoordinate, IPolyominoCoordinate, IDirection } from '../../types'
import { getKeys, useInterval } from '../../util'

let nextTimer: number | null = null,
  nextRoundCountDownTimer: number | null = null,
  fallTimer: number | null = null

const rowNum = Canvas.Width / BlcokDistance
const columnNum = Canvas.Height / BlcokDistance

export class Tetris {
  isPending: boolean
  polyominoFactory: PolyominoFactory
  context: CanvasRenderingContext2D
  polyomino: null | BasePolyomino
  data: Array<Array<IBlock>> = new Array(columnNum).fill(null).map((rowNull, columnIndex) => {
    return new Array(rowNum).fill(null).map((colNull, rowIndex) => {
      return {
        x: rowIndex,
        y: columnIndex,
        strokeColor: '',
        fillColor: '',
        state: BlockState.Unfilled
      }
    })
  })

  constructor() {
    this.init()
  }

  init = () => {
    const canvas = document.querySelector('canvas')
    if (!canvas) {
      throw new Error('canvas is not exist!')
    } else {
      this.polyominoFactory = new PolyominoFactory()
      this.context = canvas.getContext('2d')
    }
  }

  startAutoFall = () => {
    if (!fallTimer) {
      fallTimer = window.setInterval(() => {
        this.movePolyominoDown()
        this.draw()
      }, 700)
    }
  }

  closeAutoFall = () => {
    if (fallTimer) {
      window.clearInterval(fallTimer)
      fallTimer = null
    }
  }

  startNextRoundCountDownTimer = () => {
    if (!nextRoundCountDownTimer) {
      nextRoundCountDownTimer = window.setTimeout(() => {
        this.closeNextRoundTimer()
        this.beforeNext().then(() => {
          nextRoundCountDownTimer = null
          this.next()
        })
      }, 900)
    }
  }

  closeNextRoundCountDownTimer = () => {
    if (nextRoundCountDownTimer) {
      window.clearTimeout(nextRoundCountDownTimer)
      nextRoundCountDownTimer = null
    }
  }

  startNextRoundTimer = () => {
    this.closeNextRoundTimer()
    nextTimer = window.setTimeout(() => {
      this.closeNextRoundCountDownTimer()
      this.beforeNext().then(() => {
        nextTimer = null
        this.next()
      })
    }, 600)
  }

  closeNextRoundTimer = () => {
    if (nextTimer) {
      window.clearTimeout(nextTimer)
      nextTimer = null
    }
  }

  createPolyomino = () => {
    if (!this.polyomino) {
      this.polyomino = this.polyominoFactory.create()
      const {
        range: { minX, maxX, minY },
        anchor: { y: anchorY }
      } = this.polyomino
      this.polyomino.updateCoordinate({
        x: Math.ceil((rowNum - (maxX - minX + 1)) / 2) - minX,
        y: anchorY - minY
      })
      this.draw()
    }
  }

  resetPolyomino = () => {
    this.polyomino = null
  }

  draw = () => {
    this.context.clearRect(0, 0, Canvas.Width, Canvas.Height)
    const polyominoBlockInfo = !this.polyomino ? null : this.polyomino.getInfo()
    this.data.forEach((row) => {
      row.forEach(({ x, y, strokeColor, fillColor, state }) => {
        let _strokeColor, _fillColor, polyominoBlock
        if (!!polyominoBlockInfo) {
          polyominoBlock = polyominoBlockInfo.find((polyominoBlock) => {
            return polyominoBlock.x === x && polyominoBlock.y === y
          })
        }
        if (!!polyominoBlock) {
          _strokeColor = polyominoBlock.strokeColor
          _fillColor = polyominoBlock.fillColor
        } else if (state === BlockState.Filled) {
          _strokeColor = strokeColor
          _fillColor = fillColor
        }
        if (_strokeColor && _fillColor) {
          this.context.strokeStyle = _strokeColor
          this.context.fillStyle = _fillColor
          this.context.save()
          this.context.fillRect(x * BlcokDistance, y * BlcokDistance, BlcokDistance - 2, BlcokDistance - 2)
          this.context.strokeRect(x * BlcokDistance, y * BlcokDistance, BlcokDistance, BlcokDistance)
          this.context.restore()
        }
      })
    })
  }

  clearFilledRow = () => {
    let orderIndex = 0
    const order = [
      [4, 5],
      [3, 6],
      [2, 7],
      [1, 8],
      [0, 9]
    ]
    const filledRowInedxList = this.data.reduce((acc: Array<number>, row, index) => {
      const isAllFilled = row.every(({ state }) => state === BlockState.Filled)
      if (isAllFilled) acc.push(index)
      return acc
    }, [])
    return new Promise((resolve) => {
      useInterval(
        () => {
          filledRowInedxList.forEach((rowIndex) => {
            order[orderIndex].forEach((unFilledIndex) => {
              this.data[rowIndex][unFilledIndex].state = BlockState.Unfilled
              this.data[rowIndex][unFilledIndex].strokeColor = ''
              this.data[rowIndex][unFilledIndex].fillColor = ''
            })
          })
          this.draw()
          orderIndex += 1
        },
        50,
        order.length,
        true
      ).then(() => {
        // @ts-ignore
        resolve()
      })
    })
  }

  fillEmptyRow = () => {
    return new Promise((resolve) => {
      const data = (() => {
        let current = 0,
          ary: Array<{ unFilled: Array<number>; notAllFilled: Array<number> }> = []
        for (let i = this.data.length - 1; i >= 0; i--) {
          const isRowUnFilled = this.data[i].every(({ state }) => state === BlockState.Unfilled)
          const isLasRowUnFilled = (this.data[i + 1] || []).every(({ state }) => state === BlockState.Unfilled)
          if (!!this.data[i + 1] && !isLasRowUnFilled && isRowUnFilled) {
            current += 1
          }
          if (!ary[current]) {
            ary[current] = { unFilled: [], notAllFilled: [] }
          }
          const field = isRowUnFilled ? 'unFilled' : 'notAllFilled'
          ary[current][field].push(i)
        }
        return ary
      })()
      if (
        data.length === 2 &&
        data[0].unFilled.length === 0 &&
        Math.min(...data[0].notAllFilled) - 1 === Math.max(...data[1].unFilled)
      ) {
        //@ts-ignore
        resolve()
      } else {
        const executeTimes = 4
        resolve(
          useInterval(
            (count: number) => {
              data.forEach(({ unFilled, notAllFilled }) => {
                const from = Math.max(...notAllFilled)
                const to = Math.max(...unFilled)
                const distance = to - from
                if (notAllFilled.length > 0 && unFilled.length > 0) {
                  notAllFilled.forEach((rowIndex) => {
                    this.data[rowIndex].forEach((block) => (block.y = block.y + distance / executeTimes))
                  })
                  if (count == executeTimes) {
                    notAllFilled.forEach((rowIndex) => {
                      this.data[rowIndex + distance].forEach((block, blockIndex) => {
                        block.fillColor = this.data[rowIndex][blockIndex].fillColor
                        block.strokeColor = this.data[rowIndex][blockIndex].strokeColor
                        block.state = this.data[rowIndex][blockIndex].state
                      })
                      this.data[rowIndex].forEach((block) => {
                        block.y = rowIndex
                        block.fillColor = ''
                        block.strokeColor = ''
                        block.state = BlockState.Unfilled
                      })
                    })
                  }
                }
              })
              this.draw()
            },
            50,
            executeTimes,
            true
          ).then(() => {
            this.fillEmptyRow()
          })
        )
      }
    })
  }

  movePolyominoLeft = () => {
    let isMoveSuccess = false
    if (this.polyomino) {
      isMoveSuccess = this.movePolyomino(Direction.Left)
      if (isMoveSuccess) {
        this.closeNextRoundCountDownTimer()
        const { bottom: isBottomCollide } = this.checkPolyominoCollide(this.polyomino.coordinate)
        if (!isBottomCollide) {
          this.closeNextRoundTimer()
        }
      } else {
        if (this.isPending) {
          this.startNextRoundTimer()
        }
      }
    }
    return isMoveSuccess
  }

  movePolyominoRight = () => {
    let isMoveSuccess = false
    if (this.polyomino) {
      isMoveSuccess = this.movePolyomino(Direction.Right)
      if (isMoveSuccess) {
        this.closeNextRoundCountDownTimer()
        const { bottom: isBottomCollide } = this.checkPolyominoCollide(this.polyomino.coordinate)
        if (!isBottomCollide) {
          this.closeNextRoundTimer()
        }
      } else {
        if (this.isPending) {
          this.startNextRoundTimer()
        }
      }
    }
    return isMoveSuccess
  }

  movePolyominoDown = () => {
    let isMoveSuccess = false
    if (this.polyomino) {
      isMoveSuccess = this.movePolyomino(Direction.Down)
      if (isMoveSuccess) {
        const { bottom: isBottomCollide } = this.checkPolyominoCollide(this.polyomino.coordinate)
        if (isBottomCollide) {
          this.closeAutoFall()
          this.startNextRoundTimer()
          this.startNextRoundCountDownTimer()
          if (!this.isPending) {
            this.isPending = false
          }
        }
      }
    }
    return isMoveSuccess
  }

  beforeNext = () => {
    return new Promise((resolve) => {
      const polyominoBlockInfo = this.polyomino.getInfo()
      this.resetPolyomino()
      polyominoBlockInfo.forEach(({ x, y, strokeColor, fillColor }) => {
        const row = this.data[y]
        const index = row.findIndex(({ x: _x }) => _x === x)
        if (index > -1) {
          row[index].strokeColor = strokeColor
          row[index].fillColor = fillColor
          row[index].state = BlockState.Filled
        }
      })
      const filledRowInedxList = this.data.reduce((acc: Array<number>, row, index) => {
        const isAllFilled = row.every(({ state }) => state === BlockState.Filled)
        if (isAllFilled) acc.push(index)
        return acc
      }, [])
      if (filledRowInedxList.length > 0) {
        this.clearFilledRow()
          .then(() => {
            return this.fillEmptyRow()
          })
          .then(() => {
            // @ts-ignore
            resolve()
          })
      } else {
        // @ts-ignore
        resolve()
      }
    })
  }

  next = () => {
    this.createPolyomino()
    this.startAutoFall()
  }

  changePolyominoShape = () => {
    if (this.polyomino) {
      const shape = Object.values(PolyominoShape)
      const shapeIndex = shape.indexOf(this.polyomino.shape)
      const nextShapeIndex = (shapeIndex + 1) % shape.length
      this.polyomino.changeShape(shape[nextShapeIndex])
      this.draw()
    }
  }

  checkPolyominoCollide = (polyominoCoordinate: IPolyominoCoordinate['coordinate']): IDirection<boolean> => {
    const status: IDirection<boolean> = { left: false, right: false, bottom: false }
    const nearbyBlockCoordinate: Array<IDirection<ICoordinate>> = polyominoCoordinate.reduce((acc, coordinate) => {
      const _x = coordinate.x,
        _y = coordinate.y
      return [
        ...acc,
        {
          left: { x: _x - 1, y: _y },
          right: { x: _x + 1, y: _y },
          bottom: { x: _x, y: _y + 1 }
        }
      ]
    }, [])
    nearbyBlockCoordinate.forEach((directionMap) => {
      getKeys(directionMap).forEach((direction) => {
        const naerByBlock = directionMap[direction]
        if (naerByBlock.y === columnNum || naerByBlock.x === rowNum || naerByBlock.x < 0) {
          status[direction] = true
        }
        if (!status[direction]) {
          const row = this.data[naerByBlock.y]
          if (!!row) {
            const block = row.find((block) => {
              return block.x === naerByBlock.x && block.y === naerByBlock.y
            })
            if (!!block && block.state === BlockState.Filled) {
              status[direction] = true
            }
          }
        }
      })
    })
    return status
  }

  movePolyomino = (direction: Direction) => {
    let isMoveSuccess = false,
      _x = 0,
      _y = 0
    const {
      left: isLeftCollide,
      right: isRightCollide,
      bottom: isBottomCollide
    } = this.checkPolyominoCollide(this.polyomino.coordinate)
    ;({
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
    }[direction]())
    if (isMoveSuccess) {
      this.polyomino.updateCoordinate({
        x: this.polyomino.anchor.x + _x,
        y: this.polyomino.anchor.y + _y
      })
      this.draw()
    }
    return isMoveSuccess
  }
}
