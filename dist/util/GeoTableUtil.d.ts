import { DynamoDB } from "aws-sdk";
import { GeoDataManagerConfiguration } from "../GeoDataManagerConfiguration";
/**
 * Utility class.
 * */
export declare class GeoTableUtil {
    /**
     * <p>
     * Construct a create table request object based on GeoDataManagerConfiguration. The users can update any aspect of
     * the request and call it.
     * </p>
     * Example:
     *
     * <pre>
     * AmazonDynamoDBClient ddb = new AmazonDynamoDBClient(new ClasspathPropertiesFileCredentialsProvider());
     * Region usWest2 = Region.getRegion(Regions.US_WEST_2);
     * ddb.setRegion(usWest2);
     *
     * CreateTableRequest createTableRequest = GeoTableUtil.getCreateTableRequest(config);
     * CreateTableResult createTableResult = ddb.createTable(createTableRequest);
     * </pre>
     *
     * @return Generated create table request.
     */
    static getCreateTableRequest(config: GeoDataManagerConfiguration): DynamoDB.CreateTableInput;
}
