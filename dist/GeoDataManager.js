"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var DynamoDBManager_1 = require("./dynamodb/DynamoDBManager");
var S2Manager_1 = require("./s2/S2Manager");
var S2Util_1 = require("./s2/S2Util");
var nodes2ts_1 = require("nodes2ts");
var Covering_1 = require("./model/Covering");
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
var GeoDataManager = /** @class */ (function () {
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
    function GeoDataManager(config) {
        this.config = config;
        this.dynamoDBManager = new DynamoDBManager_1.DynamoDBManager(this.config);
    }
    /**
     * <p>
     * Return GeoDataManagerConfiguration. The returned GeoDataManagerConfiguration should not be modified.
     * </p>
     *
     * @return
     *         GeoDataManagerConfiguration that is used to configure this GeoDataManager.
     */
    GeoDataManager.prototype.getGeoDataManagerConfiguration = function () {
        return this.config;
    };
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
    GeoDataManager.prototype.putPoint = function (putPointInput) {
        return this.dynamoDBManager.putPoint(putPointInput);
    };
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
    GeoDataManager.prototype.batchWritePoints = function (putPointInputs) {
        return this.dynamoDBManager.batchWritePoints(putPointInputs);
    };
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
    GeoDataManager.prototype.getPoint = function (getPointInput) {
        return this.dynamoDBManager.getPoint(getPointInput);
    };
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
    GeoDataManager.prototype.queryRectangle = function (queryRectangleInput) {
        return __awaiter(this, void 0, void 0, function () {
            var latLngRect, covering, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        latLngRect = S2Util_1.S2Util.latLngRectFromQueryRectangleInput(queryRectangleInput);
                        covering = new Covering_1.Covering(new this.config.S2RegionCoverer().getCoveringCells(latLngRect));
                        return [4 /*yield*/, this.dispatchQueries(covering, queryRectangleInput)];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, this.filterByRectangle(results, queryRectangleInput)];
                }
            });
        });
    };
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
    GeoDataManager.prototype.queryRadius = function (queryRadiusInput) {
        return __awaiter(this, void 0, void 0, function () {
            var latLngRect, covering, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        latLngRect = S2Util_1.S2Util.getBoundingLatLngRectFromQueryRadiusInput(queryRadiusInput);
                        covering = new Covering_1.Covering(new this.config.S2RegionCoverer().getCoveringCells(latLngRect));
                        return [4 /*yield*/, this.dispatchQueries(covering, queryRadiusInput)];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, this.filterByRadius(results, queryRadiusInput)];
                }
            });
        });
    };
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
    GeoDataManager.prototype.updatePoint = function (updatePointInput) {
        return this.dynamoDBManager.updatePoint(updatePointInput);
    };
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
    GeoDataManager.prototype.deletePoint = function (deletePointInput) {
        return this.dynamoDBManager.deletePoint(deletePointInput);
    };
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
    GeoDataManager.prototype.dispatchQueries = function (covering, geoQueryInput) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, results, mergedResults;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = covering.getGeoHashRanges(this.config.hashKeyLength).map(function (range) {
                            var hashKey = S2Manager_1.S2Manager.generateHashKey(range.rangeMin, _this.config.hashKeyLength);
                            return _this.dynamoDBManager.queryGeohash(geoQueryInput.QueryInput, hashKey, range);
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        results = _a.sent();
                        mergedResults = [];
                        results.forEach(function (queryOutputs) { return queryOutputs.forEach(function (queryOutput) { return mergedResults.push.apply(mergedResults, queryOutput.Items); }); });
                        return [2 /*return*/, mergedResults];
                }
            });
        });
    };
    /**
     * Filter out any points outside of the queried area from the input list.
     *
     * @param list
     * @param geoQueryInput
     * @returns DynamoDB.ItemList
     */
    GeoDataManager.prototype.filterByRadius = function (list, geoQueryInput) {
        var _this = this;
        var centerLatLng = null;
        var radiusInMeter = 0;
        var centerPoint = geoQueryInput.CenterPoint;
        centerLatLng = nodes2ts_1.S2LatLng.fromDegrees(centerPoint.latitude, centerPoint.longitude);
        radiusInMeter = geoQueryInput.RadiusInMeter;
        return list.filter(function (item) {
            var geoJson = item[_this.config.geoJsonAttributeName].S;
            var coordinates = JSON.parse(geoJson).coordinates;
            var longitude = coordinates[_this.config.longitudeFirst ? 0 : 1];
            var latitude = coordinates[_this.config.longitudeFirst ? 1 : 0];
            var latLng = nodes2ts_1.S2LatLng.fromDegrees(latitude, longitude);
            return centerLatLng.getEarthDistance(latLng).toNumber() <= radiusInMeter;
        });
    };
    /**
     * Filter out any points outside of the queried area from the input list.
     *
     * @param list
     * @param geoQueryInput
     * @returns DynamoDB.ItemList
     */
    GeoDataManager.prototype.filterByRectangle = function (list, geoQueryInput) {
        var _this = this;
        var latLngRect = S2Util_1.S2Util.latLngRectFromQueryRectangleInput(geoQueryInput);
        return list.filter(function (item) {
            var geoJson = item[_this.config.geoJsonAttributeName].S;
            var coordinates = JSON.parse(geoJson).coordinates;
            var longitude = coordinates[_this.config.longitudeFirst ? 0 : 1];
            var latitude = coordinates[_this.config.longitudeFirst ? 1 : 0];
            var latLng = nodes2ts_1.S2LatLng.fromDegrees(latitude, longitude);
            return latLngRect.containsLL(latLng);
        });
    };
    return GeoDataManager;
}());
exports.GeoDataManager = GeoDataManager;
