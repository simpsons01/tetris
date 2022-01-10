import { IntervalTimer, CountDownTimer } from '../../util'
import { LineUp } from '../lineUp/lineUp'
import { Score } from '../score'
import { TetrisView } from '../tetris'
import { Direction } from './../../enum'

const nextRoundTimer = new CountDownTimer(0.5, true),
  nextRoundCountDownTimer = new CountDownTimer(1.5),
  polyominoFallTimer = new IntervalTimer(0.8)

export class Game {
  private tetris: TetrisView
  private score: Score
  private lineUp: LineUp
  public isPending: boolean = false

  constructor(tetris: TetrisView, score: Score, lineUp: LineUp) {
    this.tetris = tetris
    this.score = score
    this.lineUp = lineUp
  }

  onPolyominCoordinateChange() {
    const { isBottomCollide } = this.tetris.checkPolyominoCollide()
    if (isBottomCollide) {
      this.closePolyominoAutoFall()
      if (!this.isPending) {
        this.startNextRoundCountDownTimer()
        this.startNextRoundTimer()
        this.isPending = true
      } else {
        this.startNextRoundTimer()
      }
    } else {
      if (this.isPending) {
        this.startPolyominoAutoFall()
        this.closeNextRoundCountDownTimer()
        this.closeNextRoundTimer()
      }
    }
  }

  movePolyominoRight() {
    const isMoveSuccess = this.tetris.movePolyomino(Direction.Right)
    if (isMoveSuccess) {
      this.onPolyominCoordinateChange()
    }
  }

  movePolyominoLeft() {
    const isMoveSuccess = this.tetris.movePolyomino(Direction.Left)
    if (isMoveSuccess) {
      this.onPolyominCoordinateChange()
    }
  }

  movePolyominoDown() {
    const isMoveSuccess = this.tetris.movePolyomino(Direction.Down)
    if (isMoveSuccess) {
      this.onPolyominCoordinateChange()
    }
  }

  changePolyominoShape() {
    const isChangeShapeSuccess = this.tetris.changePolyominoShape()
    if (isChangeShapeSuccess) {
      this.onPolyominCoordinateChange()
    }
  }

  startPolyominoAutoFall() {
    polyominoFallTimer.start(() => {
      this.movePolyominoDown()
    })
  }

  closePolyominoAutoFall() {
    polyominoFallTimer.close()
  }

  startNextRoundCountDownTimer() {
    nextRoundCountDownTimer.start(() => {
      if (this.isPending) {
        this.closeNextRoundTimer()
        const { isBottomCollide } = this.tetris.checkPolyominoCollide()
        if (isBottomCollide) {
          this.beforeNextRound().then(() => {
            this.nextRound()
          })
        } else {
          this.isPending = false
          this.startPolyominoAutoFall()
        }
      }
    })
  }

  closeNextRoundCountDownTimer() {
    nextRoundCountDownTimer.close()
  }

  startNextRoundTimer() {
    nextRoundTimer.start(() => {
      const { isBottomCollide } = this.tetris.checkPolyominoCollide()
      if (isBottomCollide) {
        this.beforeNextRound().then(() => {
          this.nextRound()
        })
      } else {
        this.isPending = false
        this.startPolyominoAutoFall()
      }
    })
  }

  closeNextRoundTimer() {
    nextRoundTimer.close()
  }

  beforeNextRound() {
    return new Promise((resolve) => {
      this.tetris.setPolyominoInfoToData()
      const filledRow = this.tetris.checkFilledRow()
      if (filledRow.length) {
        this.score.updateScore(filledRow.length)
        this.tetris
          .clearFilledRow()
          .then(() => {
            return this.tetris.fillEmptyRow()
          })
          .then(() => {
            // @ts-ignore
            resolve()
          })
      } else {
        // @ts-ignore
        resolve()
      }
    })
  }

  nextRound() {
    this.tetris.nextPolyomino(this.lineUp.first)
    this.lineUp.next()
    if (this.isGameOver()) {
      console.log('game is over')
    } else {
      this.isPending = false
      this.startPolyominoAutoFall()
    }
  }

  start() {
    this.tetris.nextPolyomino(this.lineUp.first)
    this.lineUp.next()
    this.startPolyominoAutoFall()
  }

  isGameOver() {
    const { isTopCollide, isBottomCollide } = this.tetris.checkPolyominoCollide()
    return isTopCollide && isBottomCollide
  }

  pause() {
    this.closePolyominoAutoFall()
  }
}
