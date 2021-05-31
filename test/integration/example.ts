import * as ddbGeo from "../../src";
import {
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
  waitUntilTableExists,
} from "@aws-sdk/client-dynamodb";
import { inspect } from "util";
// AWS.config.update({
//   accessKeyId: "dummy",
//   secretAccessKey: "dummy",
//   region: "eu-west-1",
// });

describe("Example", function () {
  // Use a local DB for the example.
  const ddb = new DynamoDBClient({
    endpoint: "http://localhost:4567",
    region: "abc",
  });

  // Configuration for a new instance of a GeoDataManager. Each GeoDataManager instance represents a table
  const config = new ddbGeo.GeoDataManagerConfiguration(ddb, "test-capitals");

  // Instantiate the table manager
  const capitalsManager = new ddbGeo.GeoDataManager(config);

  beforeAll(async () => {
    config.hashKeyLength = 3;
    config.consistentRead = true;

    // Use GeoTableUtil to help construct a CreateTableInput.
    const createTableInput = ddbGeo.GeoTableUtil.getCreateTableRequest(config);
    createTableInput.ProvisionedThroughput.ReadCapacityUnits = 2;

    await ddb.send(new CreateTableCommand(createTableInput));
    // Wait for it to become ready
    await waitUntilTableExists(
      { maxWaitTime: 200, client: ddb },
      { TableName: config.tableName }
    );
    // Load sample data in batches

    console.log("Table created");
    console.log("Loading sample data from capitals.json");
    const data = require("../../example/capitals.json");
    console.log(data.length);
    const putPointInputs = data.map(function (capital, i) {
      return {
        RangeKeyValue: { S: String(i) }, // Use this to ensure uniqueness of the hash/range pairs.
        GeoPoint: {
          latitude: capital.latitude,
          longitude: capital.longitude,
        },
        PutItemInput: {
          Item: {
            country: { S: capital.country },
            capital: { S: capital.capital },
          },
        },
      };
    });

    const BATCH_SIZE = 25;
    const WAIT_BETWEEN_BATCHES_MS = 1000;
    let currentBatch = 1;
    let itemToAdd;
    do {
      let thisBatch = [];
      do {
        itemToAdd = putPointInputs.shift();
        thisBatch.push(itemToAdd);
      } while (thisBatch.length < BATCH_SIZE && putPointInputs.length > 0);

      console.log(
        "Writing batch " +
          currentBatch++ +
          "/" +
          Math.ceil(data.length / BATCH_SIZE)
      );

      await capitalsManager.batchWritePoints(thisBatch);
      thisBatch = [];
      // Sleep
      await new Promise((resolve) =>
        setTimeout(resolve, WAIT_BETWEEN_BATCHES_MS)
      );
    } while (putPointInputs.length > 0);
  }, 40000);

  test("queryRadius", async function () {
    // Perform a radius query
    const result = await capitalsManager.queryRadius({
      RadiusInMeter: 100000,
      CenterPoint: {
        latitude: 52.22573,
        longitude: 0.149593,
      },
    });

    expect(result).toEqual([
      {
        rangeKey: { S: "50" },
        country: { S: "United Kingdom" },
        capital: { S: "London" },
        hashKey: { N: "522" },
        geoJson: { S: '{"type":"Point","coordinates":[-0.13,51.51]}' },
        geohash: { N: "5221366118452580119" },
      },
    ]);
  }, 20000);

  afterAll(async function () {
    await ddb.send(new DeleteTableCommand({ TableName: config.tableName }));
  }, 30000);
});
