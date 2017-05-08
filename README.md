[![npm version](https://badge.fury.io/js/dynamodb-geo.svg)](https://badge.fury.io/js/dynamodb-geo)

# Geo Library for Amazon DynamoDB
This project is an unofficial port of [awslabs/dynamodb-geo][dynamodb-geo], bringing creation and querying of geospatial data to Node JS developers using [Amazon DynamoDB][dynamodb].

## Features
* **Box Queries:** Return all of the items that fall within a pair of geo points that define a rectangle as projected onto a sphere.
* **Radius Queries:** Return all of the items that are within a given radius of a geo point.
* **Basic CRUD Operations:** Create, retrieve, update, and delete geospatial data items.
* **Customizable:** Access to raw request and result objects from the AWS SDK for javascript.
* **Fully Typed:** This port is written in typescript and declaration files are bundled into releases.

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

## API
### GeoDataManagerConfiguration
You must create an instance of `GeoDataManagerConfiguration` before doing anything else. This is a container for various options. You must provide a `DynamoDB` instance (from the AWS sdk) and a table name.

### GeoDataManager
A `GeoDataManager` instance allows interaction with a table containing geospatial data. Create an instance for each table you want to interact with.

Todo: Docs

## Example
See the [example on Github][example]

[example]: https://github.com/rh389/dynamodb-geo.js/tree/master/example
[dynamodb-geo]: https://github.com/awslabs/dynamodb-geo
[dynamodb]: http://aws.amazon.com/dynamodb
[dynamodb-query]: http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html
