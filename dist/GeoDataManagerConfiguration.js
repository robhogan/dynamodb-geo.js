"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodes2ts_1 = require("nodes2ts");
var GeoDataManagerConfiguration = /** @class */ (function () {
    function GeoDataManagerConfiguration(dynamoDBClient, tableName) {
        this.consistentRead = false;
        this.hashKeyAttributeName = "hashKey";
        this.rangeKeyAttributeName = "rangeKey";
        this.geohashAttributeName = "geohash";
        this.geoJsonAttributeName = "geoJson";
        this.geohashIndexName = "geohash-index";
        this.hashKeyLength = 2;
        /**
         * The order of the GeoJSON coordinate pair in data.
         * Use false [lat, lon] for compatibility with the Java library https://github.com/awslabs/dynamodb-geo
         * Use true [lon, lat] for GeoJSON standard compliance. (default)
         *
         * Note that this value should match the state of your existing data - if you change it you must update your database manually
         *
         * @type {boolean}
         */
        this.longitudeFirst = true;
        /**
         * The value of the 'type' attribute in recorded GeoJSON points. Should normally be 'Point', which is standards compliant.
         *
         * Use 'POINT' for compatibility with the Java library https://github.com/awslabs/dynamodb-geo
         *
         * This setting is only relevant for writes. This library doesn't inspect or set this value when reading/querying.
         *
         * @type {string}
         */
        this.geoJsonPointType = 'Point';
        this.dynamoDBClient = dynamoDBClient;
        this.tableName = tableName;
        this.S2RegionCoverer = nodes2ts_1.S2RegionCoverer;
    }
    // Public constants
    GeoDataManagerConfiguration.MERGE_THRESHOLD = 2;
    return GeoDataManagerConfiguration;
}());
exports.GeoDataManagerConfiguration = GeoDataManagerConfiguration;
