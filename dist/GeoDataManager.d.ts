import { AWSError, DynamoDB, Request } from "aws-sdk";
import { GeoDataManagerConfiguration } from "./GeoDataManagerConfiguration";
import { BatchWritePointOutput, DeletePointInput, DeletePointOutput, GetPointInput, GetPointOutput, PutPointInput, PutPointOutput, QueryRadiusInput, QueryRectangleInput, UpdatePointInput, UpdatePointOutput } from "./types";
/**
 * <p>
 * Manager to hangle geo spatial data in Amazon DynamoDB tables. All service calls made using this client are blocking,
 * and will not return until the service call completes.
 * </p>
 * <p>
 * This class is designed to be thread safe; however, once constructed GeoDataManagerConfiguration should not be
 * modified. Modifying GeoDataManagerConfiguration may cause unspecified behaviors.
 * </p>
 * */
export declare class GeoDataManager {
    private config;
    private dynamoDBManager;
    /**
     * <p>
     * Construct and configure GeoDataManager using GeoDataManagerConfiguration.
     * </p>
     * <b>Sample usage:</b>
     *
     * <pre>
     * AmazonDynamoDBClient ddb = new AmazonDynamoDBClient(new ClasspathPropertiesFileCredentialsProvider());
     * Region usWest2 = Region.getRegion(Regions.US_WEST_2);
     * ddb.setRegion(usWest2);
     *
     * ClientConfiguration clientConfiguration = new ClientConfiguration().withMaxErrorRetry(5);
     * ddb.setConfiguration(clientConfiguration);
     *
     * GeoDataManagerConfiguration config = new GeoDataManagerConfiguration(ddb, &quot;geo-table&quot;);
     * GeoDataManager geoDataManager = new GeoDataManager(config);
     * </pre>
     *
     * @param config
     *            Container for the configuration parameters for GeoDataManager.
     */
    constructor(config: GeoDataManagerConfiguration);
    /**
     * <p>
     * Return GeoDataManagerConfiguration. The returned GeoDataManagerConfiguration should not be modified.
     * </p>
     *
     * @return
     *         GeoDataManagerConfiguration that is used to configure this GeoDataManager.
     */
    getGeoDataManagerConfiguration(): GeoDataManagerConfiguration;
    /**
     * <p>
     * Put a point into the Amazon DynamoDB table. Once put, you cannot update attributes specified in
     * GeoDataManagerConfiguration: hash key, range key, geohash and geoJson. If you want to update these columns, you
     * need to insert a new record and delete the old record.
     * </p>
     * <b>Sample usage:</b>
     *
     * <pre>
     * GeoPoint geoPoint = new GeoPoint(47.5, -122.3);
     * AttributeValue rangeKeyValue = new AttributeValue().withS(&quot;a6feb446-c7f2-4b48-9b3a-0f87744a5047&quot;);
     * AttributeValue titleValue = new AttributeValue().withS(&quot;Original title&quot;);
     *
     * PutPointRequest putPointRequest = new PutPointRequest(geoPoint, rangeKeyValue);
     * putPointRequest.getPutItemRequest().getItem().put(&quot;title&quot;, titleValue);
     *
     * PutPointResult putPointResult = geoDataManager.putPoint(putPointRequest);
     * </pre>
     *
     * @param putPointInput
     *            Container for the necessary parameters to execute put point request.
     *
     * @return Result of put point request.
     */
    putPoint(putPointInput: PutPointInput): Request<PutPointOutput, AWSError>;
    /**
     * <p>
     * Put a list of points into the Amazon DynamoDB table. Once put, you cannot update attributes specified in
     * GeoDataManagerConfiguration: hash key, range key, geohash and geoJson. If you want to update these columns, you
     * need to insert a new record and delete the old record.
     * </p>
     * <b>Sample usage:</b>
     *
     * <pre>
     * GeoPoint geoPoint = new GeoPoint(47.5, -122.3);
     * AttributeValue rangeKeyValue = new AttributeValue().withS(&quot;a6feb446-c7f2-4b48-9b3a-0f87744a5047&quot;);
     * AttributeValue titleValue = new AttributeValue().withS(&quot;Original title&quot;);
     *
     * PutPointRequest putPointRequest = new PutPointRequest(geoPoint, rangeKeyValue);
     * putPointRequest.getPutItemRequest().getItem().put(&quot;title&quot;, titleValue);
     * List<PutPointRequest> putPointRequests = new ArrayList<PutPointRequest>();
     * putPointRequests.add(putPointRequest);
     * BatchWritePointResult batchWritePointResult = geoDataManager.batchWritePoints(putPointRequests);
     * </pre>
     *
     * @param putPointInputs
     *            Container for the necessary parameters to execute put point request.
     *
     * @return Result of batch put point request.
     */
    batchWritePoints(putPointInputs: PutPointInput[]): Request<BatchWritePointOutput, AWSError>;
    /**
     * <p>
     * Get a point from the Amazon DynamoDB table.
     * </p>
     * <b>Sample usage:</b>
     *
     * <pre>
     * GeoPoint geoPoint = new GeoPoint(47.5, -122.3);
     * AttributeValue rangeKeyValue = new AttributeValue().withS(&quot;a6feb446-c7f2-4b48-9b3a-0f87744a5047&quot;);
     *
     * GetPointRequest getPointRequest = new GetPointRequest(geoPoint, rangeKeyValue);
     * GetPointResult getPointResult = geoIndexManager.getPoint(getPointRequest);
     *
     * System.out.println(&quot;item: &quot; + getPointResult.getGetItemResult().getItem());
     * </pre>
     *
     * @param getPointInput
     *            Container for the necessary parameters to execute get point request.
     *
     * @return Result of get point request.
     * */
    getPoint(getPointInput: GetPointInput): Request<GetPointOutput, AWSError>;
    /**
     * <p>
     * Query a rectangular area constructed by two points and return all points within the area. Two points need to
     * construct a rectangle from minimum and maximum latitudes and longitudes. If minPoint.getLongitude() >
     * maxPoint.getLongitude(), the rectangle spans the 180 degree longitude line.
     * </p>
     * <b>Sample usage:</b>
     *
     * <pre>
     * GeoPoint minPoint = new GeoPoint(45.5, -124.3);
     * GeoPoint maxPoint = new GeoPoint(49.5, -120.3);
     *
     * QueryRectangleRequest queryRectangleRequest = new QueryRectangleRequest(minPoint, maxPoint);
     * QueryRectangleResult queryRectangleResult = geoIndexManager.queryRectangle(queryRectangleRequest);
     *
     * for (Map&lt;String, AttributeValue&gt; item : queryRectangleResult.getItem()) {
     * 	System.out.println(&quot;item: &quot; + item);
     * }
     * </pre>
     *
     * @param queryRectangleInput
     *            Container for the necessary parameters to execute rectangle query request.
     *
     * @return Result of rectangle query request.
     */
    queryRectangle(queryRectangleInput: QueryRectangleInput): Promise<DynamoDB.ItemList>;
    /**
     * <p>
     * Query a circular area constructed by a center point and its radius.
     * </p>
     * <b>Sample usage:</b>
     *
     * <pre>
     * GeoPoint centerPoint = new GeoPoint(47.5, -122.3);
     *
     * QueryRadiusRequest queryRadiusRequest = new QueryRadiusRequest(centerPoint, 100);
     * QueryRadiusResult queryRadiusResult = geoIndexManager.queryRadius(queryRadiusRequest);
     *
     * for (Map&lt;String, AttributeValue&gt; item : queryRadiusResult.getItem()) {
     * 	System.out.println(&quot;item: &quot; + item);
     * }
     * </pre>
     *
     * @param queryRadiusInput
     *            Container for the necessary parameters to execute radius query request.
     *
     * @return Result of radius query request.
     * */
    queryRadius(queryRadiusInput: QueryRadiusInput): Promise<DynamoDB.ItemList>;
    /**
     * <p>
     * Update a point data in Amazon DynamoDB table. You cannot update attributes specified in
     * GeoDataManagerConfiguration: hash key, range key, geohash and geoJson. If you want to update these columns, you
     * need to insert a new record and delete the old record.
     * </p>
     * <b>Sample usage:</b>
     *
     * <pre>
     * GeoPoint geoPoint = new GeoPoint(47.5, -122.3);
     *
     * String rangeKey = &quot;a6feb446-c7f2-4b48-9b3a-0f87744a5047&quot;;
     * AttributeValue rangeKeyValue = new AttributeValue().withS(rangeKey);
     *
     * UpdatePointRequest updatePointRequest = new UpdatePointRequest(geoPoint, rangeKeyValue);
     *
     * AttributeValue titleValue = new AttributeValue().withS(&quot;Updated title.&quot;);
     * AttributeValueUpdate titleValueUpdate = new AttributeValueUpdate().withAction(AttributeAction.PUT)
     *    .withValue(titleValue);
     * updatePointRequest.getUpdateItemRequest().getAttributeUpdates().put(&quot;title&quot;, titleValueUpdate);
     *
     * UpdatePointResult updatePointResult = geoIndexManager.updatePoint(updatePointRequest);
     * </pre>
     *
     * @param updatePointInput
     *            Container for the necessary parameters to execute update point request.
     *
     * @return Result of update point request.
     */
    updatePoint(updatePointInput: UpdatePointInput): Request<UpdatePointOutput, AWSError>;
    /**
     * <p>
     * Delete a point from the Amazon DynamoDB table.
     * </p>
     * <b>Sample usage:</b>
     *
     * <pre>
     * GeoPoint geoPoint = new GeoPoint(47.5, -122.3);
     *
     * String rangeKey = &quot;a6feb446-c7f2-4b48-9b3a-0f87744a5047&quot;;
     * AttributeValue rangeKeyValue = new AttributeValue().withS(rangeKey);
     *
     * DeletePointRequest deletePointRequest = new DeletePointRequest(geoPoint, rangeKeyValue);
     * DeletePointResult deletePointResult = geoIndexManager.deletePoint(deletePointRequest);
     * </pre>
     *
     * @param deletePointInput
     *            Container for the necessary parameters to execute delete point request.
     *
     * @return Result of delete point request.
     */
    deletePoint(deletePointInput: DeletePointInput): Request<DeletePointOutput, AWSError>;
    /**
     * Query Amazon DynamoDB in parallel and filter the result.
     *
     * @param covering
     *            A list of geohash ranges that will be used to query Amazon DynamoDB.
     *
     * @param geoQueryInput
     *            The rectangle area that will be used as a reference point for precise filtering.
     *
     * @return Aggregated and filtered items returned from Amazon DynamoDB.
     */
    private dispatchQueries;
    /**
     * Filter out any points outside of the queried area from the input list.
     *
     * @param list
     * @param geoQueryInput
     * @returns DynamoDB.ItemList
     */
    private filterByRadius;
    /**
     * Filter out any points outside of the queried area from the input list.
     *
     * @param list
     * @param geoQueryInput
     * @returns DynamoDB.ItemList
     */
    private filterByRectangle;
}
