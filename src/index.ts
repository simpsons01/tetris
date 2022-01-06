import { Tetris } from './component/tetris/Tetris'
import { Game } from './component/game'
import { Score } from './component/score'
import { BaseComponent } from './component/base'
import { LineUp } from './component/lineUp/lineUp'
;(function () {
  const scoreFrame = new BaseComponent({
    x: 0,
    y: 0,
    width: 300,
    height: 272,
    baseCanvasConstructor: Score
  })

  const tetrisFrame = new BaseComponent({
    x: scoreFrame.width + 4,
    y: 0,
    width: 600,
    height: 1200,
    baseCanvasConstructor: Tetris
  })

  const lineUpFrame = new BaseComponent({
    x: 0,
    y: scoreFrame.height + 4,
    width: 300,
    height: 900,
    baseCanvasConstructor: LineUp
  })

  const [tetris, score, lineUp] = [tetrisFrame, scoreFrame, lineUpFrame].map((frame) => {
    const canvas = frame.mount()
    canvas.draw()
    return canvas
  })

  const game = new Game(tetris as Tetris, score as Score, lineUp as LineUp)

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
      game.closeAutoFall()
      game.movePolyominoDown()
    }
  })
  window.addEventListener('keyup', function (e) {
    if (e.keyCode === 38) {
      game.changePolyominoShape()
    } else if (e.keyCode === 40) {
      game.startAutoFall()
    }
  })
  // @ts-ignore
  window.t = game
})()

1224

1176 / 3
