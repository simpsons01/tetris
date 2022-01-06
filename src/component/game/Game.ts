import { IntervalTimer, CountDownTimer } from '../../util'
import { LineUp } from '../lineUp/lineUp'
import { Score } from '../score'
import { Direction } from './../../enum'
import { Tetris } from './../tetris/Tetris'

const nextRoundTimer = new CountDownTimer(0.6, true),
  nextRoundCountDownTimer = new CountDownTimer(1.2),
  polyominoFallTimer = new IntervalTimer(0.7)

export class Game {
  private tetris: Tetris
  private score: Score
  private lineUp: LineUp
  public isPending: boolean = false

  constructor(tetris: Tetris, score: Score, lineUp: LineUp) {
    this.tetris = tetris
    this.score = score
    this.lineUp = lineUp
  }

  onPolyominCoordinateChange() {
    const { bottom: isBottomCollide } = this.tetris.getPolyominoCollideStatus()
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
    if (this.tetris.polyomino) {
      const isMoveSuccess = this.tetris.movePolyomino(Direction.Right)
      if (isMoveSuccess) {
        this.onPolyominCoordinateChange()
      }
    }
  }

  movePolyominoLeft() {
    if (this.tetris.polyomino) {
      const isMoveSuccess = this.tetris.movePolyomino(Direction.Left)
      if (isMoveSuccess) {
        this.onPolyominCoordinateChange()
      }
    }
  }

  movePolyominoDown() {
    if (this.tetris.polyomino) {
      const isMoveSuccess = this.tetris.movePolyomino(Direction.Down)
      if (isMoveSuccess) {
        this.onPolyominCoordinateChange()
      }
    }
  }

  changePolyominoShape() {
    if (this.tetris.polyomino) {
      const isChangeShapeSuccess = this.tetris.changePolyominoShape()
      if (isChangeShapeSuccess) {
        this.onPolyominCoordinateChange()
      }
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
        const { bottom: isBottomCollide } = this.tetris.getPolyominoCollideStatus()
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
      const { bottom: isBottomCollide } = this.tetris.getPolyominoCollideStatus()
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
      this.tetris.syncPolyominoInfoToData()
      this.tetris.resetPolyomino()
      const filledRowInedxList = this.tetris.getFilledRowInedxList()
      if (filledRowInedxList.length > 0) {
        this.score.updateScore(filledRowInedxList.length)
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
    this.tetris.setPolyomino(this.lineUp.first)
    this.tetris.centerTopPolyomino()
    this.lineUp.next()
    if (this.isGameOver()) {
      console.log('game is over')
    } else {
      this.isPending = false
      this.startPolyominoAutoFall()
    }
  }

  isGameOver() {
    const { top: isTopCollide, bottom: isBottomCollide } = this.tetris.getPolyominoCollideStatus()
    return isTopCollide && isBottomCollide
  }

  start() {
    this.tetris.setPolyomino(this.lineUp.first)
    this.tetris.centerTopPolyomino()
    this.lineUp.next()
    this.startPolyominoAutoFall()
  }

  pause() {
    this.closePolyominoAutoFall()
  }
}
