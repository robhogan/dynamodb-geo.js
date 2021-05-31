import { DynamoDBManager } from "../../src/dynamodb/DynamoDBManager";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GeoDataManagerConfiguration } from "../../src";
import { mock, MockProxy } from "jest-mock-extended";

jest.mock("@aws-sdk/client-dynamodb");

describe("DynamoDBManager.deletePoint", () => {
  let dbClient: MockProxy<DynamoDBClient>;
  beforeEach(async () => {
    dbClient = mock<DynamoDBClient>();
    dbClient.send.mockResolvedValue({} as never);
  });
  test("calls deleteItem with the correct arguments ", () => {
    const config = new GeoDataManagerConfiguration(dbClient, "MyTable");

    const ddb = new DynamoDBManager(config);

    ddb.deletePoint({
      RangeKeyValue: { S: "1234" },
      GeoPoint: {
        longitude: 50,
        latitude: 1,
      },
    });

    expect(dbClient.send).toBeCalledTimes(1);
    // expect(called).to.be.true;
  });
});

describe("DynamoDBManager.putPoint", () => {
  let dbClient: MockProxy<DynamoDBClient>;

  beforeEach(async () => {
    dbClient = mock<DynamoDBClient>();
    dbClient.send.mockResolvedValue({} as never);
  });

  it("calls putItem with the correct arguments ", () => {
    const config = new GeoDataManagerConfiguration(dbClient, "MyTable");

    const ddb: any = new DynamoDBManager(config);

    ddb.putPoint({
      RangeKeyValue: { S: "1234" }, // Use this to ensure uniqueness of the hash/range pairs.
      GeoPoint: {
        // An object specifying latitutde and longitude as plain numbers. Used to build the geohash, the hashkey and geojson data
        latitude: 51.51,
        longitude: -0.13,
      },
      PutItemInput: {
        // Passed through to the underlying DynamoDB.putItem request. TableName is filled in for you.
        Item: {
          // The primary key, geohash and geojson data is filled in for you
          country: { S: "UK" }, // Specify attribute values using { type: value } objects, like the DynamoDB API.
          capital: { S: "London" },
        },
        ConditionExpression: "attribute_not_exists(capital)",
      },
    });

    expect(dbClient.send).toBeCalledTimes(1);
  });
});
