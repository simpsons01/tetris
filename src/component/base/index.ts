import { IBaseComponent, IBaseComponentConfig } from './../../types'

export class BaseComponent implements IBaseComponent {
  x: number
  y: number
  width: number
  height: number
  context: CanvasRenderingContext2D
  constructor(config: IBaseComponentConfig) {
    this.x = config.x
    this.y = config.y
    this.width = config.width
    this.height = config.height
    this.context = config.context
  }

  public draw() {}
}

export class BaseComponentWithBorder implements IBaseComponent {
  x: number
  y: number
  width: number
  height: number
  context: CanvasRenderingContext2D
  component: IBaseComponent
  constructor(component: IBaseComponent) {
    const { borderWidth, borders } = BaseComponentWithBorder
    this.x = component.x
    this.y = component.y
    this.width = component.width + borders * borderWidth * 2
    this.height = component.height + borders * borderWidth * 2
    this.context = component.context
    this.component = component
  }

  static borders = 3

  static borderWidth = 4

  public draw() {
    const { borderWidth, borders } = BaseComponentWithBorder
    this.context.clearRect(this.x, this.y, this.width, this.height)
    this.context.fillStyle = '#C0C0C0'
    this.context.fillRect(this.x, this.y, this.width, this.height)
    this.context.fillStyle = '#292929'
    this.context.fillRect(
      this.x + (borders - 2) * borderWidth,
      this.y + (borders - 2) * borderWidth,
      this.width - (borders - 2) * borderWidth * 2,
      this.height - (borders - 2) * borderWidth * 2
    )
    this.context.fillStyle = '#50C878'
    this.context.fillRect(
      this.x + (borders - 1) * borderWidth,
      this.y + (borders - 1) * borderWidth,
      this.width - (borders - 1) * borderWidth * 2,
      this.height - (borders - 1) * borderWidth * 2
    )
    this.component.draw()
  }
}
