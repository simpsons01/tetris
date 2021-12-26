import { ICoordinate, IPolyominoCoordinateConfig, IPolyominoCoordinate, IRender } from "../../types" 
import {  PolyominoShape, Canvas, BlcokDistance } from "../../enum";

export class BasePolyomino {
  coordinateConfig: IPolyominoCoordinateConfig
  strokeColor: string
  fillColor: string
  coordinate: IPolyominoCoordinate['coordinate'] 
  shape: PolyominoShape = PolyominoShape.First

  constructor(
    coordinateConfig: IPolyominoCoordinateConfig,
    renderConfig: IRender
  ) {
    this.coordinateConfig = coordinateConfig
    this.strokeColor = renderConfig.strokeColor
    this.fillColor = renderConfig.fillColor
    this.coordinate = this.coordinateConfig[this.shape].coordinate
  }

  get anchor() {
    return this.coordinate[this.coordinateConfig[this.shape].anchorIndex]
  }

  updateCoordinate = (coordinate: ICoordinate) => {
    this.coordinateConfig[this.shape].coordinate.forEach(({ x, y }, index) => {
      this.coordinate[index].x = x + coordinate.x
      this.coordinate[index].x = y + coordinate.y
    })
    return this.coordinate
  }

  changeShape = (shape: PolyominoShape) => {
    this.shape = shape
    this.updateCoordinate(this.anchor)
    return this.coordinate
  }

  getInfo = () => {
    return this.coordinate.map(coordinate => ({ 
      ...coordinate, 
      strokeColor: this.strokeColor, 
      fillColor: this.fillColor 
    }))
  }
}