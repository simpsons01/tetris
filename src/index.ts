import { Tetris } from './component/tetris/Tetris'
import { Game } from './component/game'
;(function () {
  // const canvasContainer = document.querySelector('#canvas-container')
  // for (let i = 0; i < 20; i++) {
  //   for (let k = 0; k < 10; k++) {
  //     const block = document.createElement('div')
  //     block.className = 'block'
  //     canvasContainer.appendChild(block)
  //   }
  // }
  const game = new Game(new Tetris())

  game.nextRound()

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
