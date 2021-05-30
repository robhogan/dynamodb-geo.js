const ddbGeo = require("dynamodb-geo");
const AWS = require("aws-sdk");
const uuid = require("uuid");

// Set up AWS
AWS.config.update({
  accessKeyId: YOUR_AWS_KEY_ID,
  secretAccessKey: YOUR_AWS_SECRET_ACCESS_KEY,
  region: YOUR_AWS_REGION,
});

// Use a local DB for the example.
const ddb = new AWS.DynamoDB({
  endpoint: new AWS.Endpoint("http://localhost:8000"),
});

// Configuration for a new instance of a GeoDataManager. Each GeoDataManager instance represents a table
const config = new ddbGeo.GeoDataManagerConfiguration(ddb, "capitals");

// Instantiate the table manager
const capitalsManager = new ddbGeo.GeoDataManager(config);

// Use GeoTableUtil to help construct a CreateTableInput.
const createTableInput = ddbGeo.GeoTableUtil.getCreateTableRequest(config);

// Tweak the schema as desired
createTableInput.ProvisionedThroughput.ReadCapacityUnits = 2;

console.log("Creating table with schema:");
console.dir(createTableInput, { depth: null });

// Create the table
ddb
  .createTable(createTableInput)
  .promise()
  // Wait for it to become ready
  .then(function () {
    return ddb
      .waitFor("tableExists", { TableName: config.tableName })
      .promise();
  })
  // Load sample data in batches
  .then(function () {
    console.log("Loading sample data from capitals.json");
    const data = require("./capitals.json");
    const putPointInputs = data.map(function (capital) {
      return {
        RangeKeyValue: { S: uuid.v4() }, // Use this to ensure uniqueness of the hash/range pairs.
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
    var currentBatch = 1;

    function resumeWriting() {
      if (putPointInputs.length === 0) {
        return Promise.resolve();
      }
      const thisBatch = [];
      for (
        var i = 0, itemToAdd = null;
        i < BATCH_SIZE && (itemToAdd = putPointInputs.shift());
        i++
      ) {
        thisBatch.push(itemToAdd);
      }
      console.log(
        "Writing batch " +
          currentBatch++ +
          "/" +
          Math.ceil(data.length / BATCH_SIZE)
      );
      return capitalsManager
        .batchWritePoints(thisBatch)
        .promise()
        .then(function () {
          return new Promise(function (resolve) {
            setInterval(resolve, WAIT_BETWEEN_BATCHES_MS);
          });
        })
        .then(function () {
          return resumeWriting();
        });
    }

    return resumeWriting().catch(function (error) {
      console.warn(error);
    });
  })
  // Perform a radius query
  .then(function () {
    console.log("Querying by radius, looking 100km from Cambridge, UK.");
    return capitalsManager.queryRadius({
      RadiusInMeter: 100000,
      CenterPoint: {
        latitude: 52.22573,
        longitude: 0.149593,
      },
    });
  })
  // Print the results, an array of DynamoDB.AttributeMaps
  .then(console.log)
  // Clean up
  .then(function () {
    return ddb.deleteTable({ TableName: config.tableName }).promise();
  })
  .catch(console.warn)
  .then(function () {
    process.exit(0);
  });
