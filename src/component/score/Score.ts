import { BaseComponent } from '../base'
export class Score extends BaseComponent {
  score: number = 0

  constructor(context: CanvasRenderingContext2D) {
    super({
      x: 0,
      y: 0,
      width: 100,
      height: 200,
      context: context
    })
    this.draw()
  }

  updateScore = (score: number) => {
    this.score = score
    this.draw()
  }

  draw = () => {
    this.context.clearRect(this.x, this.y, this.width, this.height)
    this.context.font = '36px Arial'
    this.context.fillStyle = '#FFFFFF'
    this.context.save()
    this.context.textAlign = 'center'
    this.context.fillText(`${this.score}`, 50, 50)
    this.context.restore()
  }
}
