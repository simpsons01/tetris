import { IBaseComponent, IBaseCanvas } from './../../types'

export class BaseCanvas implements IBaseCanvas {
  width: number
  height: number
  context: CanvasRenderingContext2D

  constructor(config: Pick<IBaseCanvas, 'context' | 'width' | 'height'>) {
    this.width = config.width
    this.height = config.height
    this.context = config.context
  }

  public draw() {}
}

export class BaseComponent implements IBaseComponent {
  x: number
  y: number
  width: number
  height: number
  baseCanvasConstructor: IBaseComponent['baseCanvasConstructor']
  constructor(config: Pick<IBaseComponent, 'x' | 'y' | 'width' | 'height' | 'baseCanvasConstructor'>) {
    const { borderWidth, borders } = BaseComponent
    this.x = config.x
    this.y = config.y
    this.width = config.width + borders * borderWidth * 2
    this.height = config.height + borders * borderWidth * 2
    this.baseCanvasConstructor = config.baseCanvasConstructor
  }

  static borders = 3

  static borderWidth = 4

  public mount(): IBaseCanvas {
    const { borderWidth, borders } = BaseComponent
    const canvasContainer = document.querySelector('#canvas-container')
    const frame = document.createElement('div')
    frame.classList.add('frame')
    ;[
      { key: 'left', value: `${this.x}px` },
      { key: 'top', value: `${this.y}px` },
      { key: 'width', value: `${this.width}px` },
      { key: 'height', value: `${this.height}px` }
    ].forEach(({ key, value }) => {
      // @ts-ignore
      frame.style[key] = value
    })
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    ;[
      { key: 'height', value: `${this.height - borders * borderWidth * 2}px` },
      { key: 'width', value: `${this.width - borders * borderWidth * 2}px` }
    ].forEach(({ key, value }) => {
      canvas.setAttribute(key, value)
    })
    frame.appendChild(canvas)
    canvasContainer.appendChild(frame)
    return new this.baseCanvasConstructor({
      width: this.width - borders * borderWidth * 2,
      height: this.height - borders * borderWidth * 2,
      context
    })
  }
}
