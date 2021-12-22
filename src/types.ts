import { CubeRenderShape, BlockState } from "./enum";

export interface ICubeCoordinate {
  x: number
  y: number
}

export type ICubeCoordinateInfo =  Array<ICubeCoordinate>

export interface ICubeShapeConifg {
  [CubeRenderShape.First]: ICubeCoordinateInfo
  [CubeRenderShape.Second]: ICubeCoordinateInfo
  [CubeRenderShape.Third]: ICubeCoordinateInfo
  [CubeRenderShape.Forth]: ICubeCoordinateInfo
}

export interface ICubeRenderConfg extends ICubeCoordinate {
  strokeColor: string 
  fillColor: string
}

export interface ICubeMove<T = any> {
  left: T
  right: T
  bottom: T
}

export interface IBlock {
  strokeColor: string
  fillColor: string
  state: BlockState
  x: number
  y: number
}
