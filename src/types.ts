import { CubeRenderShape } from "./enum";

export interface ICubeCoordinate {
  x: number
  y: number
}

export type ICubeCoordinateList =  Array<ICubeCoordinate>

export interface ICubeShapeConifg {
  [CubeRenderShape.First]: ICubeCoordinateList
  [CubeRenderShape.Second]: ICubeCoordinateList
  [CubeRenderShape.Third]: ICubeCoordinateList
  [CubeRenderShape.Forth]: ICubeCoordinateList
}

export interface ICubeRenderConfg {
  strokeColor: string
  fillColor: string
}
