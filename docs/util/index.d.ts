export declare const useInterval: (action: Function, interval?: number, count?: number, immediate?: boolean, ...args: Array<any>) => Promise<void>;
export declare const deepColne: <T = any>(val: T) => T;
export declare const getKeys: <U extends object, T extends keyof U>(obj: U) => T[];
export declare const getKeyValue: <U extends object, T extends keyof U>(obj: U, key: T) => any;
export declare const isNil: (value: any) => boolean;
declare abstract class Timer {
    sec: number;
    overwritAble: boolean;
    timer: null | number;
    action: null | Function;
    constructor(sec: number, isOverwritAble?: boolean);
    abstract create(): void;
    abstract start(cb: Function, ...args: Array<any>): void;
    abstract continue(): void;
    abstract close(): void;
}
export declare class IntervalTimer extends Timer {
    create(): void;
    start(cb: Function, ...args: Array<any>): void;
    continue(): void;
    close(): void;
}
export declare class CountDownTimer extends Timer {
    leftsec: number;
    constructor(sec: number, isOverwritAble?: boolean);
    create(): void;
    start(cb: Function, ...args: Array<any>): void;
    continue(): void;
    close(): void;
}
export {};
