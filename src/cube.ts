import { ICubeCoordinate, ICubeShapeConifg, ICubeRenderConfg, ICubeCoordinateList } from "./types" 
import {  CubeRenderShape, Canvas, CubeDistance } from "./enum";

export class BaseCube {
  shapeConfig: ICubeShapeConifg
  context: CanvasRenderingContext2D
  strokeColor: string
  fillColor: string
  coordinate: ICubeCoordinate = { x: (Canvas.Width / CubeDistance) / 2 , y: 0 }
  cubeCoordinateInfo: ICubeCoordinateList
  currentShape: CubeRenderShape = CubeRenderShape.First

  constructor(
    shapeConfig: ICubeShapeConifg,
    renderConfig: ICubeRenderConfg
  ) {
    this.shapeConfig = shapeConfig
    this.strokeColor = renderConfig.strokeColor
    this.fillColor = renderConfig.fillColor
    this.cubeCoordinateInfo = this.shapeConfig[this.currentShape]
  }

  calcCubeCoordinateInfo(coordinate: ICubeCoordinate) {
    const { 
      x, 
      y 
    } = coordinate
    return this.shapeConfig[this.currentShape].map(shape => ({
      x: x + shape.x,
      y: y + shape.y
    }))
  }

  updateCoordinate(Coordinate: ICubeCoordinate): ICubeCoordinateList {
    const { 
      x, 
      y 
    } = Coordinate
    this.coordinate = { x, y }
    this.cubeCoordinateInfo = this.calcCubeCoordinateInfo({ x, y })
    return this.cubeCoordinateInfo
  }

  changeShape(shape: CubeRenderShape): ICubeCoordinateList {
    this.currentShape = shape
    this.updateCoordinate(this.coordinate)
    return this.cubeCoordinateInfo
  }

  getInfo(): Array<{ x: number, y: number, strokeColor: string, fillColor: string }> {
    return this.cubeCoordinateInfo.map(coordinate => ({ ...coordinate, strokeColor: this.strokeColor, fillColor: this.fillColor }))
  }
}