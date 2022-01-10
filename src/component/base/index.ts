import { EventEmitter } from './../../util'
import { IBaseComponent, IBaseCanvas } from './../../types'

export abstract class BaseCanvas extends EventEmitter implements IBaseCanvas {
  width: number
  height: number
  context: CanvasRenderingContext2D

  constructor(config: Pick<IBaseCanvas, 'context' | 'width' | 'height'>) {
    super()
    this.width = config.width
    this.height = config.height
    this.context = config.context
  }

  abstract draw(...args: Array<any>): void
}

export class BaseComponent implements IBaseComponent {
  x: number
  y: number
  width: number
  height: number
  canvasWidth: number
  canvasHeight: number
  constructor(config: Pick<IBaseComponent, 'x' | 'y' | 'width' | 'height'>) {
    const { borderWidth, borders } = BaseComponent
    this.x = config.x
    this.y = config.y
    this.width = config.width + borders * borderWidth * 2
    this.height = config.height + borders * borderWidth * 2
    this.canvasWidth = config.width
    this.canvasHeight = config.height
  }

  static borders = 3

  static borderWidth = 4

  public mount(): CanvasRenderingContext2D {
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
      { key: 'height', value: `${this.canvasHeight}px` },
      { key: 'width', value: `${this.canvasWidth}px` }
    ].forEach(({ key, value }) => {
      canvas.setAttribute(key, value)
    })
    frame.appendChild(canvas)
    canvasContainer.appendChild(frame)
    return context
  }
}
