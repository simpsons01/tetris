import { PolyominoShape, BlockState } from "./enum";

export interface ICoordinate {
  x: number
  y: number
}

export type IPolyominoCoordinate = [
  ICoordinate, 
  ICoordinate, 
  ICoordinate, 
  ICoordinate
]

export interface IPolyominoConfig {
  [PolyominoShape.First]: IPolyominoCoordinate
  [PolyominoShape.Second]: IPolyominoCoordinate
  [PolyominoShape.Third]: IPolyominoCoordinate
  [PolyominoShape.Forth]: IPolyominoCoordinate
}

export interface IPolyominoBlock extends ICoordinate {
  strokeColor: string 
  fillColor: string
}

export interface IDirection<T = any> {
  left: T
  right: T
  bottom: T
}

export interface IBlock extends ICoordinate {
  strokeColor: string
  fillColor: string
  state: BlockState
}
