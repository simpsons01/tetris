import { BasePolyomino, PolyominoFactory } from '../polyomino'
import { BaseCanvas } from '../base'
import { IBaseCanvas } from '../../types'
import { BlcokDistance } from '../../enum'

export class LineUp extends BaseCanvas {
  static types = ['I', 'J', 'L', 'O', 'S', 'T', 'Z']
  static lineLimit: number = 3

  polyominoFactory: PolyominoFactory
  list: Array<{ polyomino: null | BasePolyomino; type: null | string }> = new Array(LineUp.lineLimit)
    .fill(null)
    .map(() => ({
      polyomino: null,
      type: null
    }))

  constructor(config: Pick<IBaseCanvas, 'context' | 'width' | 'height'>) {
    super(config)
    this.polyominoFactory = new PolyominoFactory()
    this.init()
  }

  get first() {
    const firstItem = this.list.shift()
    return firstItem.polyomino
  }

  ramdomCreate() {
    const ramdom = 0 + Math.round(Math.random() * LineUp.types.length)
    const type = LineUp.types[ramdom]
    return { type, polyomino: this.polyominoFactory.create(type) }
  }

  init() {
    this.list.forEach((item, index) => {
      const { type, polyomino } = this.ramdomCreate()
      item.polyomino = polyomino
      item.type = type
    })
    this.draw()
  }

  next() {
    this.list.push(
      (() => {
        let type: null | string = null,
          polyomino: null | BasePolyomino = null
        while (!polyomino || this.list.findIndex(({ type: _type }) => _type === type) > -1) {
          const { type: _type, polyomino: _polyomino } = this.ramdomCreate()
          type = _type
          polyomino = _polyomino
        }
        return {
          type,
          polyomino
        }
      })()
    )
    this.draw()
  }

  draw() {
    this.context.clearRect(0, 0, this.width, this.height)
    this.context.fillStyle = '#292929'
    this.context.fillRect(0, 0, this.width, this.height)
    this.list.forEach(({ polyomino }, index) => {
      const {
        range: { minX, maxX, minY, maxY },
        anchor
      } = polyomino
      const width = (maxX - minX + 1) * BlcokDistance
      const height = (maxY - minY + 1) * BlcokDistance
      const averageHeight = this.height / LineUp.lineLimit
      const offsetX = (anchor.x - minX) * BlcokDistance
      const offsetY = (anchor.y - minY) * BlcokDistance
      const x = ((this.width - width) / 2 + offsetX) / BlcokDistance
      const y = ((averageHeight - height) / 2 + offsetY) / BlcokDistance
      const polyominoInfo = polyomino.calcInfo(polyomino.calcCoordinateByAnchorandShape({ x, y }, polyomino.shape))
      polyominoInfo.forEach(({ x, y, strokeColor, fillColor }) => {
        this.context.strokeStyle = strokeColor
        this.context.fillStyle = fillColor
        this.context.save()
        this.context.fillRect(
          x * BlcokDistance,
          y * BlcokDistance + index * averageHeight,
          BlcokDistance - 2,
          BlcokDistance - 2
        )
        this.context.strokeRect(
          x * BlcokDistance,
          y * BlcokDistance + index * averageHeight,
          BlcokDistance,
          BlcokDistance
        )
        this.context.restore()
      })
    })
  }
}
