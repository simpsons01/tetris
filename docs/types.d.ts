import { PolyominoShape, BlockState } from './enum';
export interface ISize {
    width: number;
    height: number;
}
export interface ICoordinate {
    x: number;
    y: number;
}
export interface IRender {
    strokeColor: string;
    fillColor: string;
}
export interface IPolyominoCoordinate {
    anchorIndex: number;
    coordinate: [ICoordinate, ICoordinate, ICoordinate, ICoordinate];
}
export interface IPolyominoCoordinateConfig {
    [PolyominoShape.First]: IPolyominoCoordinate;
    [PolyominoShape.Second]: IPolyominoCoordinate;
    [PolyominoShape.Third]: IPolyominoCoordinate;
    [PolyominoShape.Forth]: IPolyominoCoordinate;
}
export interface IPolyominoBlock extends ICoordinate, IRender {
}
export interface IDirection<T = any> {
    left: T;
    right: T;
    bottom: T;
    top: T;
}
export interface IBlock extends ICoordinate, IRender {
    state: BlockState;
}
export interface IBaseCanvas extends ISize {
    context: CanvasRenderingContext2D;
    draw(): void;
}
export interface IBaseComponent extends ICoordinate, ISize {
    baseCanvasConstructor: {
        new (config: Pick<IBaseCanvas, 'context' | 'width' | 'height'>): IBaseCanvas;
    };
    mount(): IBaseCanvas;
}
