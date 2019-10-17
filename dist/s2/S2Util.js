"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodes2ts_1 = require("nodes2ts");
var S2Util = /** @class */ (function () {
    function S2Util() {
    }
    S2Util.latLngRectFromQueryRectangleInput = function (geoQueryRequest) {
        var queryRectangleRequest = geoQueryRequest;
        var minPoint = queryRectangleRequest.MinPoint;
        var maxPoint = queryRectangleRequest.MaxPoint;
        var latLngRect = null;
        if (minPoint != null && maxPoint != null) {
            var minLatLng = nodes2ts_1.S2LatLng.fromDegrees(minPoint.latitude, minPoint.longitude);
            var maxLatLng = nodes2ts_1.S2LatLng.fromDegrees(maxPoint.latitude, maxPoint.longitude);
            latLngRect = nodes2ts_1.S2LatLngRect.fromLatLng(minLatLng, maxLatLng);
        }
        return latLngRect;
    };
    S2Util.getBoundingLatLngRectFromQueryRadiusInput = function (geoQueryRequest) {
        var centerPoint = geoQueryRequest.CenterPoint;
        var radiusInMeter = geoQueryRequest.RadiusInMeter;
        var centerLatLng = nodes2ts_1.S2LatLng.fromDegrees(centerPoint.latitude, centerPoint.longitude);
        var latReferenceUnit = centerPoint.latitude > 0.0 ? -1.0 : 1.0;
        var latReferenceLatLng = nodes2ts_1.S2LatLng.fromDegrees(centerPoint.latitude + latReferenceUnit, centerPoint.longitude);
        var lngReferenceUnit = centerPoint.longitude > 0.0 ? -1.0 : 1.0;
        var lngReferenceLatLng = nodes2ts_1.S2LatLng.fromDegrees(centerPoint.latitude, centerPoint.longitude
            + lngReferenceUnit);
        var latForRadius = radiusInMeter / centerLatLng.getEarthDistance(latReferenceLatLng).toNumber();
        var lngForRadius = radiusInMeter / centerLatLng.getEarthDistance(lngReferenceLatLng).toNumber();
        var minLatLng = nodes2ts_1.S2LatLng.fromDegrees(centerPoint.latitude - latForRadius, centerPoint.longitude - lngForRadius);
        var maxLatLng = nodes2ts_1.S2LatLng.fromDegrees(centerPoint.latitude + latForRadius, centerPoint.longitude + lngForRadius);
        return nodes2ts_1.S2LatLngRect.fromLatLng(minLatLng, maxLatLng);
    };
    return S2Util;
}());
exports.S2Util = S2Util;
