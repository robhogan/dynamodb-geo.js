/*
 * Copyright 2010-2013 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 * 
 *  http://aws.amazon.com/apache2.0
 * 
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import { QueryRadiusInput, QueryRectangleInput } from "../types";
import { S2LatLng, S2LatLngRect } from "nodes2ts";

export class S2Util {

	/**
	 * An utility method to get a bounding box of latitude and longitude from a given GeoQueryRequest.
	 * 
	 * @param geoQueryRequest
	 *            It contains all of the necessary information to form a latitude and longitude box.
	 * 
	 * */
	public static getBoundingLatLngRect(geoQueryRequest: QueryRadiusInput | QueryRectangleInput): S2LatLngRect {
		if (geoQueryRequest.hasOwnProperty('MinPoint')) {
			const queryRectangleRequest = geoQueryRequest as QueryRectangleInput;

			const minPoint = queryRectangleRequest.MinPoint;
			const maxPoint = queryRectangleRequest.MaxPoint;

			let latLngRect: S2LatLngRect = null;

			if (minPoint != null && maxPoint != null) {
				const minLatLng = S2LatLng.fromDegrees(minPoint.latitude, minPoint.longitude);
				const maxLatLng = S2LatLng.fromDegrees(maxPoint.latitude, maxPoint.longitude);

				latLngRect = S2LatLngRect.fromLatLng(minLatLng, maxLatLng);
			}

			return latLngRect;
		} else if (geoQueryRequest.hasOwnProperty('RadiusInMeter')) {
			const queryRadiusRequest = geoQueryRequest as QueryRadiusInput;

			const centerPoint = queryRadiusRequest.CenterPoint;
			const radiusInMeter = queryRadiusRequest.RadiusInMeter;

			const centerLatLng = S2LatLng.fromDegrees(centerPoint.latitude, centerPoint.longitude);

			const latReferenceUnit = centerPoint.latitude > 0.0 ? -1.0 : 1.0;
			const latReferenceLatLng = S2LatLng.fromDegrees(centerPoint.latitude + latReferenceUnit,
					centerPoint.longitude);
			const lngReferenceUnit = centerPoint.longitude > 0.0 ? -1.0 : 1.0;
			const lngReferenceLatLng = S2LatLng.fromDegrees(centerPoint.latitude, centerPoint.longitude
					+ lngReferenceUnit);

			const latForRadius = radiusInMeter / (centerLatLng.getEarthDistance(latReferenceLatLng) as any).toNumber();
			const lngForRadius = radiusInMeter / (centerLatLng.getEarthDistance(lngReferenceLatLng) as any).toNumber();

			const minLatLng = S2LatLng.fromDegrees(centerPoint.latitude - latForRadius,
					centerPoint.longitude - lngForRadius);
			const maxLatLng = S2LatLng.fromDegrees(centerPoint.latitude + latForRadius,
					centerPoint.longitude + lngForRadius);

			return S2LatLngRect.fromLatLng(minLatLng, maxLatLng);
		}

		return null;
	}
}
