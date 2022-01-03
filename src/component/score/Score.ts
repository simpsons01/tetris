import { BaseComponent } from '../base'
export class Score extends BaseComponent {
  score: number = 0

  constructor(context: CanvasRenderingContext2D) {
    super({
      x: 0,
      y: 0,
      width: 250,
      height: 200,
      context: context
    })
    this.draw()
  }

  updateScore(score: number) {
    this.score += score
    this.draw()
  }

  draw() {
    super.draw()
    // paint label
    this.context.font = '40px Arial'
    this.context.fillStyle = '#FFFFFF'
    this.context.textAlign = 'center'
    this.context.save()
    this.context.fillText('Score', 125, 100)
    this.context.restore()
    // paint score
    this.context.font = '46px Arial'
    this.context.fillStyle = '#FFFFFF'
    this.context.textAlign = 'center'
    this.context.save()
    this.context.fillText(`${this.score}`, 125, 150)
    this.context.restore()
  }
}
