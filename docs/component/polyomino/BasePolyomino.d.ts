import { ICoordinate, IPolyominoCoordinateConfig, IPolyominoCoordinate, IRender } from '../../types';
import { PolyominoShape } from '../../enum';
export declare class BasePolyomino {
    coordinateConfig: IPolyominoCoordinateConfig;
    strokeColor: string;
    fillColor: string;
    coordinate: IPolyominoCoordinate['coordinate'];
    shape: PolyominoShape;
    constructor(coordinateConfig: IPolyominoCoordinateConfig, renderConfig: IRender);
    get anchor(): ICoordinate;
    get range(): {
        maxX: number;
        minX: number;
        maxY: number;
        minY: number;
    };
    get info(): {
        strokeColor: string;
        fillColor: string;
        x: number;
        y: number;
    }[];
    calcCoordinateByAnchorandShape(anchor: ICoordinate, shape: PolyominoShape): [ICoordinate, ICoordinate, ICoordinate, ICoordinate];
    calcAnchorByCoordinateAndShape(coordinate: IPolyominoCoordinate['coordinate'], shape: PolyominoShape): ICoordinate;
    calcInfo(coordinate: IPolyominoCoordinate['coordinate']): {
        strokeColor: string;
        fillColor: string;
        x: number;
        y: number;
    }[];
    calcRangeByCoordinate(coordinate: IPolyominoCoordinate['coordinate']): {
        maxX: number;
        minX: number;
        maxY: number;
        minY: number;
    };
    updateCoordinate(coordinate: ICoordinate): [ICoordinate, ICoordinate, ICoordinate, ICoordinate];
    changeShape(shape: PolyominoShape): [ICoordinate, ICoordinate, ICoordinate, ICoordinate];
}
