import { S2RegionCoverer } from "nodes2ts";
import { S2Util } from "../../src/s2/S2Util";
import { Covering } from "../../src/model/Covering";

describe("Appropriate hash key lengths", function () {
  it("10m radius", function () {
    const cov = new Covering(
      new S2RegionCoverer().getCoveringCells(
        S2Util.getBoundingLatLngRectFromQueryRadiusInput({
          RadiusInMeter: 10,
          CenterPoint: {
            latitude: 59,
            longitude: 0,
          },
        })
      )
    );

    expect(cov.getNumberOfCells()).toEqual(8);
    expect(cov.getGeoHashRanges(10).length).toBe(8);
    expect(cov.getGeoHashRanges(11).length).toBe(8); // Recommend hashKeyLength = 11 for 10m radius searches
    expect(cov.getGeoHashRanges(12).length).toBe(11);
    expect(cov.getGeoHashRanges(13).length).toBe(32);
    expect(cov.getGeoHashRanges(13).length).toBe(32);
  });

  it("1km radius", function () {
    const cov = new Covering(
      new S2RegionCoverer().getCoveringCells(
        S2Util.getBoundingLatLngRectFromQueryRadiusInput({
          RadiusInMeter: 1000,
          CenterPoint: {
            latitude: 59,
            longitude: 0,
          },
        })
      )
    );

    expect(cov.getNumberOfCells()).toEqual(8);
    expect(cov.getGeoHashRanges(6).length).toBe(8);
    expect(cov.getGeoHashRanges(7).length).toBe(8); // Recommend hashKeyLength = 7 for 1km radius searches
    expect(cov.getGeoHashRanges(8).length).toBe(10);
    expect(cov.getGeoHashRanges(9).length).toBe(36);
    expect(cov.getGeoHashRanges(9).length).toBe(36);
  });

  it("10km radius", function () {
    const cov = new Covering(
      new S2RegionCoverer().getCoveringCells(
        S2Util.getBoundingLatLngRectFromQueryRadiusInput({
          RadiusInMeter: 10000,
          CenterPoint: {
            latitude: 59,
            longitude: 0,
          },
        })
      )
    );

    expect(cov.getNumberOfCells()).toEqual(8);
    expect(cov.getGeoHashRanges(2).length).toBe(8);
    expect(cov.getGeoHashRanges(3).length).toBe(8);
    expect(cov.getGeoHashRanges(4).length).toBe(8);
    expect(cov.getGeoHashRanges(5).length).toBe(8); // Recommend hashKeyLength = 5 for 10km radius searches
    expect(cov.getGeoHashRanges(6).length).toBe(9);
    expect(cov.getGeoHashRanges(7).length).toBe(29);
    expect(cov.getGeoHashRanges(8).length).toBe(216);
  });

  it("50km radius", function () {
    const cov = new Covering(
      new S2RegionCoverer().getCoveringCells(
        S2Util.getBoundingLatLngRectFromQueryRadiusInput({
          RadiusInMeter: 50000,
          CenterPoint: {
            latitude: 59,
            longitude: 0,
          },
        })
      )
    );

    expect(cov.getNumberOfCells()).toEqual(6);
    expect(cov.getGeoHashRanges(2).length).toBe(6);
    expect(cov.getGeoHashRanges(3).length).toBe(6);
    expect(cov.getGeoHashRanges(4).length).toBe(6); // Recommend hashKeyLength = 4 for 50km radius searches
    expect(cov.getGeoHashRanges(5).length).toBe(9);
    expect(cov.getGeoHashRanges(6).length).toBe(49);
    expect(cov.getGeoHashRanges(7).length).toBe(428);
  });

  it("100km radius", function () {
    const cov = new Covering(
      new S2RegionCoverer().getCoveringCells(
        S2Util.getBoundingLatLngRectFromQueryRadiusInput({
          RadiusInMeter: 100000,
          CenterPoint: {
            latitude: 59,
            longitude: 0,
          },
        })
      )
    );

    expect(cov.getNumberOfCells()).toEqual(8);
    expect(cov.getGeoHashRanges(2).length).toBe(8);
    expect(cov.getGeoHashRanges(3).length).toBe(8); // Recommend hashKeyLength = 3 for 100km radius searches
    expect(cov.getGeoHashRanges(4).length).toBe(11);
    expect(cov.getGeoHashRanges(5).length).toBe(36);
    expect(cov.getGeoHashRanges(6).length).toBe(292);
  });

  it("1000km radius", function () {
    const cov = new Covering(
      new S2RegionCoverer().getCoveringCells(
        S2Util.getBoundingLatLngRectFromQueryRadiusInput({
          RadiusInMeter: 1000000,
          CenterPoint: {
            latitude: 59,
            longitude: 0,
          },
        })
      )
    );

    expect(cov.getNumberOfCells()).toEqual(8);
    expect(cov.getGeoHashRanges(1).length).toBe(8); // Recommend hashKeyLength = 1 for 1000km radius searches
    expect(cov.getGeoHashRanges(2).length).toBe(10);
    expect(cov.getGeoHashRanges(3).length).toBe(35);
    expect(cov.getGeoHashRanges(4).length).toBe(289);
  });
});
