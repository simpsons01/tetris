import { Tetris } from './component/tetris/index'
import { PolyominoShape } from './enum'
;(function () {
  const canvasContainer = document.querySelector('#canvas-container')
  for (let i = 0; i < 20; i++) {
    for (let k = 0; k < 10; k++) {
      const block = document.createElement('div')
      block.className = 'block'
      canvasContainer.appendChild(block)
    }
  }
  const tetris = new Tetris()
  tetris.draw();
  tetris.next()

  window.addEventListener('keydown', function (e) {
    if (e.keyCode === 37) {
      tetris.movePolyominoLeft()
    }if (e.keyCode === 39) {
      tetris.movePolyominoRight()
    } else if (e.keyCode === 40) {
      tetris.closeAutoFall()
      tetris.movePolyominoDown()
    }
  })
  window.addEventListener('keyup', function (e) {
    if (e.keyCode === 38) {
      tetris.changePolyominoShape()
    }else if (e.keyCode === 40) {
      tetris.startAutoFall()
    }
  })
  //@ts-ignore
  window.t = tetris
})()
