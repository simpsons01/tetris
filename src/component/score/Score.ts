import { IBaseComponentConfig } from '../../types'
import { BaseComponent, BaseComponentWithBorder } from '../base'

const { borders, borderWidth } = BaseComponentWithBorder
const offset = borderWidth * borders
export class Score extends BaseComponent {
  score: number = 0

  constructor(config: IBaseComponentConfig) {
    super(config)
  }

  updateScore(score: number) {
    this.score += score
    this.draw()
  }

  draw() {
    this.context.clearRect(this.x + offset, this.y + offset, this.width, this.height)
    this.context.fillStyle = '#292929'
    this.context.fillRect(this.x + offset, this.y + offset, this.width, this.height)
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
