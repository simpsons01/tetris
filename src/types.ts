import { PolyominoShape, BlockState } from "./enum";

export interface ICoordinate {
  x: number
  y: number
}

export interface IRender {
  strokeColor: string,
  fillColor: string
}

export interface IPolyominoCoordinate {
  anchorIndex: number
  coordinate: [
    ICoordinate, 
    ICoordinate, 
    ICoordinate, 
    ICoordinate
  ]
}

export interface IPolyominoCoordinateConfig {
  [PolyominoShape.First]: IPolyominoCoordinate
  [PolyominoShape.Second]: IPolyominoCoordinate
  [PolyominoShape.Third]: IPolyominoCoordinate
  [PolyominoShape.Forth]: IPolyominoCoordinate
}

export interface IPolyominoBlock extends ICoordinate, IRender {}

export interface IDirection<T = any> {
  left: T
  right: T
  bottom: T
}

export interface IBlock extends ICoordinate, IRender {
  state: BlockState
}
