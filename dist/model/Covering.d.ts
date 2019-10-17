import { S2CellId } from "nodes2ts";
import { GeohashRange } from "./GeohashRange";
export declare class Covering {
    private cellIds;
    constructor(cellIds: S2CellId[]);
    getGeoHashRanges(hashKeyLength: number): GeohashRange[];
    getNumberOfCells(): number;
}
