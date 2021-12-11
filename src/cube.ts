import { ICubePosition, ICubeShapeConifg, ICubeRenderConfg, ICubePositionList } from "./types" 
import {  CubeRenderShape, Canvas, CubeDistance } from "./enum";

export class BaseCube {
  shapeConfig: ICubeShapeConifg
  context: CanvasRenderingContext2D
  strokeColor: string
  fillColor: string
  currentPosition: ICubePosition = { x: (Canvas.Width / CubeDistance) / 2 , y: 0 }
  currentPositionList: ICubePositionList
  currentShape: CubeRenderShape = CubeRenderShape.First

  constructor(
    shapeConfig: ICubeShapeConifg,
    renderConfig: ICubeRenderConfg
  ) {
    this.shapeConfig = shapeConfig
    this.strokeColor = renderConfig.strokeColor
    this.fillColor = renderConfig.fillColor
    this.currentPositionList = this.shapeConfig[this.currentShape]
  }

  updatePosition(position: ICubePosition): ICubePositionList {
    const { 
      x, 
      y 
    } = position
    this.currentPosition = { x, y }
    this.currentPositionList = this.shapeConfig[this.currentShape].map(shape => ({
      x: x + shape.x,
      y: y + shape.y
    }))
    return this.currentPositionList
  }

  changeShape(shape: CubeRenderShape): ICubePositionList {
    this.currentShape = shape
    this.updatePosition(this.currentPosition)
    return this.currentPositionList
  }

  getInfo(): Array<{ x: number, y: number, strokeColor: string, fillColor: string }> {
    return this.currentPositionList.map(position => ({ ...position, strokeColor: this.strokeColor, fillColor: this.fillColor }))
  }
}