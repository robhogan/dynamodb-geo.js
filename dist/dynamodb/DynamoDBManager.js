"use strict";
/*
 * Copyright 2010-2013 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var S2Manager_1 = require("../s2/S2Manager");
var DynamoDBManager = /** @class */ (function () {
    function DynamoDBManager(config) {
        this.config = config;
    }
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
    DynamoDBManager.prototype.queryGeohash = function (queryInput, hashKey, range) {
        return __awaiter(this, void 0, void 0, function () {
            var queryOutputs, nextQuery;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryOutputs = [];
                        nextQuery = function (lastEvaluatedKey) {
                            if (lastEvaluatedKey === void 0) { lastEvaluatedKey = null; }
                            return __awaiter(_this, void 0, void 0, function () {
                                var keyConditions, minRange, maxRange, defaults, queryOutput;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            keyConditions = {};
                                            keyConditions[this.config.hashKeyAttributeName] = {
                                                ComparisonOperator: "EQ",
                                                AttributeValueList: [{ N: hashKey.toString(10) }]
                                            };
                                            minRange = { N: range.rangeMin.toString(10) };
                                            maxRange = { N: range.rangeMax.toString(10) };
                                            keyConditions[this.config.geohashAttributeName] = {
                                                ComparisonOperator: "BETWEEN",
                                                AttributeValueList: [minRange, maxRange]
                                            };
                                            defaults = {
                                                TableName: this.config.tableName,
                                                KeyConditions: keyConditions,
                                                IndexName: this.config.geohashIndexName,
                                                ConsistentRead: this.config.consistentRead,
                                                ReturnConsumedCapacity: "TOTAL",
                                                ExclusiveStartKey: lastEvaluatedKey
                                            };
                                            return [4 /*yield*/, this.config.dynamoDBClient.query(__assign(__assign({}, defaults), queryInput)).promise()];
                                        case 1:
                                            queryOutput = _a.sent();
                                            queryOutputs.push(queryOutput);
                                            if (queryOutput.LastEvaluatedKey) {
                                                return [2 /*return*/, nextQuery(queryOutput.LastEvaluatedKey)];
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        };
                        return [4 /*yield*/, nextQuery()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, queryOutputs];
                }
            });
        });
    };
    DynamoDBManager.prototype.getPoint = function (getPointInput) {
        var _a;
        var geohash = S2Manager_1.S2Manager.generateGeohash(getPointInput.GeoPoint);
        var hashKey = S2Manager_1.S2Manager.generateHashKey(geohash, this.config.hashKeyLength);
        var getItemInput = getPointInput.GetItemInput;
        getItemInput.TableName = this.config.tableName;
        getItemInput.Key = (_a = {},
            _a[this.config.hashKeyAttributeName] = { N: hashKey.toString(10) },
            _a[this.config.rangeKeyAttributeName] = getPointInput.RangeKeyValue,
            _a);
        return this.config.dynamoDBClient.getItem(getItemInput);
    };
    DynamoDBManager.prototype.putPoint = function (putPointInput) {
        var geohash = S2Manager_1.S2Manager.generateGeohash(putPointInput.GeoPoint);
        var hashKey = S2Manager_1.S2Manager.generateHashKey(geohash, this.config.hashKeyLength);
        var putItemInput = __assign(__assign({}, putPointInput.PutItemInput), { TableName: this.config.tableName, Item: putPointInput.PutItemInput.Item || {} });
        putItemInput.Item[this.config.hashKeyAttributeName] = { N: hashKey.toString(10) };
        putItemInput.Item[this.config.rangeKeyAttributeName] = putPointInput.RangeKeyValue;
        putItemInput.Item[this.config.geohashAttributeName] = { N: geohash.toString(10) };
        putItemInput.Item[this.config.geoJsonAttributeName] = {
            S: JSON.stringify({
                type: this.config.geoJsonPointType,
                coordinates: (this.config.longitudeFirst ?
                    [putPointInput.GeoPoint.longitude, putPointInput.GeoPoint.latitude] :
                    [putPointInput.GeoPoint.latitude, putPointInput.GeoPoint.longitude])
            })
        };
        return this.config.dynamoDBClient.putItem(putItemInput);
    };
    DynamoDBManager.prototype.batchWritePoints = function (putPointInputs) {
        var _a;
        var _this = this;
        var writeInputs = [];
        putPointInputs.forEach(function (putPointInput) {
            var geohash = S2Manager_1.S2Manager.generateGeohash(putPointInput.GeoPoint);
            var hashKey = S2Manager_1.S2Manager.generateHashKey(geohash, _this.config.hashKeyLength);
            var putItemInput = putPointInput.PutItemInput;
            var putRequest = {
                Item: putItemInput.Item || {}
            };
            putRequest.Item[_this.config.hashKeyAttributeName] = { N: hashKey.toString(10) };
            putRequest.Item[_this.config.rangeKeyAttributeName] = putPointInput.RangeKeyValue;
            putRequest.Item[_this.config.geohashAttributeName] = { N: geohash.toString(10) };
            putRequest.Item[_this.config.geoJsonAttributeName] = {
                S: JSON.stringify({
                    type: _this.config.geoJsonPointType,
                    coordinates: (_this.config.longitudeFirst ?
                        [putPointInput.GeoPoint.longitude, putPointInput.GeoPoint.latitude] :
                        [putPointInput.GeoPoint.latitude, putPointInput.GeoPoint.longitude])
                })
            };
            writeInputs.push({ PutRequest: putRequest });
        });
        return this.config.dynamoDBClient.batchWriteItem({
            RequestItems: (_a = {},
                _a[this.config.tableName] = writeInputs,
                _a)
        });
    };
    DynamoDBManager.prototype.updatePoint = function (updatePointInput) {
        var geohash = S2Manager_1.S2Manager.generateGeohash(updatePointInput.GeoPoint);
        var hashKey = S2Manager_1.S2Manager.generateHashKey(geohash, this.config.hashKeyLength);
        updatePointInput.UpdateItemInput.TableName = this.config.tableName;
        if (!updatePointInput.UpdateItemInput.Key) {
            updatePointInput.UpdateItemInput.Key = {};
        }
        updatePointInput.UpdateItemInput.Key[this.config.hashKeyAttributeName] = { N: hashKey.toString(10) };
        updatePointInput.UpdateItemInput.Key[this.config.rangeKeyAttributeName] = updatePointInput.RangeKeyValue;
        // Geohash and geoJson cannot be updated.
        if (updatePointInput.UpdateItemInput.AttributeUpdates) {
            delete updatePointInput.UpdateItemInput.AttributeUpdates[this.config.geohashAttributeName];
            delete updatePointInput.UpdateItemInput.AttributeUpdates[this.config.geoJsonAttributeName];
        }
        return this.config.dynamoDBClient.updateItem(updatePointInput.UpdateItemInput);
    };
    DynamoDBManager.prototype.deletePoint = function (deletePointInput) {
        var _a;
        var geohash = S2Manager_1.S2Manager.generateGeohash(deletePointInput.GeoPoint);
        var hashKey = S2Manager_1.S2Manager.generateHashKey(geohash, this.config.hashKeyLength);
        return this.config.dynamoDBClient.deleteItem(__assign(__assign({}, deletePointInput.DeleteItemInput), { TableName: this.config.tableName, Key: (_a = {},
                _a[this.config.hashKeyAttributeName] = { N: hashKey.toString(10) },
                _a[this.config.rangeKeyAttributeName] = deletePointInput.RangeKeyValue,
                _a) }));
    };
    return DynamoDBManager;
}());
exports.DynamoDBManager = DynamoDBManager;
