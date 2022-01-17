import { Tetris } from './component/tetris/Tetris'
import { Game } from './component/game'
import { Score } from './component/score'
import { BaseComponent } from './component/base'
import { LineUp } from './component/lineUp/lineUp'
;(function () {
  const scoreFrame = new BaseComponent({
    x: 0,
    y: 0,
    width: 150,
    height: 136,
    baseCanvasConstructor: Score
  })

  const tetrisFrame = new BaseComponent({
    x: scoreFrame.width + 2,
    y: 0,
    width: 300,
    height: 600,
    baseCanvasConstructor: Tetris
  })

  const lineUpFrame = new BaseComponent({
    x: 0,
    y: scoreFrame.height + 2,
    width: 150,
    height: 440,
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
  // /game.closePolyominoAutoFall()

  window.addEventListener('keydown', function (e) {
    if (e.keyCode === 37) {
      game.movePolyominoLeft()
    } else if (e.keyCode === 39) {
      game.movePolyominoRight()
    } else if (e.keyCode === 40) {
      game.closePolyominoAutoFall()
      game.movePolyominoDown()
    } else if (e.keyCode === 32) {
      game.closePolyominoAutoFall()
      game.movePolyominoQuick()
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
