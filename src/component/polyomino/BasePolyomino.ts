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

  calcCoodinateByShape(shape: PolyominoShape) {
    const anchor = this.coordinate[this.coordinateConfig[shape].anchorIndex]
    return this.coordinateConfig[shape].coordinate.map(({ x, y }) => ({
      x: x + anchor.x,
      y: y + anchor.y
    })) as IPolyominoCoordinate['coordinate']
  }

  calcCoodinateByAnchor(anchor: ICoordinate) {
    return this.coordinateConfig[this.shape].coordinate.map(({ x, y }) => ({
      x: x + anchor.x,
      y: y + anchor.y
    })) as IPolyominoCoordinate['coordinate']
  }

  updateCoordinate(coordinate: ICoordinate) {
    this.coordinate = this.calcCoodinateByAnchor(coordinate)
    return this.coordinate
  }

  resetCoordinate() {
    this.changeShape(PolyominoShape.First)
    this.coordinateConfig[PolyominoShape.First].coordinate.forEach(({ x, y }, index) => {
      this.coordinate[index].x = x
      this.coordinate[index].y = y
    })
  }

  changeShape(shape: PolyominoShape) {
    this.shape = shape
    const nextAnchorCoordinate = this.anchor
    this.updateCoordinate(nextAnchorCoordinate)
    return this.coordinate
  }

  getInfo() {
    return this.coordinate.map((coordinate) => ({
      ...coordinate,
      strokeColor: this.strokeColor,
      fillColor: this.fillColor
    }))
  }
}
