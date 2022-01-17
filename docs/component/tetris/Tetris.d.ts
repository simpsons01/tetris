import { ICoordinate } from './../../types';
import { BasePolyomino } from '../polyomino';
import { Direction } from '../../enum';
import { IBlock, IPolyominoCoordinate, IDirection } from '../../types';
import { BaseCanvas } from '../base';
export declare class Tetris extends BaseCanvas {
    isPending: boolean;
    context: CanvasRenderingContext2D;
    polyomino: null | BasePolyomino;
    data: Array<Array<IBlock>>;
    get _row(): number;
    get _column(): number;
    findBlock(coodrinate: ICoordinate): IBlock;
    getFilledRowInedxList(): number[];
    placePolyominoToCenterTop(): void;
    placePolyominoToPreview(): void;
    setPolyomino(polyomino: BasePolyomino): void;
    resetPolyomino(): void;
    draw(): void;
    clearFilledRow(): Promise<unknown>;
    fillEmptyRow(): Promise<unknown>;
    changePolyominoShape(): boolean;
    syncPolyominoInfoToData(): void;
    getPolyominoPreviewCollideCoordinate(): [ICoordinate, ICoordinate, ICoordinate, ICoordinate];
    getPolyominoCollideStatus(polyominoCoordinate?: IPolyominoCoordinate['coordinate']): IDirection<boolean>;
    movePolyomino(direction: Direction): boolean;
}
