/*
 * Copyright 2010-2013 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 * 
 * http://aws.amazon.com/apache2.0
 * 
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import { S2Cell, S2CellId, S2CellUnion, S2LatLng, S2LatLngRect } from "nodes2ts";
import { GeoPoint } from "../types";

export class S2Manager {

  public static findCellIds(latLngRect: S2LatLngRect): S2CellUnion {

    const queue = [];
    const cellIds: S2CellId[] = [];

    for (let c: S2CellId = S2CellId.begin(0); !c.equals(S2CellId.end(0)); c = c.next()) {
      if (S2Manager.containsGeodataToFind(c, latLngRect)) {
        queue.push(c);
      }
    }

    S2Manager.processQueue(queue, cellIds, latLngRect);

    if (cellIds.length > 0) {
      const cellUnion = new S2CellUnion();
      cellUnion.initRawCellIds(cellIds); // This normalize the cells.
      return cellUnion;
    }

    return null;
  }

  private static containsGeodataToFind(c: S2CellId, latLngRect: S2LatLngRect) {
    if (latLngRect != null) {
      return latLngRect.intersects(new S2Cell(c));
    }

    return false;
  }

  private static processQueue(queue: S2CellId[], cellIds: S2CellId[], latLngRect: S2LatLngRect) {
    let c: S2CellId = queue.pop();
    do {
      if (!c.isValid()) {
        break;
      }
      this.processChildren(c, latLngRect, queue, cellIds);
    } while (c = queue.pop());
  }

  private static processChildren(parent: S2CellId, latLngRect: S2LatLngRect,
                                 queue: S2CellId[], cellIds: S2CellId[]) {
    const children: S2CellId[] = [];

    for (let c = parent.childBegin(); !c.equals(parent.childEnd()); c = c.next()) {
      if (this.containsGeodataToFind(c, latLngRect)) {
        children.push(c);
      }
    }

    /*
     * TODO: Need to update the strategy!
     *
     * Current strategy:
     * 1 or 2 cells contain cellIdToFind: Traverse the children of the cell.
     * 3 cells contain cellIdToFind: Add 3 cells for result.
     * 4 cells contain cellIdToFind: Add the parent for result.
     *
     * ** All non-leaf cells contain 4 child cells.
     */
    if (children.length == 1 || children.length == 2) {
      children.forEach((child) => {
        if (child.isLeaf()) {
          cellIds.push(child);
        } else {
          queue.push(child);
        }
      });
    } else if (children.length == 3) {
      cellIds.push(...children);
    } else if (children.length == 4) {
      cellIds.push(parent);
    } else {
      throw new Error('Invalid number of children');
    }
  }

  static generateGeohash(geoPoint: GeoPoint) {
    const latLng = S2LatLng.fromDegrees(geoPoint.latitude, geoPoint.longitude);
    const cell = S2Cell.fromLatLng(latLng);
    const cellId = cell.id;
    return cellId.id;
  }

  public static generateHashKey(geohash: number, hashKeyLength: number) {
    if (geohash < 0) {
      // Counteract "-" at beginning of geohash.
      hashKeyLength++;
    }

    const geohashString = geohash.toString(10);
    const denominator = Math.pow(10, geohashString.length - hashKeyLength);
    return geohash / denominator;
  }
}
