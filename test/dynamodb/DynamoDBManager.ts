import { DynamoDBManager } from "../../src/dynamodb/DynamoDBManager";
import { expect } from "chai";
import { GeoDataManagerConfiguration } from "../../src";

describe('DynamoDBManager.deletePoint', () => {
  it('calls deleteItem with the correct arguments ', () => {
    let called = false;
    const config = new GeoDataManagerConfiguration({
      deleteItem: (args: any) => {
        called = true;
        expect(args).to.deep.equal({
            TableName: 'MyTable',
            Key: {
              hashKey: { N: '44' },
              rangeKey: 'myRangeKey'
            }
          }
        );
      }
    }, 'MyTable');

    const ddb = new DynamoDBManager(config);

    ddb.deletePoint({
      RangeKeyValue: 'myRangeKey',
      GeoPoint: {
        longitude: 50,
        latitude: 1
      }
    });

    expect(called).to.be.true;
  });
});
