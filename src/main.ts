import { Tetris } from "./component/tetris/index";

(function() {
  const tetris = new Tetris()
  tetris.createPolyomino()
  tetris.draw()
  window.addEventListener("keydown", function(e) {
    if(e.keyCode === 37) {
      console.log('on keyleft press')
      tetris.movePolyominoLeft()

    }else if(e.keyCode === 39) {
      console.log('on keyRight press')
      tetris.movePolyominoRight()

    }else if(e.keyCode === 40) {
      console.log('on keyDown press')
      tetris.movePolyominoDown()
    }
  })
  // @ts-ignore
  window.t = tetris
})()