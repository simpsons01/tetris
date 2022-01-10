import { TetrisModel } from './model'
import { TetrisView } from './view'
import { IDirection, IPolyominoCoordinate, ICoordinate, IRender } from '../../types'
import { getKeys, useInterval } from '../../util'
import { BlockState, Direction, PolyominoShape } from '../../enum'
import { PolyominoModel } from './polyominoModel'
import { BasePolyomino } from '../polyomino'

export class TetrisController {
  polyominoModel: PolyominoModel
  tetrisModel: TetrisModel
  view: TetrisView

  constructor(polyominoModel: PolyominoModel, tetrisModel: TetrisModel, tetrisView: TetrisView) {
    this.polyominoModel = polyominoModel
    this.tetrisModel = tetrisModel
    this.view = tetrisView
    this.tetrisModel.on('change', () => {
      this.view.draw.call(this.view, this.tetrisModel.data, this.polyominoModel.info)
    })
    this.polyominoModel.on('change', () => {
      this.view.draw.call(this.view, this.tetrisModel.data, this.polyominoModel.info)
    })
    this.view.on('centerTopPolyomino', this.centerTopPolyomino.bind(this))
    this.view.on('changePolyominoShape', this.changePolyominoShape.bind(this))
    this.view.on('movePolyomino', this.movePolyomino.bind(this))
    this.view.on('nextPolyomino', this.nextPolyomino.bind(this))
    this.view.on('clearFilledRow', this.clearFilledRow.bind(this))
    this.view.on('fillEmptyRow', this.fillEmptyRow.bind(this))
    this.view.on('checkPolyominoCollide', this.getPolyominoCollideStatus.bind(this))
    this.view.on('setPolyominoInfoToData', this.setPolyominoInfoToData.bind(this))
    this.view.on('checkFilledRow', this.checkFilledRow.bind(this))
  }

  centerTopPolyomino() {
    if (!!this.polyominoModel.polyomino) {
      const { minX, maxX, minY } = this.polyominoModel.getRange() as {
        minX: number
        maxX: number
        minY: number
        maxY: number
      }
      const { y: anchorY } = this.polyominoModel.anchor as ICoordinate
      this.polyominoModel.updateCoordinate({
        x: Math.ceil((this.tetrisModel.row - (maxX - minX + 1)) / 2) - minX,
        y: anchorY - minY
      })
    }
  }

  changePolyominoShape() {
    let isNextShapeCollide = true,
      isShapeCanChange = true
    if (!this.polyominoModel.isNil) {
      const shape = Object.values(PolyominoShape)
      const shapeIndex = shape.indexOf(this.polyominoModel.shape as PolyominoShape)
      const nextShape = shape[(shapeIndex + 1) % shape.length]
      const nextCoordinate = this.polyominoModel.calcCoordinateByShape(nextShape) as IPolyominoCoordinate['coordinate']
      const nextAnchor = this.polyominoModel.calcAnchorByCoordinate(nextCoordinate) as ICoordinate
      const collideCoordinate = nextCoordinate.reduce((acc: Array<ICoordinate>, coordinate) => {
        const isCoolideWithBorder =
          coordinate.y < 0 ||
          coordinate.y >= this.tetrisModel.col ||
          coordinate.x < 0 ||
          coordinate.x >= this.tetrisModel.row
        const isCollideWithFilledBlocked = (this.tetrisModel.findBlock(coordinate) || {}).state === BlockState.Filled
        if (isCollideWithFilledBlocked || isCoolideWithBorder) acc.push(coordinate)
        return acc
      }, [])
      let leftCollide = false,
        rightCollide = false,
        bottomCollide = false,
        topCollide = false
      collideCoordinate.forEach((coordinate) => {
        if (coordinate.x == nextAnchor.x) {
          leftCollide = true
          rightCollide = true
        } else if (coordinate.x > nextAnchor.x) {
          rightCollide = true
        } else if (coordinate.x < nextAnchor.x) {
          leftCollide = true
        }
        if (coordinate.y == nextAnchor.y) {
          bottomCollide = true
          topCollide = true
        } else if (coordinate.y > nextAnchor.y) {
          bottomCollide = true
        } else if (coordinate.y < nextAnchor.y) {
          topCollide = true
        }
      })
      if (!topCollide && !leftCollide && !rightCollide && !bottomCollide) {
        isNextShapeCollide = false
      }
      if ((leftCollide && rightCollide) || (topCollide && bottomCollide)) {
        isShapeCanChange = false
      }
      if (isShapeCanChange) {
        if (isNextShapeCollide) {
          let _x = 0,
            _y = 0
          if (topCollide) {
            _y += 1
          } else if (bottomCollide) {
            _y -= 1
          }
          if (rightCollide) {
            _x -= 1
          } else if (leftCollide) {
            _x += 1
          }
          this.polyominoModel.updateCoordinate({
            x: (this.polyominoModel.anchor as ICoordinate).x + _x,
            y: (this.polyominoModel.anchor as ICoordinate).y + _y
          })
          return this.changePolyominoShape.call(this)
        } else {
          this.polyominoModel.updateShape(nextShape)
        }
      }
    }
    return isShapeCanChange
  }

  getPolyominoCollideStatus(polyominoCoordinate?: IPolyominoCoordinate['coordinate']): IDirection<boolean> {
    const status: IDirection<boolean> = { left: false, right: false, bottom: false, top: false }
    if (!this.polyominoModel.isNil) {
      const _coordinate = polyominoCoordinate
        ? polyominoCoordinate
        : (this.polyominoModel.coordinate as IPolyominoCoordinate['coordinate'])
      const nearbyBlockCoordinate: Array<IDirection<ICoordinate>> = _coordinate.reduce((acc, coordinate) => {
        const _x = coordinate.x,
          _y = coordinate.y
        return [
          ...acc,
          {
            left: { x: _x - 1, y: _y },
            right: { x: _x + 1, y: _y },
            bottom: { x: _x, y: _y + 1 },
            top: { x: _x, y: _y - 1 }
          }
        ]
      }, [])
      nearbyBlockCoordinate.forEach((directionMap) => {
        getKeys(directionMap).forEach((direction) => {
          const naerByBlock = directionMap[direction]
          if (
            (direction === 'top' && naerByBlock.y < 0) ||
            (direction === 'bottom' && naerByBlock.y >= this.tetrisModel.col) ||
            (direction === 'left' && naerByBlock.x < 0) ||
            (direction === 'right' && naerByBlock.x >= this.tetrisModel.row)
          ) {
            status[direction] = true
          }
          if (!status[direction]) {
            const block = this.tetrisModel.findBlock({ x: naerByBlock.x, y: naerByBlock.y })
            if (!!block && block.state === BlockState.Filled) {
              status[direction] = true
            }
          }
        })
      })
    }
    return status
  }

  movePolyomino(direction: Direction) {
    let isMoveSuccess = false,
      _x = 0,
      _y = 0
    if (!this.polyominoModel.isNil) {
      const { left: isLeftCollide, right: isRightCollide, bottom: isBottomCollide } = this.getPolyominoCollideStatus()
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
        this.polyominoModel.updateCoordinate({
          x: (this.polyominoModel.anchor as ICoordinate).x + _x,
          y: (this.polyominoModel.anchor as ICoordinate).y + _y
        })
      }
    }
    return isMoveSuccess
  }

  clearFilledRow() {
    let resetOrderIndex = 0
    const resetOrder = [
      [4, 5],
      [3, 6],
      [2, 7],
      [1, 8],
      [0, 9]
    ]
    const filledRowInedxList = this.tetrisModel.getFilledRowInedxList()
    return new Promise((resolve) => {
      useInterval(
        () => {
          filledRowInedxList.forEach((rowIndex) => {
            resetOrder[resetOrderIndex].forEach((unFilledIndex) => {
              this.tetrisModel.updateBlcok({
                x: unFilledIndex,
                y: rowIndex,
                state: BlockState.Unfilled,
                strokeColor: '',
                fillColor: ''
              })
            })
          })
          resetOrderIndex += 1
        },
        50,
        resetOrder.length,
        true
      ).then(() => {
        // @ts-ignore
        resolve()
      })
    })
  }

  fillEmptyRow() {
    return new Promise((resolve) => {
      const data = (() => {
        let current = 0,
          ary: Array<{ unFilled: Array<number>; notAllFilled: Array<number> }> = []
        for (let i = this.tetrisModel.data.length - 1; i >= 0; i--) {
          const isRowUnFilled = this.tetrisModel.data[i].every(({ state }) => state === BlockState.Unfilled)
          const isLasRowUnFilled = (this.tetrisModel.data[i + 1] || []).every(
            ({ state }) => state === BlockState.Unfilled
          )
          if (!!this.tetrisModel.data[i + 1] && !isLasRowUnFilled && isRowUnFilled) {
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
        const executeTimes = 10
        resolve(
          useInterval(
            (count: number) => {
              data.forEach(({ unFilled, notAllFilled }) => {
                const from = Math.max(...notAllFilled)
                const to = Math.max(...unFilled)
                const distance = to - from
                if (notAllFilled.length > 0 && unFilled.length > 0) {
                  notAllFilled.forEach((row) => {
                    this.tetrisModel.updateRow(row, {
                      y: this.tetrisModel.data[row][0].y + distance / executeTimes
                    })
                  })
                  if (count == executeTimes) {
                    notAllFilled.forEach((rowIndex) => {
                      this.tetrisModel.data[rowIndex + distance].forEach((block, blockIndex) => {
                        const lastRow = this.tetrisModel.data[rowIndex]
                        this.tetrisModel.updateBlcok({
                          ...lastRow[blockIndex],
                          x: block.x,
                          y: block.y
                        })
                      })
                      this.tetrisModel.data[rowIndex].forEach((block, blockIndex) => {
                        this.tetrisModel.updateBlcok({
                          ...block,
                          y: rowIndex,
                          fillColor: '',
                          strokeColor: '',
                          state: BlockState.Unfilled
                        })
                      })
                    })
                  }
                }
              })
            },
            16.66666666,
            executeTimes,
            true
          ).then(() => {
            this.fillEmptyRow()
          })
        )
      }
    })
  }

  nextPolyomino(polyomino: BasePolyomino) {
    this.polyominoModel.set(polyomino)
    this.centerTopPolyomino()
  }

  setPolyominoInfoToData() {
    if (!this.polyominoModel.isNil) {
      ;(this.polyominoModel.info as Array<IRender & ICoordinate>).forEach(({ strokeColor, fillColor, x, y }) => {
        this.tetrisModel.updateBlcok({
          x,
          y,
          strokeColor,
          fillColor,
          state: BlockState.Filled
        })
      })
      this.polyominoModel.reset()
    }
  }

  checkFilledRow() {
    const filledRowIndexList = this.tetrisModel.getFilledRowInedxList()
    return filledRowIndexList
  }
}
