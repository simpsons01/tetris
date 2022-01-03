import { ICoordinate, ISize } from './../../types'

interface IComponentConfig extends ICoordinate, ISize {
  context: CanvasRenderingContext2D
}

export abstract class BaseComponent {
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

  abstract draw(): void
}
