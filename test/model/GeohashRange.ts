import { GeohashRange } from "../../src/model/GeohashRange";
import * as Long from "long";

describe("GeohashRange.trySplit", function () {
  const range = new GeohashRange(
    Long.fromString("1000000000000000000"),
    Long.fromString("1000000000010000000")
  );

  it("returns the same range when nothing needs splitting", function () {
    expect(range.trySplit(1)).toStrictEqual([range]);
    expect(range.trySplit(3)).toStrictEqual([range]);
    expect(range.trySplit(4)).toStrictEqual([range]);
    expect(range.trySplit(5)).toStrictEqual([range]);
    expect(range.trySplit(6)).toStrictEqual([range]);
    expect(range.trySplit(7)).toStrictEqual([range]);
    expect(range.trySplit(8)).toStrictEqual([range]);
    expect(range.trySplit(9)).toStrictEqual([range]);
    expect(range.trySplit(10)).toStrictEqual([range]);
    expect(range.trySplit(11)).toStrictEqual([range]);
  });

  it("splits correctly on the given digit", function () {
    expect(range.trySplit(12)).toStrictEqual([
      new GeohashRange(
        Long.fromString("1000000000000000000"),
        Long.fromString("1000000000009999999")
      ),
      new GeohashRange(
        Long.fromString("1000000000010000000"),
        Long.fromString("1000000000010000000")
      ),
    ]);

    expect(range.trySplit(13)).toStrictEqual([
      new GeohashRange(
        Long.fromString("1000000000000000000"),
        Long.fromString("1000000000000999999")
      ),
      new GeohashRange(
        Long.fromString("1000000000001000000"),
        Long.fromString("1000000000001999999")
      ),
      new GeohashRange(
        Long.fromString("1000000000002000000"),
        Long.fromString("1000000000002999999")
      ),
      new GeohashRange(
        Long.fromString("1000000000003000000"),
        Long.fromString("1000000000003999999")
      ),
      new GeohashRange(
        Long.fromString("1000000000004000000"),
        Long.fromString("1000000000004999999")
      ),
      new GeohashRange(
        Long.fromString("1000000000005000000"),
        Long.fromString("1000000000005999999")
      ),
      new GeohashRange(
        Long.fromString("1000000000006000000"),
        Long.fromString("1000000000006999999")
      ),
      new GeohashRange(
        Long.fromString("1000000000007000000"),
        Long.fromString("1000000000007999999")
      ),
      new GeohashRange(
        Long.fromString("1000000000008000000"),
        Long.fromString("1000000000008999999")
      ),
      new GeohashRange(
        Long.fromString("1000000000009000000"),
        Long.fromString("1000000000009999999")
      ),
      new GeohashRange(
        Long.fromString("1000000000010000000"),
        Long.fromString("1000000000010000000")
      ),
    ]);
  });
});
