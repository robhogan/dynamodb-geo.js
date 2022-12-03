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

import { GeoDataManagerConfiguration } from "../GeoDataManagerConfiguration";
import { CreateTableInput } from "@aws-sdk/client-dynamodb";

/**
 * Utility class.
 * */
export class GeoTableUtil {
  /**
   * <p>
   * Construct a create table request object based on GeoDataManagerConfiguration. The users can update any aspect of
   * the request and call it.
   * </p>
   * Example:
   *
   * <pre>
   * AmazonDynamoDBClient ddb = new AmazonDynamoDBClient(new ClasspathPropertiesFileCredentialsProvider());
   * Region usWest2 = Region.getRegion(Regions.US_WEST_2);
   * ddb.setRegion(usWest2);
   *
   * CreateTableRequest createTableRequest = GeoTableUtil.getCreateTableRequest(config);
   * CreateTableResult createTableResult = ddb.createTable(createTableRequest);
   * </pre>
   *
   * @return Generated create table request.
   */
  public static getCreateTableRequest(
    config: GeoDataManagerConfiguration
  ): CreateTableInput {
    return {
      TableName: config.tableName,
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 5,
      },
      KeySchema: [
        {
          KeyType: "HASH",
          AttributeName: config.hashKeyAttributeName,
        },
        {
          KeyType: "RANGE",
          AttributeName: config.rangeKeyAttributeName,
        },
      ],
      AttributeDefinitions: [
        { AttributeName: config.hashKeyAttributeName, AttributeType: "N" },
        { AttributeName: config.rangeKeyAttributeName, AttributeType: "S" },
        { AttributeName: config.geohashAttributeName, AttributeType: "N" },
      ],
      LocalSecondaryIndexes: [
        {
          IndexName: config.geohashIndexName,
          KeySchema: [
            {
              KeyType: "HASH",
              AttributeName: config.hashKeyAttributeName,
            },
            {
              KeyType: "RANGE",
              AttributeName: config.geohashAttributeName,
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
      ],
    };
  }
}
