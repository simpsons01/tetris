import { Tetris } from './component/tetris/Tetris'
import { Game } from './component/game'
import { Score } from './component/score'
;(function () {
  // const canvasContainer = document.querySelector('#canvas-container')
  // for (let i = 0; i < 20; i++) {
  //   for (let k = 0; k < 10; k++) {
  //     const block = document.createElement('div')
  //     block.className = 'block'
  //     canvasContainer.appendChild(block)
  //   }
  // }
  const context = document.querySelector('canvas').getContext('2d')
  const game = new Game(new Tetris(context), new Score(context))

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
