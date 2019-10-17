import * as Long from 'long';
export declare class GeohashRange {
    rangeMin: Long;
    rangeMax: Long;
    constructor(min: Long | number, max: Long | number);
    tryMerge(range: GeohashRange): boolean;
    trySplit(hashKeyLength: any): GeohashRange[];
}
