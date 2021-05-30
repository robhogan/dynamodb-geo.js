import {
  AttributeValue,
  BatchWriteItemOutput,
  DeleteItemInput,
  DeleteItemOutput,
  GetItemInput,
  GetItemOutput,
  PutItemOutput,
  PutRequest,
  QueryInput,
  QueryOutput,
  UpdateItemInput,
  UpdateItemOutput,
} from "@aws-sdk/client-dynamodb";

export interface BatchWritePointOutput extends BatchWriteItemOutput {}

export interface DeletePointInput {
  RangeKeyValue: AttributeValue;
  GeoPoint: GeoPoint;
  DeleteItemInput?: DeleteItemInput;
}
export interface DeletePointOutput extends DeleteItemOutput {}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}
export interface GeoQueryInput {
  QueryInput?: QueryInput;
}
export interface GeoQueryOutput extends QueryOutput {}
export interface GetPointInput {
  RangeKeyValue: AttributeValue;
  GeoPoint: GeoPoint;
  GetItemInput: GetItemInput;
}
export interface GetPointOutput extends GetItemOutput {}
export interface PutPointInput {
  RangeKeyValue: AttributeValue;
  GeoPoint: GeoPoint;
  PutItemInput: PutRequest;
}
export interface PutPointOutput extends PutItemOutput {}
export interface QueryRadiusInput extends GeoQueryInput {
  RadiusInMeter: number;
  CenterPoint: GeoPoint;
}
export interface QueryRadiusOutput extends GeoQueryOutput {}
export interface QueryRectangleInput extends GeoQueryInput {
  MinPoint: GeoPoint;
  MaxPoint: GeoPoint;
}
export interface QueryRectangleOutput extends GeoQueryOutput {}
export interface UpdatePointInput {
  RangeKeyValue: AttributeValue;
  GeoPoint: GeoPoint;
  UpdateItemInput: UpdateItemInput;
}
export interface UpdatePointOutput extends UpdateItemOutput {}
