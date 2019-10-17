import * as Long from 'long';
export declare class GeohashRange {
    rangeMin: Long;
    rangeMax: Long;
    constructor(min: Long, max: Long);
    tryMerge(range: GeohashRange): boolean;
    trySplit(hashKeyLength: any): GeohashRange[];
}
