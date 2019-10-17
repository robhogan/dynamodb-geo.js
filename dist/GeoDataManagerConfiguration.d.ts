import { DynamoDB } from "aws-sdk";
import { S2RegionCoverer } from "nodes2ts";
export declare class GeoDataManagerConfiguration {
    static MERGE_THRESHOLD: number;
    tableName: string;
    consistentRead: boolean;
    hashKeyAttributeName: string;
    rangeKeyAttributeName: string;
    geohashAttributeName: string;
    geoJsonAttributeName: string;
    geohashIndexName: string;
    hashKeyLength: number;
    /**
     * The order of the GeoJSON coordinate pair in data.
     * Use false [lat, lon] for compatibility with the Java library https://github.com/awslabs/dynamodb-geo
     * Use true [lon, lat] for GeoJSON standard compliance. (default)
     *
     * Note that this value should match the state of your existing data - if you change it you must update your database manually
     *
     * @type {boolean}
     */
    longitudeFirst: boolean;
    /**
     * The value of the 'type' attribute in recorded GeoJSON points. Should normally be 'Point', which is standards compliant.
     *
     * Use 'POINT' for compatibility with the Java library https://github.com/awslabs/dynamodb-geo
     *
     * This setting is only relevant for writes. This library doesn't inspect or set this value when reading/querying.
     *
     * @type {string}
     */
    geoJsonPointType: 'Point' | 'POINT';
    dynamoDBClient: DynamoDB;
    S2RegionCoverer: typeof S2RegionCoverer;
    constructor(dynamoDBClient: any, tableName: string);
}
