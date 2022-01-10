import { IBaseCanvas, IBaseComponent } from './types'
import { TetrisView, TetrisModel, PolyominoModel, TetrisController } from './component/tetris'
import { Game } from './component/game'
import { Score } from './component/score'
import { BaseComponent } from './component/base'
import { LineUp } from './component/lineUp/lineUp'
;(function () {
  const scoreFrame = new BaseComponent({
    x: 0,
    y: 0,
    width: 300,
    height: 272
  })

  const tetrisFrame = new BaseComponent({
    x: scoreFrame.width + 4,
    y: 0,
    width: 600,
    height: 1200
  })

  const lineUpFrame = new BaseComponent({
    x: 0,
    y: scoreFrame.height + 4,
    width: 300,
    height: 900
  })

  const [tetrisContext, scoreContext, lineUpContext] = [tetrisFrame, scoreFrame, lineUpFrame].map((frame) => {
    const context = frame.mount()
    return context
  })

  const lineUp = (() => {
    const lineUp = new LineUp({
      width: lineUpFrame.canvasWidth,
      height: lineUpFrame.canvasHeight,
      context: lineUpContext
    })
    lineUp.draw()
    return lineUp
  })()

  const score = (() => {
    const score = new Score({
      width: scoreFrame.canvasWidth,
      height: scoreFrame.canvasHeight,
      context: scoreContext
    })
    score.draw()
    return score
  })()

  const tetrisView = (() => {
    const tetrisController = new TetrisController(
      new PolyominoModel(),
      new TetrisModel(10, 20),
      new TetrisView({
        width: tetrisFrame.canvasWidth,
        height: tetrisFrame.canvasHeight,
        context: tetrisContext
      })
    )
    const tetrisView = tetrisController.view
    tetrisView.draw(tetrisController.tetrisModel.data, null)
    return tetrisView
  })()

  const game = new Game(tetrisView as TetrisView, score as Score, lineUp as LineUp)

  const setCanvasContainerSize = () => {
    const width = lineUpFrame.width + tetrisFrame.width
    const height = tetrisFrame.height
    const canvasContainer: HTMLElement = document.querySelector('#canvas-container')
    canvasContainer.style.width = `${width}px`
    canvasContainer.style.height = `${height}px`
  }

  setCanvasContainerSize()

  game.start()

  window.addEventListener('keydown', function (e) {
    if (e.keyCode === 37) {
      game.movePolyominoLeft()
    }
    if (e.keyCode === 39) {
      game.movePolyominoRight()
    } else if (e.keyCode === 40) {
      game.closePolyominoAutoFall()
      game.movePolyominoDown()
    }
  })
  window.addEventListener('keyup', function (e) {
    if (e.keyCode === 38) {
      game.changePolyominoShape()
    } else if (e.keyCode === 40) {
      game.startPolyominoAutoFall()
    }
  })
  // @ts-ignore
  window.t = game
})()

1224

1176 / 3
