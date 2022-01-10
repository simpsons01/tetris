import { BaseCanvas } from '../base'
export class Score extends BaseCanvas {
  score: number = 0

  updateScore(score: number) {
    this.score += score
    this.draw()
  }

  draw() {
    this.context.clearRect(0, 0, this.width, this.height)
    this.context.fillStyle = '#292929'
    this.context.fillRect(0, 0, this.width, this.height)
    // paint label
    this.context.font = '70px Arial'
    this.context.fillStyle = '#FFFFFF'
    this.context.textAlign = 'center'
    this.context.save()
    this.context.fillText('Score', 150, 61 + 70 - 10)
    this.context.restore()
    // paint score
    this.context.font = '70px Arial'
    this.context.fillStyle = '#FFFFFF'
    this.context.textAlign = 'center'
    this.context.save()
    this.context.fillText(`${this.score}`, 150, 61 + 10 + 70 + 70 - 10)
    this.context.restore()
  }
}
