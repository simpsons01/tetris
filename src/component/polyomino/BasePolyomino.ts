import { ICoordinate, IPolyominoCoordinateConfig, IPolyominoCoordinate, IRender } from '../../types'
import { PolyominoShape } from '../../enum'
import { deepColne } from '../../util'

export class BasePolyomino {
  coordinateConfig: IPolyominoCoordinateConfig
  strokeColor: string
  fillColor: string
  coordinate: IPolyominoCoordinate['coordinate']
  shape: PolyominoShape = PolyominoShape.First

  constructor(coordinateConfig: IPolyominoCoordinateConfig, renderConfig: IRender) {
    this.coordinateConfig = coordinateConfig
    this.strokeColor = renderConfig.strokeColor
    this.fillColor = renderConfig.fillColor
    this.coordinate = deepColne(this.coordinateConfig[this.shape].coordinate)
  }

  get anchor() {
    return this.coordinate[this.coordinateConfig[this.shape].anchorIndex]
  }

  get range() {
    const _x = this.coordinate.map(({ x }) => x)
    const _y = this.coordinate.map(({ y }) => y)
    return {
      maxX: Math.max(..._x),
      minX: Math.min(..._x),
      maxY: Math.max(..._y),
      minY: Math.min(..._y)
    }
  }

  getNextShapeCoodinate(nextShape: PolyominoShape) {
    const nextAnchor = this.coordinate[this.coordinateConfig[nextShape].anchorIndex]
    return this.coordinateConfig[nextShape].coordinate.map(({ x, y }) => ({
      x: x + nextAnchor.x,
      y: y + nextAnchor.y
    })) as IPolyominoCoordinate['coordinate']
  }

  updateCoordinate = (coordinate: ICoordinate) => {
    this.coordinateConfig[this.shape].coordinate.forEach(({ x, y }, index) => {
      this.coordinate[index].x = x + coordinate.x
      this.coordinate[index].y = y + coordinate.y
    })
    return this.coordinate
  }

  changeShape = (shape: PolyominoShape) => {
    this.shape = shape
    const nextAnchorCoordinate = this.anchor
    this.updateCoordinate(nextAnchorCoordinate)
    return this.coordinate
  }

  getInfo = () => {
    return this.coordinate.map((coordinate) => ({
      ...coordinate,
      strokeColor: this.strokeColor,
      fillColor: this.fillColor
    }))
  }
}
