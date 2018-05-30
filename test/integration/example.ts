import * as ddbGeo from "../../src";
import * as AWS from "aws-sdk";
import { expect } from "chai";

AWS.config.update({
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy',
    region: 'eu-west-1'
});

describe('Example', function () {
    // Use a local DB for the example.
    const ddb = new AWS.DynamoDB({ endpoint: 'http://127.0.0.1:8000' });

    // Configuration for a new instance of a GeoDataManager. Each GeoDataManager instance represents a table
    const config = new ddbGeo.GeoDataManagerConfiguration(ddb, 'test-capitals');

    // Instantiate the table manager
    const capitalsManager = new ddbGeo.GeoDataManager(config);

    before(function () {
        this.timeout(20000);
        config.hashKeyLength = 3;
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
                console.log('Loading sample data from capitals.json');
                const data = require('../../example/capitals.json');
                const putPointInputs = data.map(function (capital, i) {
                    return {
                        RangeKeyValue: { S: String(i) }, // Use this to ensure uniqueness of the hash/range pairs.
                        GeoPoint: {
                            latitude: capital.latitude,
                            longitude: capital.longitude
                        },
                        PutItemInput: {
                            Item: {
                                country: { S: capital.country },
                                capital: { S: capital.capital }
                            }
                        }
                    }
                });

                const BATCH_SIZE = 25;
                const WAIT_BETWEEN_BATCHES_MS = 1000;
                let currentBatch = 1;

                function resumeWriting() {
                    if (putPointInputs.length === 0) {
                        return Promise.resolve();
                    }
                    const thisBatch = [];
                    for (var i = 0, itemToAdd = null; i < BATCH_SIZE && (itemToAdd = putPointInputs.shift()); i++) {
                        thisBatch.push(itemToAdd);
                    }
                    console.log('Writing batch ' + (currentBatch++) + '/' + Math.ceil(data.length / BATCH_SIZE));
                    return capitalsManager.batchWritePoints(thisBatch).promise()
                        .then(function () {
                            return new Promise(function (resolve) {
                                setInterval(resolve, WAIT_BETWEEN_BATCHES_MS);
                            });
                        })
                        .then(function () {
                            return resumeWriting()
                        });
                }

                return resumeWriting();
            });
    });

    it('queryRadius', function () {
        this.timeout(20000);
        // Perform a radius query
        return capitalsManager.queryRadius({
            RadiusInMeter: 100000,
            CenterPoint: {
                latitude: 52.225730,
                longitude: 0.149593
            }
        }).then((result) => {
            expect(result).to.deep.equal([{
                rangeKey: { S: '50' },
                country: { S: 'United Kingdom' },
                capital: { S: 'London' },
                hashKey: { N: '522' },
                geoJson: { S: '{"type":"POINT","coordinates":[-0.13,51.51]}' },
                geohash: { N: '5221366118452580119' }
            }])
        });
    });

    after(function () {
        this.timeout(10000);
        return ddb.deleteTable({ TableName: config.tableName }).promise()
    });
});
