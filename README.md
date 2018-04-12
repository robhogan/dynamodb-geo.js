[![npm version](https://badge.fury.io/js/dynamodb-geo.svg)](https://badge.fury.io/js/dynamodb-geo) [![CircleCI](https://circleci.com/gh/rh389/dynamodb-geo.js.svg?style=shield)](https://circleci.com/gh/rh389/dynamodb-geo.js)

# Geo Library for Amazon DynamoDB
This project is an unofficial port of [awslabs/dynamodb-geo][dynamodb-geo], bringing creation and querying of geospatial data to Node JS developers using [Amazon DynamoDB][dynamodb].

## Features
* **Box Queries:** Return all of the items that fall within a pair of geo points that define a rectangle as projected onto a sphere.
* **Radius Queries:** Return all of the items that are within a given radius of a geo point.
* **Basic CRUD Operations:** Create, retrieve, update, and delete geospatial data items.
* **Customizable:** Access to raw request and result objects from the AWS SDK for javascript.
* **Fully Typed:** This port is written in typescript and declaration files are bundled into releases.

## Installation
Using [npm] or [yarn]:
`npm install --save dynamodb-geo` or `yarn add dynamodb-geo`.

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

## Choosing a `hashKeyLength` (optimising for performance and cost)
The `hashKeyLength` is the number of most significant digits (in base 10) of the 64-bit geo hash to use as the hash key. Larger numbers will allow small geographical areas to be spread across DynamoDB partitions, but at the cost of performance as more [queries][dynamodb-query] need to be executed for box/radius searches that span hash keys. See [these tests][hashkeylength-tests] for an idea of how query performance scales with `hashKeyLength` for different search radii.

If your data is sparse, a large number will mean more RCUs since more empty queries will be executed and each has a minimum cost. However if your data is dense and `hashKeyLength` too short, more RCUs will be needed to read a hash key and a higher proportion will be discarded by server-side filtering.

From the [AWS `Query` documentation][dynamodb-query]
> DynamoDB calculates the number of read capacity units consumed based on item size, not on the amount of data that is returned to an application. ... **The number will also be the same whether or not you use a `FilterExpression`**

Optimally, you should pick the largest `hashKeyLength` your usage scenario allows. The wider your typical radius/box queries, the smaller it will need to be.

Note that the [Java version][dynamodb-geo] uses a `hashKeyLength` of `6` by default. The same value will need to be used if you access the same data with both clients.

This is an important early choice, since changing your `hashKeyLength` will mean recreating your data.

## Creating a table
`GeoTableUtil` has a static method `getCreateTableRequest` for helping you prepare a [DynamoDB CreateTable request][createtable] request, given a `GeoDataManagerConfiguration`.

You can modify this request as desired before executing it using AWS's DynamoDB SDK.

Example:
```js
// Pick a hashKeyLength appropriate to your usage
config.hashKeyLength = 3;

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
            },
            // ... Anything else to pass through to `putItem`, eg ConditionExpression
        }
    }).promise()
    .then(function() { console.log('Done!') });
```
See also [DynamoDB PutItem request][putitem]

## Updating a specific point
Note that you cannot update the hash key, range key, geohash or geoJson. If you want to change these, you'll need to recreate the record.

You must specify a `RangeKeyValue`, a `GeoPoint`, and an `UpdateItemInput` matching the [DynamoDB UpdateItem][updateitem] request (`TableName` and `Key` are filled in for you).

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

## Deleting a specific point
You must specify a `RangeKeyValue` and a `GeoPoint`. Optionally, you can pass `DeleteItemInput` matching [DynamoDB DeleteItem][deleteitem] request (`TableName` and `Key` are filled in for you).

```js
myGeoTableManager.deletePoint({
        RangeKeyValue: { S: '1234' },
        GeoPoint: { // An object specifying latitutde and longitude as plain numbers.
            latitude: 51.51,
            longitude: -0.13
        },
        DeleteItemInput: { // Optional, any additional parameters to pass through.
            // TableName and Key are filled in for you
            // Example: Only delete if the point does not have a country name set
            ConditionExpression: 'attribute_not_exists(country)'
        }
    }).promise()
    .then(function() { console.log('Done!') });
```

## Rectangular queries
Query by rectangle by specifying a `MinPoint` and `MaxPoint`.

```js
// Querying a rectangle
myGeoTableManager.queryRectangle({
        MinPoint: {
            latitude: 52.225730,
            longitude: 0.149593
        },
        MaxPoint: {
            latitude: 52.889499,
            longitude: 0.848383
        }
    })
    // Print the results, an array of DynamoDB.AttributeMaps
    .then(console.log);
```

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

#### consistentRead: boolean = false
Whether queries use the [`ConsistentRead`][readconsistency] option (for strongly consistent reads) or not (for eventually consistent reads, at half the cost).

This can also be overridden for individual queries as a query config option.

#### longitudeFirst: boolean = true
This library will automatically add GeoJSON-style position data to your stored items. The [GeoJSON standard][geojson] uses `[lon,lat]` ordering, but [awslabs/dynamodb-geo][dynamodb-geo] uses `[lat,lng]`.

This fork allows you to choose between [awslabs/dynamodb-geo][dynamodb-geo] compatibility and GeoJSON standard compliance.

* Use `false` (`[lat, lon]`) for compatibility with [awslabs/dynamodb-geo][dynamodb-geo]
* Use `true` (`[lon, lat]`) for GeoJSON standard compliance. (default)

Note that this value should match the state of your existing data - if you change it you must update your database manually, or you'll end up with ambiguously mixed data.

#### geohashAttributeName: string = "geohash"
The name of the attribute storing the full 64-bit geohash. Its value is auto-generated based on item coordinates.

#### hashKeyAttributeName: string = "hashKey"
The name of the attribute storing the first `hashKeyLength` digits (default 2) of the geo hash, used as the hash (aka partition) part of a [hash/range primary key pair][hashrange]. Its value is auto-generated based on item coordinates.

#### hashKeyLength: number = 2
See [above][choosing-hashkeylength].

#### rangeKeyAttributeName: string = "rangeKey"
The name of the attribute storing the range key, used as the range (aka sort) part of a [hash/range key primary key pair][hashrange]. Its value must be specified by you (hash-range pairs must be unique).

#### geoJsonAttributeName: string = "geoJson"
The name of the attribute which will contain the longitude/latitude pair in a GeoJSON-style point (see also `longitudeFirst`).

#### geohashIndexName: string = "geohash-index"
The name of the index to be created against the geohash. Only used for creating new tables.

## Example
See the [example on Github][example]

## Limitations

### No composite key support
Currently, the library does not support composite keys. You may want to add tags such as restaurant, bar, and coffee shop, and search locations of a specific category; however, it is currently not possible. You need to create a table for each tag and store the items separately.

### Queries retrieve all paginated data
Although low level [DynamoDB Query][dynamodb-query] requests return paginated results, this library automatically pages through the entire result set. When querying a large area with many points, a lot of Read Capacity Units may be consumed.

### More Read Capacity Units
The library retrieves candidate Geo points from the cells that intersect the requested bounds. The library then post-processes the candidate data, filtering out the specific points that are outside the requested bounds. Therefore, the consumed Read Capacity Units will be higher than the final results dataset. Typically 8 queries are exectued per radius or box search.

### High memory consumption
Because all paginated `Query` results are loaded into memory and processed, it may consume substantial amounts of memory for large datasets.

### Dataset density limitation
The Geohash used in this library is roughly centimeter precision. Therefore, the library is not suitable if your dataset has much higher density.

[npm]: https://www.npmjs.com
[yarn]: https://yarnpkg.com
[updateitem]: http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html
[deleteitem]: http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html
[putitem]: http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html
[createtable]: http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_CreateTable.html
[hashrange]: http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.PrimaryKey
[readconsistency]: http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html
[geojson]: https://geojson.org/geojson-spec.html
[example]: https://github.com/rh389/dynamodb-geo.js/tree/master/example
[dynamodb-geo]: https://github.com/awslabs/dynamodb-geo
[dynamodb]: http://aws.amazon.com/dynamodb
[dynamodb-query]: http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html
[hashkeylength-tests]: https://github.com/rh389/dynamodb-geo.js/blob/master/test/integration/hashKeyLength.ts
[choosing-hashkeylength]: #choosing-a-hashkeylength-optimising-for-performance-and-cost
