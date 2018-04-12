import { GeoDataManager } from "./GeoDataManager";
import { GeoDataManagerConfiguration } from "./GeoDataManagerConfiguration";
import { GeoTableUtil } from "./util/GeoTableUtil";
import { S2Cell } from "nodes2ts";

// Temporary. See https://github.com/vekexasia/nodes2-ts/issues/12
require('nodes2ts').S2RegionCoverer.FACE_CELLS = [0, 1, 2, 3, 4, 5].map(face => S2Cell.fromFacePosLevel(face, 0, 0));

export {
  GeoDataManager,
  GeoDataManagerConfiguration,
  GeoTableUtil
}
