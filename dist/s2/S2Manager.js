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
Object.defineProperty(exports, "__esModule", { value: true });
var nodes2ts_1 = require("nodes2ts");
var S2Manager = /** @class */ (function () {
    function S2Manager() {
    }
    S2Manager.generateGeohash = function (geoPoint) {
        var latLng = nodes2ts_1.S2LatLng.fromDegrees(geoPoint.latitude, geoPoint.longitude);
        var cell = nodes2ts_1.S2Cell.fromLatLng(latLng);
        var cellId = cell.id;
        return cellId.id;
    };
    S2Manager.generateHashKey = function (geohash, hashKeyLength) {
        if (geohash.lessThan(0)) {
            // Counteract "-" at beginning of geohash.
            hashKeyLength++;
        }
        var geohashString = geohash.toString(10);
        var denominator = Math.pow(10, geohashString.length - hashKeyLength);
        return geohash.divide(denominator);
    };
    return S2Manager;
}());
exports.S2Manager = S2Manager;
