import { LineUp } from '../lineUp/lineUp';
import { Score } from '../score';
import { Tetris } from './../tetris/Tetris';
export declare class Game {
    private tetris;
    private score;
    private lineUp;
    isPending: boolean;
    constructor(tetris: Tetris, score: Score, lineUp: LineUp);
    onPolyominCoordinateChange(): void;
    movePolyominoRight(): void;
    movePolyominoLeft(): void;
    movePolyominoDown(): void;
    movePolyominoQuick(): void;
    changePolyominoShape(): void;
    startPolyominoAutoFall(): void;
    closePolyominoAutoFall(): void;
    startNextRoundCountDownTimer(): void;
    closeNextRoundCountDownTimer(): void;
    startNextRoundTimer(): void;
    closeNextRoundTimer(): void;
    beforeNextRound(): Promise<unknown>;
    nextRound(): void;
    isGameOver(): boolean;
    start(): void;
    pause(): void;
}
