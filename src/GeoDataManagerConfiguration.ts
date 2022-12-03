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

import { S2RegionCoverer } from "nodes2ts";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

export class GeoDataManagerConfiguration {
  // Public constants
  static MERGE_THRESHOLD = 2;

  // Configuration properties
  tableName: string;

  consistentRead: boolean = false;

  hashKeyAttributeName: string = "hashKey";
  rangeKeyAttributeName: string = "rangeKey";
  geohashAttributeName: string = "geohash";
  geoJsonAttributeName: string = "geoJson";

  geohashIndexName: string = "geohash-index";

  hashKeyLength: number = 2;

  /**
   * The order of the GeoJSON coordinate pair in data.
   * Use false [lat, lon] for compatibility with the Java library https://github.com/awslabs/dynamodb-geo
   * Use true [lon, lat] for GeoJSON standard compliance. (default)
   *
   * Note that this value should match the state of your existing data - if you change it you must update your database manually
   *
   * @type {boolean}
   */
  longitudeFirst: boolean = true;

  /**
   * The value of the 'type' attribute in recorded GeoJSON points. Should normally be 'Point', which is standards compliant.
   *
   * Use 'POINT' for compatibility with the Java library https://github.com/awslabs/dynamodb-geo
   *
   * This setting is only relevant for writes. This library doesn't inspect or set this value when reading/querying.
   *
   * @type {string}
   */
  geoJsonPointType: "Point" | "POINT" = "Point";

  dynamoDBClient: DynamoDB;

  S2RegionCoverer: typeof S2RegionCoverer;

  constructor(dynamoDBClient, tableName: string) {
    this.dynamoDBClient = dynamoDBClient;
    this.tableName = tableName;
    this.S2RegionCoverer = S2RegionCoverer;
  }
}
