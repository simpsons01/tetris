import { BaseCanvas } from '../base'
import { IBaseCanvas } from '../../types'
export class Score extends BaseCanvas {
  score: number = 0

  constructor(config: Pick<IBaseCanvas, 'context' | 'width' | 'height'>) {
    super(config)
  }

  updateScore(score: number) {
    this.score += score
    this.draw()
  }

  draw() {
    this.context.clearRect(0, 0, this.width, this.height)
    this.context.fillStyle = '#292929'
    this.context.fillRect(0, 0, this.width, this.height)
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
