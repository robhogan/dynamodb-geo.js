"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GeohashRange_1 = require("./GeohashRange");
var Covering = /** @class */ (function () {
    function Covering(cellIds) {
        this.cellIds = cellIds;
    }
    Covering.prototype.getGeoHashRanges = function (hashKeyLength) {
        var ranges = [];
        this.cellIds.forEach(function (outerRange) {
            var hashRange = new GeohashRange_1.GeohashRange(outerRange.rangeMin().id, outerRange.rangeMax().id);
            ranges.push.apply(ranges, hashRange.trySplit(hashKeyLength));
        });
        return ranges;
    };
    Covering.prototype.getNumberOfCells = function () {
        return this.cellIds.length;
    };
    return Covering;
}());
exports.Covering = Covering;
