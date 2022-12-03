import { expect } from "chai";
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

    expect(cov.getNumberOfCells()).to.equal(8);
    expect(cov.getGeoHashRanges(10)).length(8);
    expect(cov.getGeoHashRanges(11)).length(8); // Recommend hashKeyLength = 11 for 10m radius searches
    expect(cov.getGeoHashRanges(12)).length(11);
    expect(cov.getGeoHashRanges(13)).length(32);
    expect(cov.getGeoHashRanges(13)).length(32);
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

    expect(cov.getNumberOfCells()).to.equal(8);
    expect(cov.getGeoHashRanges(6)).length(8);
    expect(cov.getGeoHashRanges(7)).length(8); // Recommend hashKeyLength = 7 for 1km radius searches
    expect(cov.getGeoHashRanges(8)).length(10);
    expect(cov.getGeoHashRanges(9)).length(36);
    expect(cov.getGeoHashRanges(9)).length(36);
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

    expect(cov.getNumberOfCells()).to.equal(8);
    expect(cov.getGeoHashRanges(2)).length(8);
    expect(cov.getGeoHashRanges(3)).length(8);
    expect(cov.getGeoHashRanges(4)).length(8);
    expect(cov.getGeoHashRanges(5)).length(8); // Recommend hashKeyLength = 5 for 10km radius searches
    expect(cov.getGeoHashRanges(6)).length(9);
    expect(cov.getGeoHashRanges(7)).length(29);
    expect(cov.getGeoHashRanges(8)).length(216);
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

    expect(cov.getNumberOfCells()).to.equal(6);
    expect(cov.getGeoHashRanges(2)).length(6);
    expect(cov.getGeoHashRanges(3)).length(6);
    expect(cov.getGeoHashRanges(4)).length(6); // Recommend hashKeyLength = 4 for 50km radius searches
    expect(cov.getGeoHashRanges(5)).length(9);
    expect(cov.getGeoHashRanges(6)).length(49);
    expect(cov.getGeoHashRanges(7)).length(428);
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

    expect(cov.getNumberOfCells()).to.equal(8);
    expect(cov.getGeoHashRanges(2)).length(8);
    expect(cov.getGeoHashRanges(3)).length(8); // Recommend hashKeyLength = 3 for 100km radius searches
    expect(cov.getGeoHashRanges(4)).length(11);
    expect(cov.getGeoHashRanges(5)).length(36);
    expect(cov.getGeoHashRanges(6)).length(292);
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

    expect(cov.getNumberOfCells()).to.equal(8);
    expect(cov.getGeoHashRanges(1)).length(8); // Recommend hashKeyLength = 1 for 1000km radius searches
    expect(cov.getGeoHashRanges(2)).length(10);
    expect(cov.getGeoHashRanges(3)).length(35);
    expect(cov.getGeoHashRanges(4)).length(289);
  });
});
