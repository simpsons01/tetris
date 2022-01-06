import { deepColne } from '../../util'
import { LineUp } from '../lineUp/lineUp'
import { Score } from '../score'
import { BlockState, Direction } from './../../enum'
import { Tetris } from './../tetris/Tetris'

let nextRoundTimer: number | null = null,
  nextRoundCountDownTimer: number | null = null,
  fallTimer: number | null = null

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
      this.closeAutoFall()
      if (!this.isPending) {
        this.startNextRoundCountDownTimer()
        this.startNextRoundTimer()
        this.isPending = true
      } else {
        this.startNextRoundTimer()
      }
    } else {
      if (this.isPending) {
        this.startAutoFall()
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

  startAutoFall() {
    if (!fallTimer) {
      fallTimer = window.setInterval(() => {
        this.movePolyominoDown()
      }, 700)
    }
  }

  closeAutoFall() {
    if (fallTimer) {
      window.clearInterval(fallTimer)
      fallTimer = null
    }
  }

  startNextRoundCountDownTimer() {
    if (!nextRoundCountDownTimer) {
      nextRoundCountDownTimer = window.setTimeout(() => {
        this.closeNextRoundTimer()
        nextRoundCountDownTimer = null
        const { bottom: isBottomCollide } = this.tetris.getPolyominoCollideStatus()
        if (isBottomCollide) {
          this.beforeNextRound().then(() => {
            this.tetris.setPolyomino(this.lineUp.first)
            this.tetris.centerTopPolyomino()
            this.lineUp.next()
            if (this.isGameOver()) {
              console.log('game is over')
            } else {
              this.nextRound()
            }
          })
        } else {
          this.isPending = false
          this.startAutoFall()
        }
      }, 1000)
    }
  }

  closeNextRoundCountDownTimer() {
    if (nextRoundCountDownTimer) {
      window.clearTimeout(nextRoundCountDownTimer)
      nextRoundCountDownTimer = null
    }
  }

  startNextRoundTimer() {
    this.closeNextRoundTimer()
    nextRoundTimer = window.setTimeout(() => {
      this.closeNextRoundCountDownTimer()
      nextRoundTimer = null
      const { bottom: isBottomCollide } = this.tetris.getPolyominoCollideStatus()
      if (isBottomCollide) {
        this.beforeNextRound().then(() => {
          this.tetris.setPolyomino(this.lineUp.first)
          this.tetris.centerTopPolyomino()
          this.lineUp.next()
          if (this.isGameOver()) {
            console.log('game is over')
          } else {
            this.nextRound()
          }
        })
      } else {
        this.isPending = false
        this.startAutoFall()
      }
    }, 600)
  }

  closeNextRoundTimer() {
    if (nextRoundTimer) {
      window.clearTimeout(nextRoundTimer)
      nextRoundTimer = null
    }
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
    this.startAutoFall()
  }

  isGameOver() {
    const { top: isTopCollide, bottom: isBottomCollide } = this.tetris.getPolyominoCollideStatus()
    return isTopCollide && isBottomCollide
  }

  start() {
    this.tetris.setPolyomino(this.lineUp.first)
    this.tetris.centerTopPolyomino()
    this.lineUp.next()
    this.nextRound()
  }

  pause() {
    this.closeAutoFall()
  }
}
