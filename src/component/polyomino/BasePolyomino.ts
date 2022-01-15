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
    return this.calcAnchorByCoordinateAndShape(this.coordinate, this.shape)
  }

  get range() {
    return this.calcRangeByCoordinate(this.coordinate)
  }

  get info() {
    return this.calcInfo(this.coordinate)
  }

  calcCoordinateByAnchorandShape(anchor: ICoordinate, shape: PolyominoShape) {
    return this.coordinateConfig[shape].coordinate.map(({ x: _x, y: _y }) => {
      return {
        x: _x + anchor.x,
        y: _y + anchor.y
      }
    }) as IPolyominoCoordinate['coordinate']
  }

  calcAnchorByCoordinateAndShape(coordinate: IPolyominoCoordinate['coordinate'], shape: PolyominoShape) {
    return coordinate[this.coordinateConfig[shape].anchorIndex]
  }

  calcInfo(coordinate: IPolyominoCoordinate['coordinate']) {
    return coordinate.map((coordinate) => ({
      ...coordinate,
      strokeColor: this.strokeColor,
      fillColor: this.fillColor
    }))
  }

  calcRangeByCoordinate(coordinate: IPolyominoCoordinate['coordinate']) {
    const _x = coordinate.map(({ x }) => x)
    const _y = coordinate.map(({ y }) => y)
    return {
      maxX: Math.max(..._x),
      minX: Math.min(..._x),
      maxY: Math.max(..._y),
      minY: Math.min(..._y)
    }
  }

  updateCoordinate(coordinate: ICoordinate) {
    this.coordinate = this.calcCoordinateByAnchorandShape(coordinate, this.shape)
    return this.coordinate
  }

  changeShape(shape: PolyominoShape) {
    this.shape = shape
    const nextAnchorCoordinate = this.anchor
    this.updateCoordinate(nextAnchorCoordinate)
    return this.coordinate
  }
}
