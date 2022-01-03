import { Tetris } from './component/tetris/Tetris'
import { Game } from './component/game'
import { Score } from './component/score'
import { BaseComponentWithBorder } from './component/base'
;(function () {
  const context = document.querySelector('canvas').getContext('2d')

  const score = new BaseComponentWithBorder(
    new Score({
      x: 0,
      y: 0,
      width: 250,
      height: 200,
      context: context
    })
  )

  const tetris = new BaseComponentWithBorder(
    new Tetris({
      x: score.width + 4,
      y: 0,
      width: 600,
      height: 1200,
      context: context
    })
  )

  ;[score, tetris].forEach((component) => component.draw())

  const game = new Game(tetris.component as Tetris, score.component as Score)

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
