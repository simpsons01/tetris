import { BasePolyomino, PolyominoFactory } from '../polyomino';
import { BaseCanvas } from '../base';
import { IBaseCanvas } from '../../types';
export declare class LineUp extends BaseCanvas {
    static types: string[];
    static lineLimit: number;
    polyominoFactory: PolyominoFactory;
    list: Array<{
        polyomino: null | BasePolyomino;
        type: null | string;
    }>;
    constructor(config: Pick<IBaseCanvas, 'context' | 'width' | 'height'>);
    get first(): BasePolyomino;
    ramdomCreate(): {
        type: string;
        polyomino: BasePolyomino;
    };
    init(): void;
    next(): void;
    draw(): void;
}
