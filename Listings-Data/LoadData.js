const ddbGeo = require('dynamodb-geo');
const AWS = require('aws-sdk');
const uuid = require('uuid');
require('dotenv').config()

// Set up AWS
AWS.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: 'us-east-1'
});

// Use a local DB for the example.
const ddb = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('https://dynamodb.us-east-1.amazonaws.com') });

// Configuration for a new instance of a GeoDataManager. Each GeoDataManager instance represents a table
const config = new ddbGeo.GeoDataManagerConfiguration(ddb, 'CrimeData');

// Instantiate the table manager
const tableManager = new ddbGeo.GeoDataManager(config);

// Use GeoTableUtil to help construct a CreateTableInput.
const createTableInput = ddbGeo.GeoTableUtil.getCreateTableRequest(config);

// Tweak the schema as desired
createTableInput.ProvisionedThroughput.ReadCapacityUnits = 2;

console.log('Creating table with schema:');
console.dir(createTableInput, { depth: null });

// Create the table
ddb.createTable(createTableInput).promise()
    // Wait for it to become ready
    .then(function () { return ddb.waitFor('tableExists', { TableName: config.tableName }).promise() })
    // Load sample data in batches
    .then(function () {
        console.log('Loading sample data from capitals.json');
        const data = require('/Users/miguel/Downloads/Data/segmentaa.json');
        const putPointInputs = data.map(function (capital) {
            return {
                RangeKeyValue: { S: uuid.v4() }, // Use this to ensure uniqueness of the hash/range pairs.
                GeoPoint: {
                    latitude: capital.Latitude,
                    longitude: capital.Longitude
                },
                PutItemInput: {
                    Item: {
                        IncidentDatetime: { S: capital.IncidentDatetime },
                        IncidentDate: { S: capital.IncidentDate },
                        IncidentTime: { S: capital.IncidentTime },
                        IncidentYear: { N: capital.IncidentYear.toString() },
                        IncidentID: { N: capital.IncidentID.toString() },
                        IncidentNumber: { N: capital.IncidentNumber.toString() },
                        ReportTypeCode: { S: capital.ReportTypeCode },
                        IncidentCode: { N: capital.IncidentCode.toString() },
                        IncidentCategory: { S: capital.IncidentCategory },
                        IncidentSubcategory: { S: capital.IncidentSubcategory },
                        IncidentDescription: { S: capital.IncidentDescription },
                        Intersection: { S: capital.Intersection },
                        CNN: { N: capital.CNN.toString() },
                        PoliceDistrict: { S: capital.PoliceDistrict },
                        point: { S: capital.point },
                    }
                }
            }
        });

        const BATCH_SIZE = 25;
        const WAIT_BETWEEN_BATCHES_MS = 1000;
        var currentBatch = 1;

        function resumeWriting() {
            if (putPointInputs.length === 0) {
                return Promise.resolve();
            }
            const thisBatch = [];
            for (var i = 0, itemToAdd = null; i < BATCH_SIZE && (itemToAdd = putPointInputs.shift()); i++) {
                thisBatch.push(itemToAdd);
            }
            console.log('Writing batch ' + (currentBatch++) + '/' + Math.ceil(data.length / BATCH_SIZE));
            return tableManager.batchWritePoints(thisBatch).promise()
                .then(function () {
                    return new Promise(function (resolve) {
                        setInterval(resolve, WAIT_BETWEEN_BATCHES_MS);
                    });
                })
                .then(function () {
                    return resumeWriting()
                });
        }

        return resumeWriting().catch(function (error) {
            console.warn(error);
        });
    })
    // Perform a radius query
    .then(async function () {
        console.log('Querying by radius, looking 1mile from Cambridge, UK.');
        let results = await tableManager.queryRadius({
            RadiusInMeter: 1600.34,
            CenterPoint: {
                latitude: 37.72694991292525,
                longitude: -122.47603947349434
            }
        })
        var obj = JSON.parse(results[0].geoJson.S)
        console.log(results);
    })
    // Print the results, an array of DynamoDB.AttributeMaps
    // .then(console.log)
    // Clean up
    // .then(function() { return ddb.deleteTable({ TableName: config.tableName }).promise() })
    .catch(console.warn)
    .then(function () {
        process.exit(0);
    });