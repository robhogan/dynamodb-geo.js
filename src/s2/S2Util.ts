import { QueryRadiusInput, QueryRectangleInput } from "../types";
import { S2LatLng, S2LatLngRect } from "nodes2ts";

export class S2Util {
  public static latLngRectFromQueryRectangleInput(
    geoQueryRequest: QueryRectangleInput
  ): S2LatLngRect {
    const queryRectangleRequest = geoQueryRequest as QueryRectangleInput;

    const minPoint = queryRectangleRequest.MinPoint;
    const maxPoint = queryRectangleRequest.MaxPoint;

    let latLngRect: S2LatLngRect = null;

    if (minPoint != null && maxPoint != null) {
      const minLatLng = S2LatLng.fromDegrees(
        minPoint.latitude,
        minPoint.longitude
      );
      const maxLatLng = S2LatLng.fromDegrees(
        maxPoint.latitude,
        maxPoint.longitude
      );

      latLngRect = S2LatLngRect.fromLatLng(minLatLng, maxLatLng);
    }

    return latLngRect;
  }

  public static getBoundingLatLngRectFromQueryRadiusInput(
    geoQueryRequest: QueryRadiusInput
  ): S2LatLngRect {
    const centerPoint = geoQueryRequest.CenterPoint;
    const radiusInMeter = geoQueryRequest.RadiusInMeter;

    const centerLatLng = S2LatLng.fromDegrees(
      centerPoint.latitude,
      centerPoint.longitude
    );

    const latReferenceUnit = centerPoint.latitude > 0.0 ? -1.0 : 1.0;
    const latReferenceLatLng = S2LatLng.fromDegrees(
      centerPoint.latitude + latReferenceUnit,
      centerPoint.longitude
    );
    const lngReferenceUnit = centerPoint.longitude > 0.0 ? -1.0 : 1.0;
    const lngReferenceLatLng = S2LatLng.fromDegrees(
      centerPoint.latitude,
      centerPoint.longitude + lngReferenceUnit
    );

    const latForRadius =
      radiusInMeter / centerLatLng.getEarthDistance(latReferenceLatLng);
    const lngForRadius =
      radiusInMeter / centerLatLng.getEarthDistance(lngReferenceLatLng);

    const minLatLng = S2LatLng.fromDegrees(
      centerPoint.latitude - latForRadius,
      centerPoint.longitude - lngForRadius
    );
    const maxLatLng = S2LatLng.fromDegrees(
      centerPoint.latitude + latForRadius,
      centerPoint.longitude + lngForRadius
    );

    return S2LatLngRect.fromLatLng(minLatLng, maxLatLng);
  }
}
