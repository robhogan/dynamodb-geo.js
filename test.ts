import {
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
  ListTablesCommand,
  waitUntilTableExists,
} from "@aws-sdk/client-dynamodb";

var AWS = require("aws-sdk");

var dynamo = new AWS.DynamoDB({
  endpoint: "http://localhost:4567",
  region: "abc",
});

var ddb = new DynamoDBClient({
  endpoint: "http://localhost:4567",
  region: "abc",
});

const run = async () => {
  const params = {
    AttributeDefinitions: [
      {
        AttributeName: "Artist",
        AttributeType: "S",
      },
      {
        AttributeName: "SongTitle",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "Artist",
        KeyType: "HASH",
      },
      {
        AttributeName: "SongTitle",
        KeyType: "RANGE",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
    TableName: "Music6",
  };

  const param1 = {
    TableName: "test-capitals1",
    ProvisionedThroughput: { ReadCapacityUnits: 2, WriteCapacityUnits: 5 },
    KeySchema: [
      { KeyType: "HASH", AttributeName: "hashKey" },
      { KeyType: "RANGE", AttributeName: "rangeKey" },
    ],
    AttributeDefinitions: [
      { AttributeName: "hashKey", AttributeType: "N" },
      { AttributeName: "rangeKey", AttributeType: "S" },
      { AttributeName: "geohash", AttributeType: "N" },
    ],
    LocalSecondaryIndexes: [
      {
        IndexName: "geohash-index",
        KeySchema: [
          { KeyType: "HASH", AttributeName: "hashKey" },
          { KeyType: "RANGE", AttributeName: "geohash" },
        ],
        Projection: { ProjectionType: "ALL" },
      },
    ],
  };
  await ddb.send(new CreateTableCommand(param1));
  console.log("Waiting for table creating");
  await waitUntilTableExists(
    { maxWaitTime: 2000, client: ddb },
    { TableName: param1.TableName }
  ).then(() => {
    console.log(param1.TableName + " Created");
  });

  // ddb.send(new ListTablesCommand({TableName: "Music6"}))
};

//
//    dynamo.createTable(params, function(err, data) {
//      if (err) console.log(err, err.stack); // an error occurred
//      else     console.log(data);           // successful response
//      /*
//      data = {
//       TableDescription: {
//        AttributeDefinitions: [
//           {
//          AttributeName: "Artist",
//          AttributeType: "S"
//         },
//           {
//          AttributeName: "SongTitle",
//          AttributeType: "S"
//         }
//        ],
//        CreationDateTime: <Date Representation>,
//        ItemCount: 0,
//        KeySchema: [
//           {
//          AttributeName: "Artist",
//          KeyType: "HASH"
//         },
//           {
//          AttributeName: "SongTitle",
//          KeyType: "RANGE"
//         }
//        ],
//        ProvisionedThroughput: {
//         ReadCapacityUnits: 5,
//         WriteCapacityUnits: 5
//        },
//        TableName: "Music",
//        TableSizeBytes: 0,
//        TableStatus: "CREATING"
//       }
//      }
//      */
//    });

// dynamo.listTables(console.log.bind(console))

run().then(() => console.log("Done!"));
