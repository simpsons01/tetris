import { IBaseComponent, IBaseCanvas } from './../../types';
export declare class BaseCanvas implements IBaseCanvas {
    width: number;
    height: number;
    context: CanvasRenderingContext2D;
    constructor(config: Pick<IBaseCanvas, 'context' | 'width' | 'height'>);
    draw(): void;
}
export declare class BaseComponent implements IBaseComponent {
    x: number;
    y: number;
    width: number;
    height: number;
    baseCanvasConstructor: IBaseComponent['baseCanvasConstructor'];
    constructor(config: Pick<IBaseComponent, 'x' | 'y' | 'width' | 'height' | 'baseCanvasConstructor'>);
    static borders: number;
    static borderWidth: number;
    mount(): IBaseCanvas;
}
