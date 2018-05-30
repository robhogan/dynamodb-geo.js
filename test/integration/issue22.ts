import * as ddbGeo from "../../src";
import * as AWS from "aws-sdk";
import { expect } from "chai";
import { S2Cell } from "nodes2ts";

AWS.config.update({
  accessKeyId: 'dummy',
  secretAccessKey: 'dummy',
  region: 'eu-west-1'
});

describe('queryRadius', function () {
  require('nodes2ts').S2RegionCoverer.FACE_CELLS = [0, 1, 2, 3, 4, 5].map(face => S2Cell.fromFacePosLevel(face, 0, 0));
  // Use a local DB for the example.
  const ddb = new AWS.DynamoDB({ endpoint: 'http://127.0.0.1:8000' });

  // Configuration for a new instance of a GeoDataManager. Each GeoDataManager instance represents a table
  const config = new ddbGeo.GeoDataManagerConfiguration(ddb, 'test-radius-query');

  // Instantiate the table manager
  const issue22Test = new ddbGeo.GeoDataManager(config);

  before(function () {
    this.timeout(20000);
    config.hashKeyLength = 6;
    config.consistentRead = true;

    // Use GeoTableUtil to help construct a CreateTableInput.
    const createTableInput = ddbGeo.GeoTableUtil.getCreateTableRequest(config);
    createTableInput.ProvisionedThroughput.ReadCapacityUnits = 2;
    return ddb.createTable(createTableInput).promise()
    // Wait for it to become ready
      .then(function () {
        return ddb.waitFor('tableExists', { TableName: config.tableName }).promise()
      })
      // Load sample data in batches
      .then(function () {
        return issue22Test.putPoint({
          RangeKeyValue: { S: String('4') }, // Use this to ensure uniqueness of the hash/range pairs.
          GeoPoint: {
            latitude: 30.04023579999999,
            longitude: 31.236852,
          },
          PutItemInput: {
            Item: {
              username: { S: "syda zeinab" }
            }
          }
        }).promise();
      });
  });

  it('queryRadius', function () {
    this.timeout(20000);
    // Perform a radius query
    return issue22Test.queryRadius({
      RadiusInMeter: 10000,
      CenterPoint: {
        latitude: 30.04023579999999,
        longitude: 31.236852,
      }
    }).then((result) => {
      expect(result).to.deep.equal([
        {
          geoJson: {
            "S": JSON.stringify({type: 'POINT', coordinates :[31.236852,30.04023579999999]})
          },
          geohash: {
            "N": "1465992910874930957"
          },
          hashKey: {
            "N": "146599"
          },
          rangeKey: {
            "S": "4"
          },
          username: {
            "S": "syda zeinab"
          }
        }
      ])
    });
  });

  after(function () {
    this.timeout(10000);
    return ddb.deleteTable({ TableName: config.tableName }).promise()
  });
});
