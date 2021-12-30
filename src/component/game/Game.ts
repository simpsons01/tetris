import { BlockState, Direction } from './../../enum'
import { Tetris } from './../tetris/Tetris'

let nextTimer: number | null = null,
  nextRoundCountDownTimer: number | null = null,
  fallTimer: number | null = null

export class Game {
  private tetris: Tetris
  public isPending: boolean = false

  constructor(tetris: Tetris) {
    this.tetris = tetris
  }

  onPolyominCoordinateChange = () => {
    const { bottom: isBottomCollide } = this.tetris.checkPolyominoCollide()
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

  movePolyominoRight = () => {
    if (this.tetris.polyomino) {
      const isMoveSuccess = this.tetris.movePolyomino(Direction.Right)
      if (isMoveSuccess) {
        this.onPolyominCoordinateChange()
      }
    }
  }

  movePolyominoLeft = () => {
    if (this.tetris.polyomino) {
      const isMoveSuccess = this.tetris.movePolyomino(Direction.Left)
      if (isMoveSuccess) {
        this.onPolyominCoordinateChange()
      }
    }
  }

  movePolyominoDown = () => {
    if (this.tetris.polyomino) {
      const isMoveSuccess = this.tetris.movePolyomino(Direction.Down)
      if (isMoveSuccess) {
        this.onPolyominCoordinateChange()
      }
    }
  }

  changePolyominoShape = () => {
    if (this.tetris.polyomino) {
      const isChangeShapeSuccess = this.tetris.changePolyominoShape()
      if (isChangeShapeSuccess) {
        this.onPolyominCoordinateChange()
      }
    }
  }

  startAutoFall = () => {
    if (!fallTimer) {
      fallTimer = window.setInterval(() => {
        this.movePolyominoDown()
      }, 700)
    }
  }

  closeAutoFall = () => {
    if (fallTimer) {
      window.clearInterval(fallTimer)
      fallTimer = null
    }
  }

  startNextRoundCountDownTimer = () => {
    if (!nextRoundCountDownTimer) {
      nextRoundCountDownTimer = window.setTimeout(() => {
        this.closeNextRoundTimer()
        nextRoundCountDownTimer = null
        const { bottom: isBottomCollide } = this.tetris.checkPolyominoCollide()
        if (isBottomCollide) {
          this.beforeNextRound().then(() => {
            this.tetris.createPolyomino()
            if (this.checkIsGameOver()) {
              alert('game over')
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

  closeNextRoundCountDownTimer = () => {
    if (nextRoundCountDownTimer) {
      window.clearTimeout(nextRoundCountDownTimer)
      nextRoundCountDownTimer = null
    }
  }

  startNextRoundTimer = () => {
    this.closeNextRoundTimer()
    nextTimer = window.setTimeout(() => {
      this.closeNextRoundCountDownTimer()
      nextTimer = null
      const { bottom: isBottomCollide } = this.tetris.checkPolyominoCollide()
      if (isBottomCollide) {
        this.beforeNextRound().then(() => {
          this.tetris.createPolyomino()
          if (this.checkIsGameOver()) {
            alert('game over')
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

  closeNextRoundTimer = () => {
    if (nextTimer) {
      window.clearTimeout(nextTimer)
      nextTimer = null
    }
  }

  beforeNextRound = () => {
    return new Promise((resolve) => {
      this.tetris.syncPolyominoInfoToData()
      this.tetris.resetPolyomino()
      const filledRowInedxList = this.tetris.getFilledRowInedxList()
      if (filledRowInedxList.length > 0) {
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

  nextRound = () => {
    this.startAutoFall()
  }

  checkIsGameOver = () => {
    return this.tetris.polyomino.coordinate.some(({ x, y }) => {
      const block = this.tetris.data[y].find((block) => block.x === x)
      return block.state === BlockState.Filled
    })
  }

  start = () => {
    this.tetris.createPolyomino()
    this.nextRound()
  }
}
