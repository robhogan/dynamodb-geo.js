"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GeoDataManagerConfiguration_1 = require("../GeoDataManagerConfiguration");
var S2Manager_1 = require("../s2/S2Manager");
var Long = require("long");
var GeohashRange = /** @class */ (function () {
    function GeohashRange(min, max) {
        this.rangeMin = min instanceof Long ? min : Long.fromNumber(min);
        this.rangeMax = max instanceof Long ? max : Long.fromNumber(max);
    }
    GeohashRange.prototype.tryMerge = function (range) {
        if (range.rangeMin.subtract(this.rangeMax).lessThanOrEqual(GeoDataManagerConfiguration_1.GeoDataManagerConfiguration.MERGE_THRESHOLD)
            && range.rangeMin.greaterThan(this.rangeMax)) {
            this.rangeMax = range.rangeMax;
            return true;
        }
        if (this.rangeMin.subtract(range.rangeMax).lessThanOrEqual(GeoDataManagerConfiguration_1.GeoDataManagerConfiguration.MERGE_THRESHOLD)
            && this.rangeMin.greaterThan(range.rangeMax)) {
            this.rangeMin = range.rangeMin;
            return true;
        }
        return false;
    };
    /*
     * Try to split the range to multiple ranges based on the hash key.
     *
     * e.g., for the following range:
     *
     * min: 123456789
     * max: 125678912
     *
     * when the hash key length is 3, we want to split the range to:
     *
     * 1
     * min: 123456789
     * max: 123999999
     *
     * 2
     * min: 124000000
     * max: 124999999
     *
     * 3
     * min: 125000000
     * max: 125678912
     *
     * For this range:
     *
     * min: -125678912
     * max: -123456789
     *
     * we want:
     *
     * 1
     * min: -125678912
     * max: -125000000
     *
     * 2
     * min: -124999999
     * max: -124000000
     *
     * 3
     * min: -123999999
     * max: -123456789
     */
    GeohashRange.prototype.trySplit = function (hashKeyLength) {
        var result = [];
        var minHashKey = S2Manager_1.S2Manager.generateHashKey(this.rangeMin, hashKeyLength);
        var maxHashKey = S2Manager_1.S2Manager.generateHashKey(this.rangeMax, hashKeyLength);
        var denominator = Math.pow(10, this.rangeMin.toString().length - minHashKey.toString().length);
        if (minHashKey.equals(maxHashKey)) {
            result.push(this);
        }
        else {
            for (var l = minHashKey; l.lessThanOrEqual(maxHashKey); l = l.add(1)) {
                if (l.greaterThan(0)) {
                    result.push(new GeohashRange(l.equals(minHashKey) ? this.rangeMin : l.multiply(denominator), l.equals(maxHashKey) ? this.rangeMax : l.add(1).multiply(denominator).subtract(1)));
                }
                else {
                    result.push(new GeohashRange(l.equals(minHashKey) ? this.rangeMin : l.subtract(1).multiply(denominator).add(1), l.equals(maxHashKey) ? this.rangeMax : l.multiply(denominator)));
                }
            }
        }
        return result;
    };
    return GeohashRange;
}());
exports.GeohashRange = GeohashRange;
