import { Tetris } from "./component/tetris/index";
import { Canvas, BlcokDistance } from "./enum";

(function() {
  const tetris = new Tetris()
  tetris.createPolyomino()
  tetris.draw()
  window.addEventListener("keydown", function(e) {
    if(e.keyCode === 37) {
      tetris.movePolyominoLeft()
    }else if(e.keyCode === 39) {
      tetris.movePolyominoRight()
    }else if(e.keyCode === 40) {
      tetris.movePolyominoDown()
    }
  })
  // @ts-ignore
  window.t = tertis
})()