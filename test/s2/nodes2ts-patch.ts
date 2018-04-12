import { S2Cell, S2LatLngRect, S2RegionCoverer } from "nodes2ts";
import { S2Util } from "../../src/s2/S2Util";
import { expect } from "chai";
import { GeoDataManagerConfiguration } from "../../src/GeoDataManagerConfiguration";

const latLngRect: S2LatLngRect = S2Util.getBoundingLatLngRectFromQueryRadiusInput({
  RadiusInMeter: 1063652,
  CenterPoint: {
    latitude: 52.225730,
    longitude: 0.149593
  }
});

describe('nodes2ts patch', () => {
  it('is necessary', () => {
    const coverer = new S2RegionCoverer();
    expect(() => coverer.getCoveringCells(latLngRect)).to.throw(TypeError);
  });

  it('makes large coverings work', () => {
    const config = new GeoDataManagerConfiguration({}, 'n/a');
    require('nodes2ts').S2RegionCoverer.FACE_CELLS = [0, 1, 2, 3, 4, 5].map(face => S2Cell.fromFacePosLevel(face, 0, 0));
    const coverer = new config.S2RegionCoverer();
    expect(() => coverer.getCoveringCells(latLngRect)).to.not.throw(TypeError);
  });
});
