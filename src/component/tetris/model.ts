import { getKeys } from './../../util/utils'
import { BlockState } from './../../enum'
import { BasePolyomino } from '../../component/polyomino'
import { IBlock, ICoordinate } from '../../types'
import { EventEmitter } from '../../util/EventEmitter'

export class TetrisModel extends EventEmitter {
  row: number
  col: number
  data: Array<Array<IBlock>>

  constructor(row: number, col: number) {
    super()
    this.row = row
    this.col = col
    this.data = new Array(col).fill(null).map((rowNull, columnIndex) => {
      return new Array(row).fill(null).map((colNull, rowIndex) => {
        return {
          x: rowIndex,
          y: columnIndex,
          strokeColor: '',
          fillColor: '',
          state: BlockState.Unfilled
        }
      })
    })
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

  updateBlcok(newBlock: IBlock) {
    const { x, y } = newBlock
    const oldBlock = this.findBlock({ x, y })
    if (oldBlock) {
      this.data[y][x] = newBlock
      this.commit()
    }
  }

  updateRow(rowIndex: number, newBlock: Partial<IBlock>) {
    if (this.data[rowIndex]) {
      this.data[rowIndex] = this.data[rowIndex].map((block) => {
        return {
          ...block,
          ...newBlock
        }
      })
      this.commit()
    }
  }

  getFilledRowInedxList() {
    return this.data.reduce((acc: Array<number>, row, index) => {
      const isAllFilled = row.every(({ state }) => state === BlockState.Filled)
      if (isAllFilled) acc.push(index)
      return acc
    }, [])
  }

  getUnFilledRowInedxList() {
    return this.data.reduce((acc: Array<number>, row, index) => {
      const isAllFilled = row.every(({ state }) => state === BlockState.Unfilled)
      if (isAllFilled) acc.push(index)
      return acc
    }, [])
  }

  commit() {
    this.emit('change')
  }
}
