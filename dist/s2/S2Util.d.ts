import { QueryRadiusInput, QueryRectangleInput } from "../types";
import { S2LatLngRect } from "nodes2ts";
export declare class S2Util {
    static latLngRectFromQueryRectangleInput(geoQueryRequest: QueryRectangleInput): S2LatLngRect;
    static getBoundingLatLngRectFromQueryRadiusInput(geoQueryRequest: QueryRadiusInput): S2LatLngRect;
}
