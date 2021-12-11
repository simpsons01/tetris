import { CubeRenderShape } from "./enum";

export interface ICubePosition {
  x: number
  y: number
}

export type ICubePositionList =  Array<ICubePosition>

export interface ICubeShapeConifg {
  [CubeRenderShape.First]: ICubePositionList
  [CubeRenderShape.Second]: ICubePositionList
  [CubeRenderShape.Third]: ICubePositionList
  [CubeRenderShape.Forth]: ICubePositionList
}

export interface ICubeRenderConfg {
  strokeColor: string
  fillColor: string
}
