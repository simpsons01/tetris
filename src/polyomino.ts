import { ICoordinate, IPolyominoConfig, IBlock, IPolyominoCoordinate } from "./types" 
import {  PolyominoShape, Canvas, BlcokDistance } from "./enum";

export class BasePolyomino {
  shapeConfig: IPolyominoConfig
  strokeColor: string
  fillColor: string
  anchor: ICoordinate = { x: (Canvas.Width / BlcokDistance) / 2 , y: 0 }
  coordinate: IPolyominoCoordinate
  shape: PolyominoShape = PolyominoShape.First

  constructor(
    shapeConfig: IPolyominoConfig,
    renderConfig: IBlock
  ) {
    this.shapeConfig = shapeConfig
    this.strokeColor = renderConfig.strokeColor
    this.fillColor = renderConfig.fillColor
    this.coordinate = this.shapeConfig[this.shape]
  }

  calcPolyominoCoordinate(coordinate: ICoordinate): IPolyominoCoordinate {
    const { 
      x, 
      y 
    } = coordinate
    return (this.shapeConfig[this.shape].map(shape => ({
      x: x + shape.x,
      y: y + shape.y
    })) as IPolyominoCoordinate)
  }

  updateCoordinate(Coordinate: ICoordinate): IPolyominoCoordinate {
    const { 
      x, 
      y 
    } = Coordinate
    this.anchor = { x, y }
    this.coordinate = this.calcPolyominoCoordinate({ x, y })
    return this.coordinate
  }

  changeShape(shape: PolyominoShape): IPolyominoCoordinate {
    this.shape = shape
    this.updateCoordinate(this.anchor)
    return this.coordinate
  }

  getInfo(): Array<{ x: number, y: number, strokeColor: string, fillColor: string }> {
    return this.coordinate.map(coordinate => ({ 
      ...coordinate, 
      strokeColor: this.strokeColor, 
      fillColor: this.fillColor 
    }))
  }
}