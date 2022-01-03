import { Tetris } from '../tetris'
import { ICoordinate, ISize } from './../../types'

interface IComponentConfig extends ICoordinate, ISize {
  context: CanvasRenderingContext2D
}

export class BaseComponent {
  x: number
  y: number
  width: number
  height: number
  context: CanvasRenderingContext2D

  constructor(config: IComponentConfig) {
    this.x = config.x
    this.y = config.y
    this.width = config.width
    this.height = config.height
    this.context = config.context
  }

  public draw() {
    const borderWidth = 4,
      borders = 3
    this.context.clearRect(
      this.x,
      this.y,
      this.width + borders * borderWidth * 2,
      this.height + borders * borderWidth * 2
    )
    this.context.fillStyle = '#C0C0C0'
    this.context.fillRect(
      this.x,
      this.y,
      this.width + borders * borderWidth * 2,
      this.height + borders * borderWidth * 2
    )
    this.context.fillStyle = '#292929'
    this.context.fillRect(
      this.x + (borders - 2) * borderWidth,
      this.y + (borders - 2) * borderWidth,
      this.width + (borders - 1) * borderWidth * 2,
      this.height + (borders - 1) * borderWidth * 2
    )
    this.context.fillStyle = '#50C878'
    this.context.fillRect(
      this.x + (borders - 1) * borderWidth,
      this.y + (borders - 1) * borderWidth,
      this.width + (borders - 2) * borderWidth * 2,
      this.height + (borders - 2) * borderWidth * 2
    )
    this.context.fillStyle = '#292929'
    this.context.fillRect(this.x + borders * borderWidth, this.y + borders * borderWidth, this.width, this.height)
  }
}
