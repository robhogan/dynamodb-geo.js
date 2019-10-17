import { GeoDataManagerConfiguration } from "../GeoDataManagerConfiguration";
import { AWSError, DynamoDB, Request } from "aws-sdk";
import { BatchWritePointOutput, DeletePointInput, DeletePointOutput, GetPointInput, GetPointOutput, PutPointInput, PutPointOutput, UpdatePointInput, UpdatePointOutput } from "../types";
import { GeohashRange } from "../model/GeohashRange";
import * as Long from "long";
export declare class DynamoDBManager {
    private config;
    constructor(config: GeoDataManagerConfiguration);
    /**
     * Query Amazon DynamoDB
     *
     * @param queryInput
     * @param hashKey
     *            Hash key for the query request.
     *
     * @param range
     *            The range of geohashs to query.
     *
     * @return The query result.
     */
    queryGeohash(queryInput: DynamoDB.QueryInput | undefined, hashKey: Long, range: GeohashRange): Promise<DynamoDB.QueryOutput[]>;
    getPoint(getPointInput: GetPointInput): Request<GetPointOutput, AWSError>;
    putPoint(putPointInput: PutPointInput): Request<PutPointOutput, AWSError>;
    batchWritePoints(putPointInputs: PutPointInput[]): Request<BatchWritePointOutput, AWSError>;
    updatePoint(updatePointInput: UpdatePointInput): Request<UpdatePointOutput, AWSError>;
    deletePoint(deletePointInput: DeletePointInput): Request<DeletePointOutput, AWSError>;
}
