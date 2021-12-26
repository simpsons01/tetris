import { Tertis } from "./component/tertis/index";
import { Canvas, BlcokDistance } from "./enum";

(function() {
  const canvasContainer = document.querySelector("#canvas-container")
  for(let i = 0; i < Canvas.Height / BlcokDistance; i++) {
    for(let k = 0; k < Canvas.Width / BlcokDistance; k++) {
      const block = document.createElement("div")
      block.className = "block"
      canvasContainer.appendChild(block)
    }
  }
  const tertis = new Tertis()
  tertis.next()
})()