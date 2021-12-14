import { isRegExp } from "util";
import { BaseCube } from "./cube";
import { BlockState, Cube, Canvas, CubeDistance } from "./enum";
import { ICubeCoordinate, ICubeCoordinateList } from "./types";

let fallTimer

class Main {
  context: CanvasRenderingContext2D
  blocks: Array<{ strokeColor: string , fillColor: string, state: BlockState, x: number, y: number }> = (
    new Array((Canvas.Width / CubeDistance) * (Canvas.Height / CubeDistance))).map((temp, index) => {
      return {
        x: index % (Canvas.Width / CubeDistance),
        y: Math.floor(index / (Canvas.Width / CubeDistance)),
        strokeColor: '#696969',
        fillColor: '#C0C0C0',
        state: BlockState.Unfilled
      }
    })
  cube: null | BaseCube


  constructor(context: CanvasRenderingContext2D) {
    this.init(context)
  }

  init(context: CanvasRenderingContext2D) {
    this.context = context
    this.draw()
  }

  draw() {
    this.context.clearRect(0, 0, Canvas.Width, Canvas.Height)
    this.blocks.forEach(({strokeColor, fillColor, x, y, state}) => {
      let _x, _y, _strokeColor, _fillColor
      if(state === BlockState.Filled) {
        _x = x * CubeDistance
        _y = y * CubeDistance
        _strokeColor = strokeColor
        _fillColor = fillColor
      }else if(
        x === this.cube.coordinate.x &&
        y === this.cube.coordinate.y
      ) {
        _x = this.cube.coordinate.x * CubeDistance
        _y = this.cube.coordinate.y * CubeDistance
        _strokeColor = this.cube.strokeColor
        _fillColor = this.cube.fillColor
      }
      this.context.strokeStyle = strokeColor
      this.context.fillStyle = fillColor
      this.context.save()
      this.context.fillRect(_x, _y, CubeDistance - 1, CubeDistance - 1)
      this.context.strokeRect(_x, _y, CubeDistance, CubeDistance)
      this.context.restore()
    })
  }

  startGame() {
  }

  fall() {
  }

  excute() {
     
  }


  getIsCubeCollide(coordinateList: ICubeCoordinateList): boolean {  
    return this.blocks
     .filter(block => block.state === BlockState.Filled)
     .some(filledBlock => {
        return coordinateList.some(coordinate => {
          return coordinate.x === filledBlock.x && coordinate.y === filledBlock.y
        })
     })
  }
  

  getShouldClearCubes() {
  }

  changeCubePosiiton(coordinate: ICubeCoordinate) {
    this.cube.updateCoordinate(coordinate)
    this.draw()
  }
}