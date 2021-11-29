import { IBasCube, ICubePosition, ICubePositionConifg, ICubeRenderConfg } from "./types" 
import { CubeRenderDirection } from "./enum";

class BaseCube implements IBasCube {
  positionConfig: ICubePositionConifg
  context: CanvasRenderingContext2D

  static Basic = {
    CubeNumber: 4,
    CubeWidth: 30,
    CubeHeight: 30,
    CubeDistance: 30
  }

  constructor(
    positionConfig: ICubePositionConifg,
    context: CanvasRenderingContext2D,
    renderConfig: ICubeRenderConfg
  ) {
    this.context = context
    this.positionConfig = positionConfig
    this.render(renderConfig)
  }

  render(renderConfig: ICubeRenderConfg) {
    const { 
      x, 
      y, 
      strokeColor = "#fff", 
      fillColor = "#fff", 
      direction = CubeRenderDirection.Up 
    } = renderConfig

    for (let i = 0; i < BaseCube.Basic.CubeNumber; i += 1) {
      const _x = x + this.positionConfig[direction][i].x * BaseCube.Basic.CubeDistance
      const _y = y + this.positionConfig[direction][i].y * BaseCube.Basic.CubeDistance
      this.context.fillStyle = fillColor
      this.context.strokeStyle = strokeColor
      this.context.beginPath();
      this.context.moveTo(_x, _y);
      this.context.lineTo(_x + BaseCube.Basic.CubeWidth, _y);
      this.context.lineTo(_x + BaseCube.Basic.CubeWidth, _y + BaseCube.Basic.CubeHeight);
      this.context.lineTo(_x, _y + BaseCube.Basic.CubeHeight);
      this.context.closePath();
      this.context.stroke();
      this.context.fill()
    }
  }  
}

class A1 extends BaseCube {

  constructor(context: CanvasRenderingContext2D, renderConfig: ICubeRenderConfg) {
    super(
      { 
        [CubeRenderDirection.Up]: [
          { x: 0, y: 0 },
          { x: 0, y: -1 },
          { x: 1, y: 0 },
          { x: 2, y: 0 }
        ],
        [CubeRenderDirection.Down]: [  
          { x: 0, y: 0 },
          { x: 0, y: -1 },
          { x: 1, y: 0 },
          { x: 2, y: 0 }
        ],
        [CubeRenderDirection.Left]: [
          { x: 0, y: 0 },
          { x: 0, y: -1 },
          { x: 1, y: 0 },
          { x: 2, y: 0 }
        ],
        [CubeRenderDirection.Right]: [
          { x: 0, y: 0 },
          { x: 0, y: -1 },
          { x: 1, y: 0 },
          { x: 2, y: 0 }
        ]
      },
      context,
      renderConfig
    )
  }
}



