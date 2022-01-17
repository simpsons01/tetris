import { BaseCanvas } from '../base'
import { IBaseCanvas } from '../../types'
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
    this.context.font = '35px Arial'
    this.context.fillStyle = '#FFFFFF'
    this.context.textAlign = 'center'
    this.context.save()
    this.context.fillText('Score', 75, 30 + 35 - 5)
    this.context.restore()
    // paint score
    this.context.font = '35px Arial'
    this.context.fillStyle = '#FFFFFF'
    this.context.textAlign = 'center'
    this.context.save()
    this.context.fillText(`${this.score}`, 75, 30 + 5 + 35 + 35 - 5)
    this.context.restore()
  }
}
