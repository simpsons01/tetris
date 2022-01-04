import { Tetris } from './component/tetris/Tetris'
import { Game } from './component/game'
import { Score } from './component/score'
import { BaseComponent } from './component/base'
;(function () {
  const scoreFrame = new BaseComponent({
    x: 0,
    y: 0,
    width: 250,
    height: 200,
    baseCanvasConstructor: Score
  })

  const tetrisFrame = new BaseComponent({
    x: scoreFrame.width + 4,
    y: 0,
    width: 600,
    height: 1200,
    baseCanvasConstructor: Tetris
  })

  const [tetris, score] = [tetrisFrame, scoreFrame].map((frame) => {
    const canvas = frame.mount()
    canvas.draw()
    return canvas
  })

  const game = new Game(tetris as Tetris, score as Score)

  //game.start()

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
