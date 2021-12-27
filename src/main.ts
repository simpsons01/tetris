import { Tertis } from "./component/tertis/index";
import { Canvas, BlcokDistance } from "./enum";

(function() {
  const tertis = new Tertis()
  tertis.createPolyomino()
  tertis.draw()
  // tertis.next()
  // @ts-ignore
  window.t = tertis
})()