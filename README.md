[![npm version](https://badge.fury.io/js/dynamodb-geo.svg)](https://badge.fury.io/js/dynamodb-geo)

# Geo Library for Amazon DynamoDB
This project is an unofficial port of [awslabs/dynamodb-geo][dynamodb-geo], bringing creation and querying of geospatial data to Node JS developers using [Amazon DynamoDB][dynamodb].

## Features
* **Box Queries:** Return all of the items that fall within a pair of geo points that define a rectangle as projected onto a sphere.
* **Radius Queries:** Return all of the items that are within a given radius of a geo point.
* **Basic CRUD Operations:** Create, retrieve, update, and delete geospatial data items.
* **Customizable:** Access to raw request and result objects from the AWS SDK for javascript.
* **Fully Typed:** This port is written in typescript and declaration files are bundled into releases.

## Getting started
First you'll need to import the AWS sdk and set up your DynamoDB connection:

```js
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('http://localhost:8000') }); // Local development
```

Next you must create an instance of `GeoDataManagerConfiguration` for each geospatial table you wish to interact with. This is a container for various options (see API below), but you must always provide a `DynamoDB` instance and a table name.

```js
const ddbGeo = require('dynamodb-geo');
const config = new ddbGeo.GeoDataManagerConfiguration(ddb, 'MyGeoTable');
```

You may modify the config to change defaults.

```js
config.longitudeFirst = true; // Use spec-compliant GeoJSON, incompatible with awslabs/dynamodb-geo
```

Finally, you should instantiate a manager to query and write to the table using this config object.

```js
const myGeoTableManager = new ddbGeo.GeoDataManager(config);
```

## Creating a table
`GeoTableUtil` has a static method `getCreateTableRequest` for helping you prepare a [DynamoDB CreateTable request][createtable] request, given a `GeoDataManagerConfiguration`.

You can modify this request as desired before executing it using AWS's DynamoDB SDK.

Example:
```js
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
    .then(function () { console.log('Table created and ready!') });
```

## Adding data
```js
myGeoTableManager.putPoint({
        RangeKeyValue: { S: '1234' }, // Use this to ensure uniqueness of the hash/range pairs.
        GeoPoint: { // An object specifying latitutde and longitude as plain numbers. Used to build the geohash, the hashkey and geojson data
            latitude: 51.51,
            longitude: -0.13
        },
        PutItemInput: { // Passed through to the underlying DynamoDB.putItem request. TableName is filled in for you.
            Item: { // The primary key, geohash and geojson data is filled in for you
                country: { S: 'UK' }, // Specify attribute values using { type: value } objects, like the DynamoDB API.
                capital: { S: 'London' }
            }
        }
    }).promise()
    .then(function() { console.log('Done!') });
```
See also [DynamoDB PutItem request][putitem]

## Updating a specific point
Note that you cannot update the hash key, range key, geohash or geoJson. If you want to change these, you'll need to recreate the record.

You must specify a `RangeKeyValue`, a `GeoPoint`, and an `UpdateItemInput` matching the [DynamoDB UpdateItem request][updateitem] (`TableName` and `Key` are filled in for you).

```js
myGeoTableManager.updatePoint({
        RangeKeyValue: { S: '1234' },
        GeoPoint: { // An object specifying latitutde and longitude as plain numbers.
            latitude: 51.51,
            longitude: -0.13
        },
        UpdateItemInput: { // TableName and Key are filled in for you
            UpdateExpression: 'SET country = :newName',
            ExpressionAttributeValues: {
                ':newName': { S: 'United Kingdom'}
            }
        }
    }).promise()
    .then(function() { console.log('Done!') });
```

## Deleting data
TODO: Docs

## Rectangular queries
TODO: Docs

## Radius queries
Query by radius by specifying a `CenterPoint` and `RadiusInMeter`.

```js
// Querying 100km from Cambridge, UK
myGeoTableManager.queryRadius({
        RadiusInMeter: 100000,
        CenterPoint: {
            latitude: 52.225730,
            longitude: 0.149593
        }
    })
    // Print the results, an array of DynamoDB.AttributeMaps
    .then(console.log);
```

## Batch operations
TODO: Docs (see [the example][example] for an example of a batch write)

## Configuration reference
These are public properties of a `GeoDataManagerConfiguration` instance. After creating the config object you may modify these properties.

#### consistentRead: boolean = true;
Whether queries use the [`ConsistentRead`][readconsistency] option (for strongly consistent reads) or not (for eventually consistent reads, at half the cost).

This can also be overridden for individual queries as a query config option.
#### longitudeFirst: boolean = true
This library will automatically add GeoJSON-style position data to your stored items. The [GeoJSON standard][geojson] uses `[lon,lat]` ordering, but [awslabs/dynamodb-geo][dynamodb-geo] uses `[lat,lng]`.

This fork allows you to choose between [awslabs/dynamodb-geo][dynamodb-geo] compatibility and GeoJSON standard compliance.

* Use `false` (`[lat, lon]`) for compatibility with [awslabs/dynamodb-geo][dynamodb-geo] (default)
* Use `true` (`[lon, lat]`) for GeoJSON standard compliance.

Note that this value should match the state of your existing data - if you change it you must update your database manually, or you'll end up with ambiguously mixed data.
#### geohashAttributeName: string = "geohash";
The name of the attribute storing the full 64-bit geohash. Its value is auto-generated based on item coordinates.
#### hashKeyAttributeName: string = "hashKey";
The name of the attribute storing the first `hashKeyLength` digits (default 6) of the geo hash, used as the hash (aka partition) part of a [hash/range primary key pair][hashrange]. Its value is auto-generated based on item coordinates.
#### hashKeyLength: number = 6;
The number of digits (in base 10) of the 64-bit geo hash to use as the hash key.
#### rangeKeyAttributeName: string = "rangeKey";
The name of the attribute storing the range key, used as the range (aka sort) part of a [hash/range key primary key pair][hashrange]. Its value must be specified by you (hash-range pairs must be unique).
#### geoJsonAttributeName: string = "geoJson";
The name of the attribute which will contain the longitude/latitude pair in a GeoJSON-style point (see also `longitudeFirst`).
#### geohashIndexName: string = "geohash-index";
The name of the index to be created against the geohash. Only used for creating new tables.

## Example
See the [example on Github][example]

## Limitations

### No composite key support
Currently, the library does not support composite keys. You may want to add tags such as restaurant, bar, and coffee shop, and search locations of a specific category; however, it is currently not possible. You need to create a table for each tag and store the items separately.

### Queries retrieve all paginated data
Although low level [DynamoDB Query][dynamodb-query] requests return paginated results, this library automatically pages through the entire result set. When querying a large area with many points, a lot of Read Capacity Units may be consumed.

### More Read Capacity Units
The library retrieves candidate Geo points from the cells that intersect the requested bounds. The library then post-processes the candidate data, filtering out the specific points that are outside the requested bounds. Therefore, the consumed Read Capacity Units will be higher than the final results dataset.

### High memory consumption
Because all paginated `Query` results are loaded into memory and processed, it may consume substantial amounts of memory for large datasets.

### Dataset density limitation
The Geohash used in this library is roughly centimeter precision. Therefore, the library is not suitable if your dataset has much higher density.

[updateitem]: http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html
[putitem]: http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html
[createtable]: http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_CreateTable.html
[hashrange]: http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.PrimaryKey
[readconsistency]: http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html
[geojson]: https://geojson.org/geojson-spec.html
[example]: https://github.com/rh389/dynamodb-geo.js/tree/master/example
[dynamodb-geo]: https://github.com/awslabs/dynamodb-geo
[dynamodb]: http://aws.amazon.com/dynamodb
[dynamodb-query]: http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html
