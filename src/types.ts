import { CubeRenderDirection } from "./enum";

export interface ICubePosition {
  x: number
  y: number
}

export type ICubePositionList = [ICubePosition, ICubePosition, ICubePosition, ICubePosition]

export interface ICubePositionConifg {
  [CubeRenderDirection.Up]: ICubePositionList
  [CubeRenderDirection.Down]: ICubePositionList
  [CubeRenderDirection.Left]: ICubePositionList
  [CubeRenderDirection.Right]: ICubePositionList
}

export interface ICubeRenderConfg {
  x: number
  y: number
  strokeColor?: string
  fillColor?: string,
  direction?: CubeRenderDirection
}

export interface IBasCube {
  context: undefined | CanvasRenderingContext2D 
  positionConfig: undefined | ICubePositionConifg

  render(renderConfig: ICubeRenderConfg): void
}

