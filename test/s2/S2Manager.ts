import { S2Manager } from "../../src/s2/S2Manager";
import { expect } from "chai";
import * as Long from "long";

describe("S2Manager", () => {
  it("generateGeoHash", () => {
    expect(
      S2Manager.generateGeohash({
        latitude: 52.1,
        longitude: 2,
      }).toString(10)
    ).to.equal("5177531549489041509");
  });

  it("generateHashKey", () => {
    expect(
      S2Manager.generateHashKey(
        Long.fromString("5177531549489041509", false, 10),
        6
      ).toNumber()
    ).to.equal(517753);
  });
});
