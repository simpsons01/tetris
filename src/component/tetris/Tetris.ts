import { ICoordinate, IRender } from './../../types'
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
    const previewBlockInfo = this.getPreviewPolyominoCollide()
    this.data.forEach((row) => {
      row.forEach(({ x, y, strokeColor, fillColor, state }) => {
        let _strokeColor, _fillColor, polyominoBlock, previewPolyominoBlock
        if (!!polyominoBlockInfo) {
          polyominoBlock = polyominoBlockInfo.find((polyominoBlock) => {
            return polyominoBlock.x === x && polyominoBlock.y === y
          })
        }
        if (!!previewBlockInfo) {
          previewPolyominoBlock = previewBlockInfo.find((polyominoBlock) => {
            return polyominoBlock.x === x && polyominoBlock.y === y
          })
        }
        if (!!polyominoBlock) {
          _strokeColor = polyominoBlock.strokeColor
          _fillColor = polyominoBlock.fillColor
        } else if (!!previewPolyominoBlock) {
          _strokeColor = previewPolyominoBlock.strokeColor
          _fillColor = previewPolyominoBlock.fillColor
        } else if (state === BlockState.Filled) {
          _strokeColor = strokeColor
          _fillColor = fillColor
        }
        if (_strokeColor && _fillColor) {
          this.context.strokeStyle = _strokeColor
          this.context.fillStyle = _fillColor
          this.context.save()
          if (!!previewPolyominoBlock && !polyominoBlock) {
            this.context.globalAlpha = 0.2
          } else {
            this.context.globalAlpha = 1
          }
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
          filledRowInedxList.forEach((colIndex) => {
            resetOrder[resetOrderIndex].forEach((unFilledIndex) => {
              this.data[colIndex][unFilledIndex].state = BlockState.Unfilled
              this.data[colIndex][unFilledIndex].strokeColor = ''
              this.data[colIndex][unFilledIndex].fillColor = ''
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
                  notAllFilled.forEach((colIndex) => {
                    this.data[colIndex].forEach((block) => (block.y = block.y + distance / executeTimes))
                  })
                  if (count == executeTimes) {
                    notAllFilled.forEach((colIndex) => {
                      this.data[colIndex + distance].forEach((block, blockIndex) => {
                        block.fillColor = this.data[colIndex][blockIndex].fillColor
                        block.strokeColor = this.data[colIndex][blockIndex].strokeColor
                        block.state = this.data[colIndex][blockIndex].state
                      })
                      this.data[colIndex].forEach((block) => {
                        block.y = colIndex
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
      const nextCoordinate = this.polyomino.calcCoodinateByShape(nextShape)
      const nextAnchor = nextCoordinate[this.polyomino.coordinateConfig[nextShape].anchorIndex]
      let leftBorderCollide = false,
        rightBorderCollide = false,
        bottomBorderCollide = false,
        topBorderCollide = false,
        leftBlockCollide = false,
        rightBlockCollide = false,
        bottomBlockCollide = false,
        topBlockCollide = false
      nextCoordinate.forEach((coordinate) => {
        if (coordinate.y < 0) {
          topBorderCollide = true
        } else if (coordinate.y >= this._column) {
          bottomBorderCollide = true
        } else if (coordinate.x < 0) {
          leftBorderCollide = true
        } else if (coordinate.x >= this._row) {
          rightBorderCollide = true
        }
      }, [])
      nextCoordinate.forEach((coordinate) => {
        const isCollideWithFilledBlocked = (this.findBlock(coordinate) || {}).state === BlockState.Filled
        if (isCollideWithFilledBlocked) {
          if (coordinate.x == nextAnchor.x) {
            rightBlockCollide = true
            leftBlockCollide = true
          } else if (coordinate.x > nextAnchor.x) {
            rightBlockCollide = true
          } else if (coordinate.x < nextAnchor.x) {
            leftBlockCollide = true
          }
          if (coordinate.y == nextAnchor.y) {
            bottomBlockCollide = true
            topBlockCollide = true
          } else if (coordinate.y > nextAnchor.y) {
            bottomBlockCollide = true
          } else if (coordinate.y < nextAnchor.y) {
            topBlockCollide = true
          }
        }
      })
      if (
        !topBorderCollide &&
        !leftBorderCollide &&
        !rightBorderCollide &&
        !bottomBorderCollide &&
        !topBlockCollide &&
        !leftBlockCollide &&
        !rightBlockCollide &&
        !bottomBlockCollide
      ) {
        isNextShapeCollide = false
      }
      if (
        (leftBlockCollide && rightBlockCollide && (topBlockCollide || topBorderCollide)) ||
        (leftBorderCollide && rightBlockCollide && (topBlockCollide || topBorderCollide)) ||
        (leftBlockCollide && rightBorderCollide && (topBlockCollide || topBorderCollide)) ||
        (bottomBlockCollide &&
          topBlockCollide &&
          (leftBlockCollide || leftBorderCollide) &&
          (rightBorderCollide || rightBlockCollide)) ||
        (bottomBlockCollide &&
          topBorderCollide &&
          (leftBlockCollide || leftBorderCollide) &&
          (rightBorderCollide || rightBlockCollide)) ||
        (topBorderCollide &&
          bottomBlockCollide &&
          (leftBlockCollide || leftBorderCollide) &&
          (rightBorderCollide || rightBlockCollide))
      ) {
        isShapeCanChange = false
      }
      if (isShapeCanChange) {
        if (isNextShapeCollide) {
          let _x = 0,
            _y = 0
          if (topBorderCollide || topBlockCollide) {
            _y += 1
          } else if (bottomBlockCollide || bottomBorderCollide) {
            _y -= 1
          }
          if (rightBlockCollide || rightBorderCollide) {
            _x -= 1
          } else if (leftBlockCollide || leftBorderCollide) {
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
    }
    return isShapeCanChange
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

  getPreviewPolyominoCollide() {
    let info = null
    if (this.polyomino) {
      const minY = this.polyomino.coordinate.reduce((acc, coordinate) => {
        let y = this._column - 1,
          isColAllFilled = false
        for (let column = 0; column < coordinate.y; column++) {
          console.log(coordinate.y)
          if ((this.findBlock({ y: column, x: coordinate.x }) || {}).state === BlockState.Filled && y > column) {
            y = column
            isColAllFilled = true
          }
        }
        if (isColAllFilled) y -= 1
        if (acc > y) acc = y
        return acc
      }, this._column - 1)
      info = this.polyomino
        .calcCoodinateByAnchor({
          x: this.polyomino.anchor.x,
          y: (() => {
            const { coordinateConfig, shape } = this.polyomino
            const maxY = Math.max(...coordinateConfig[shape].coordinate.map(({ y }) => y))
            const anchor = coordinateConfig[shape].coordinate[coordinateConfig[shape].anchorIndex]
            const y = minY - (maxY - anchor.y)
            return y
          })()
        })
        .map((coordinate) => {
          const { strokeColor, fillColor } = this.polyomino
          return { ...coordinate, strokeColor, fillColor }
        })
    }
    return info
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
