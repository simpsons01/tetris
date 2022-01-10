import { IPolyominoBlock, IBlock } from './../../types'
import { BlockState, BlcokDistance, Direction } from '../../enum'
import { BaseCanvas } from '../base'
import { BasePolyomino } from '../polyomino'

export class TetrisView extends BaseCanvas {
  draw(data: Array<Array<IBlock>>, polyominoInfo: Array<IPolyominoBlock> | null) {
    this.context.clearRect(0, 0, this.width, this.height)
    this.context.fillStyle = '#292929'
    this.context.fillRect(0, 0, this.width, this.height)
    data.forEach((row) => {
      row.forEach(({ x, y, strokeColor, fillColor, state }) => {
        let _strokeColor, _fillColor, polyominoBlock
        if (!!polyominoInfo) {
          polyominoBlock = polyominoInfo.find((polyominoBlock) => {
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

  centerTopPolyomino() {
    this.emit('centerTopPolyomino')
  }

  changePolyominoShape() {
    const [isChangeShapeSucess] = this.emit('changePolyominoShape')
    return isChangeShapeSucess as boolean
  }

  movePolyomino(direction: Direction) {
    const [isMoveSuccess] = this.emit('movePolyomino', direction)
    return isMoveSuccess as boolean
  }

  nextPolyomino(polyomino: BasePolyomino) {
    this.emit('nextPolyomino', polyomino)
  }

  setPolyominoInfoToData() {
    this.emit('setPolyominoInfoToData')
  }

  checkPolyominoCollide() {
    const [collideStatus] = this.emit('checkPolyominoCollide')
    return {
      isBottomCollide: collideStatus.bottom,
      isTopCollide: collideStatus.top,
      isLeftCollide: collideStatus.left,
      isRightCollide: collideStatus.right
    }
  }

  checkFilledRow() {
    const [filledRow] = this.emit('checkFilledRow')
    return filledRow as Array<number>
  }

  async clearFilledRow() {
    await this.emitAsync('clearFilledRow')
  }

  async fillEmptyRow() {
    await this.emitAsync('fillEmptyRow')
  }
}
