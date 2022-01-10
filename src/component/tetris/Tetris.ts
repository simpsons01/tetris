import { ICoordinate } from './../../types'
import { BasePolyomino } from '../polyomino'
import { BlockState, BlcokDistance, Direction, PolyominoShape } from '../../enum'
import { IBlock, IPolyominoCoordinate, IDirection, IBaseCanvas } from '../../types'
import { getKeys, useInterval } from '../../util'
import { BaseCanvas } from '../base'
export class Tetris extends BaseCanvas {
  isPending: boolean
  context: CanvasRenderingContext2D
  polyomino: null | BasePolyomino
  data: Array<Array<IBlock>> = new Array(this._column).fill(null).map((rowNull, columnIndex) => {
    return new Array(this._row).fill(null).map((colNull, rowIndex) => {
      return {
        x: rowIndex,
        y: columnIndex,
        strokeColor: '',
        fillColor: '',
        state: BlockState.Unfilled
      }
    })
  })

  get _row() {
    return this.width / BlcokDistance
  }

  get _column() {
    return this.height / BlcokDistance
  }

  findBlock(coodrinate: ICoordinate) {
    let block = null
    try {
      block = this.data[coodrinate.y][coodrinate.x]
    } catch (error) {
      console.warn(error)
    }
    return block
  }

  getFilledRowInedxList() {
    return this.data.reduce((acc: Array<number>, row, index) => {
      const isAllFilled = row.every(({ state }) => state === BlockState.Filled)
      if (isAllFilled) acc.push(index)
      return acc
    }, [])
  }

  centerTopPolyomino() {
    const {
      range: { minX, maxX, minY },
      anchor: { y: anchorY }
    } = this.polyomino
    this.polyomino.updateCoordinate({
      x: Math.ceil((this._row - (maxX - minX + 1)) / 2) - minX,
      y: anchorY - minY
    })
    this.draw()
  }

  setPolyomino(polyomino: BasePolyomino) {
    if (!this.polyomino) {
      this.polyomino = polyomino
    }
  }

  resetPolyomino() {
    this.polyomino = null
  }

  draw() {
    this.context.clearRect(0, 0, this.width, this.height)
    this.context.fillStyle = '#292929'
    this.context.fillRect(0, 0, this.width, this.height)
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

  clearFilledRow() {
    let resetOrderIndex = 0
    const resetOrder = [
      [4, 5],
      [3, 6],
      [2, 7],
      [1, 8],
      [0, 9]
    ]
    const filledRowInedxList = this.getFilledRowInedxList()
    return new Promise((resolve) => {
      useInterval(
        () => {
          filledRowInedxList.forEach((rowIndex) => {
            resetOrder[resetOrderIndex].forEach((unFilledIndex) => {
              this.data[rowIndex][unFilledIndex].state = BlockState.Unfilled
              this.data[rowIndex][unFilledIndex].strokeColor = ''
              this.data[rowIndex][unFilledIndex].fillColor = ''
            })
          })
          this.draw()
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
        const executeTimes = 10
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

  changePolyominoShape() {
    let isNextShapeCollide = true,
      isShapeCanChange = true
    if (this.polyomino) {
      const shape = Object.values(PolyominoShape)
      const shapeIndex = shape.indexOf(this.polyomino.shape)
      const nextShape = shape[(shapeIndex + 1) % shape.length]
      const nextCoordinate = this.polyomino.getCoodinate(nextShape)
      const nextAnchor = nextCoordinate[this.polyomino.coordinateConfig[nextShape].anchorIndex]
      const collideCoordinate = nextCoordinate.reduce((acc, coordinate) => {
        const isCoolideWithBorder =
          coordinate.y < 0 || coordinate.y >= this._column || coordinate.x < 0 || coordinate.x >= this._row
        const isCollideWithFilledBlocked = (this.findBlock(coordinate) || {}).state === BlockState.Filled
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
          this.polyomino.updateCoordinate({
            x: this.polyomino.anchor.x + _x,
            y: this.polyomino.anchor.y + _y
          })
          return this.changePolyominoShape.call(this)
        } else {
          this.polyomino.changeShape(nextShape)
          this.draw()
        }
      }
      return isShapeCanChange
    }
  }

  syncPolyominoInfoToData() {
    const polyominoBlockInfo = this.polyomino.getInfo()
    polyominoBlockInfo.forEach(({ x, y, strokeColor, fillColor }) => {
      const block = this.findBlock({ x, y })
      if (block) {
        block.strokeColor = strokeColor
        block.fillColor = fillColor
        block.state = BlockState.Filled
      }
    })
  }

  getPolyominoCollideStatus(polyominoCoordinate?: IPolyominoCoordinate['coordinate']): IDirection<boolean> {
    const _coordinate = polyominoCoordinate ? polyominoCoordinate : this.polyomino.coordinate
    const status: IDirection<boolean> = { left: false, right: false, bottom: false, top: false }
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
          (direction === 'bottom' && naerByBlock.y >= this._column) ||
          (direction === 'left' && naerByBlock.x < 0) ||
          (direction === 'right' && naerByBlock.x >= this._row)
        ) {
          status[direction] = true
        }
        if (!status[direction]) {
          const block = this.findBlock({ x: naerByBlock.x, y: naerByBlock.y })
          if (!!block && block.state === BlockState.Filled) {
            status[direction] = true
          }
        }
      })
    })
    return status
  }

  movePolyomino(direction: Direction) {
    let isMoveSuccess = false,
      _x = 0,
      _y = 0
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
      this.polyomino.updateCoordinate({
        x: this.polyomino.anchor.x + _x,
        y: this.polyomino.anchor.y + _y
      })
      this.draw()
    }
    return isMoveSuccess
  }
}
