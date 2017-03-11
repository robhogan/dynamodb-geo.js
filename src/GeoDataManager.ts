/*
 * Copyright 2010-2013 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 * 
 * http://aws.amazon.com/apache2.0
 * 
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import { AWSError, DynamoDB, Request } from "aws-sdk";
import { DynamoDBManager } from "./dynamodb/DynamoDBManager";
import { GeoDataManagerConfiguration } from "./GeoDataManagerConfiguration";
import {
  BatchWritePointOutput,
  DeletePointInput, DeletePointOutput,
  GeoPoint,
  GeoQueryInput,
  GetPointInput, GetPointOutput,
  PutPointInput, PutPointOutput,
  QueryRadiusInput,
  QueryRectangleInput,
  UpdatePointInput, UpdatePointOutput
} from "./types";
import { S2CellId, S2CellUnion, S2LatLng, S2LatLngRect } from "nodes2ts";
import { S2Manager } from "./s2/S2Manager";
import { S2Util } from "./s2/S2Util";
import { GeohashRange } from "./model/GeohashRange";

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
export class GeoDataManager {
  private config: GeoDataManagerConfiguration;
  private dynamoDBManager: DynamoDBManager;

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
  constructor(config: GeoDataManagerConfiguration) {
    this.config = config;
    this.dynamoDBManager = new DynamoDBManager(this.config);
  }

  /**
   * <p>
   * Return GeoDataManagerConfiguration. The returned GeoDataManagerConfiguration should not be modified.
   * </p>
   *
   * @return
   *         GeoDataManagerConfiguration that is used to configure this GeoDataManager.
   */
  public getGeoDataManagerConfiguration() {
    return this.config;
  }

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
  public putPoint(putPointInput: PutPointInput): Request<PutPointOutput, AWSError> {
    return this.dynamoDBManager.putPoint(putPointInput);
  }

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
  public batchWritePoints(putPointInputs: PutPointInput[]): Request<BatchWritePointOutput, AWSError> {
    return this.dynamoDBManager.batchWritePoints(putPointInputs);
  }

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
  public getPoint(getPointInput: GetPointInput): Request<GetPointOutput, AWSError> {
    return this.dynamoDBManager.getPoint(getPointInput);
  }

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
   * @param queryRectangleRequest
   *            Container for the necessary parameters to execute rectangle query request.
   *
   * @return Result of rectangle query request.
   */
  public queryRectangle(queryRectangleInput: QueryRectangleInput): Promise<DynamoDB.ItemList[]>[] {
    const latLngRect: S2LatLngRect = S2Util.getBoundingLatLngRect(queryRectangleInput);

    const cellUnion: S2CellUnion = S2Manager.findCellIds(latLngRect);

    const ranges = this.mergeCells(cellUnion);

    return this.dispatchQueries(ranges, queryRectangleInput);
  }

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
   * @param queryRadiusRequest
   *            Container for the necessary parameters to execute radius query request.
   *
   * @return Result of radius query request.
   * */
  public queryRadius(queryRadiusInput: QueryRadiusInput): Promise<DynamoDB.ItemList[]>[] {
    const latLngRect: S2LatLngRect = S2Util.getBoundingLatLngRect(queryRadiusInput);

    const cellUnion: S2CellUnion = S2Manager.findCellIds(latLngRect);

    const ranges = this.mergeCells(cellUnion);

    return this.dispatchQueries(ranges, queryRadiusInput);
  }

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
  public updatePoint(updatePointInput: UpdatePointInput): Request<UpdatePointOutput, AWSError> {
    return this.dynamoDBManager.updatePoint(updatePointInput);
  }

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
  public deletePoint(deletePointInput: DeletePointInput): Request<DeletePointOutput, AWSError> {
    return this.dynamoDBManager.deletePoint(deletePointInput);
  }

  /**
   * Merge continuous cells in cellUnion and return a list of merged GeohashRanges.
   *
   * @param cellUnion
   *            Container for multiple cells.
   *
   * @return A list of merged GeohashRanges.
   */
  private mergeCells(cellUnion: S2CellUnion) {

    const ranges: GeohashRange[] = [];
    let c: S2CellId, range: GeohashRange, wasMerged: boolean;
    for (let i = 0; i < cellUnion.size(); i++) {
      c = cellUnion.cellId(i);
      range = new GeohashRange(c.rangeMin().id, c.rangeMax().id);

      wasMerged = false;
      ranges.forEach(r => {
        if (r.tryMerge(range)) {
          wasMerged = true;
        }
      });

      if (!wasMerged) {
        ranges.push(range);
      }
    }

    return ranges;
  }

  /**
   * Query Amazon DynamoDB in parallel and filter the result.
   *
   * @param ranges
   *            A list of geohash ranges that will be used to query Amazon DynamoDB.
   *
   * @param latLngRect
   *            The rectangle area that will be used as a reference point for precise filtering.
   *
   * @return Aggregated and filtered items returned from Amazon DynamoDB.
   */
  private dispatchQueries(ranges: GeohashRange[], geoQueryInput: GeoQueryInput) {

    const promises: Promise<DynamoDB.ItemList[]>[] = [];

    ranges.forEach(outerRange => {
      outerRange.trySplit(this.config.hashKeyLength).forEach(range => {
        const hashKey = S2Manager.generateHashKey(range.rangeMin, this.config.hashKeyLength);

        promises.push(this.dynamoDBManager.queryGeohash(geoQueryInput, hashKey, range).then(queryResults =>
          queryResults.map(queryResult => this.filter(queryResult.Items, geoQueryInput))
        ));
      })
    });

    return promises;
  }

  /**
   * Filter out any points outside of the queried area from the input list.
   *
   * @param list
   *            List of items return by Amazon DynamoDB. It may contains points outside of the actual area queried.
   *
   * @param geoQueryInput
   *            Queried area. Any points outside of this area need to be discarded.
   *
   * @return List of items within the queried area.
   */
  private filter(list: DynamoDB.ItemList, geoQueryInput: GeoQueryInput): DynamoDB.ItemList {

    const result: DynamoDB.ItemList = [];

    let latLngRect: S2LatLngRect = null;
    let centerLatLng: S2LatLng = null;
    let radiusInMeter = 0;
    if (geoQueryInput.hasOwnProperty('MinPoint')) {
      latLngRect = S2Util.getBoundingLatLngRect(geoQueryInput);
    } else if (geoQueryInput.hasOwnProperty('Radius')) {
      const centerPoint: GeoPoint = (geoQueryInput as QueryRadiusInput).CenterPoint;
      centerLatLng = S2LatLng.fromDegrees(centerPoint.latitude, centerPoint.longitude);
      radiusInMeter = (geoQueryInput as QueryRadiusInput).RadiusInMeter;
    }


    list.forEach(item => {
      const geoJson: string = item[this.config.geoJsonAttributeName].S;
      const coordinates = JSON.parse(geoJson).coordinates;
      const longitude = coordinates[this.config.longitudeFirst ? 0 : 1];
      const latitude = coordinates[this.config.longitudeFirst ? 1 : 0];

      const latLng: S2LatLng = S2LatLng.fromDegrees(latitude, longitude);
      if (latLngRect != null && latLngRect.containsLL(latLng)) {
        result.push(item);
      } else if (centerLatLng != null && radiusInMeter > 0
        && (centerLatLng.getEarthDistance(latLng) as any).toNumber() <= radiusInMeter) {
        result.push(item);
      }
    });

    return result;
  }
}
