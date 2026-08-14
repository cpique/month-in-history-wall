import { describe, expect, it } from "vitest";
import {
  currentExhibition,
  getEditorialTileSize,
  getPublishedSpaces,
  getTileLayoutClass,
  tileLayoutClassByImportance,
} from "./exhibition-data";

describe("current exhibition wall states", () => {
  it("partitions every sample tile into one public state", () => {
    const published = getPublishedSpaces();
    const ids = published.map((space) => space.id);

    expect(ids).toHaveLength(currentExhibition.spaces.length);
    expect(new Set(ids).size).toBe(currentExhibition.spaces.length);
  });

  it("matches the current sample counts shown by the wall", () => {
    expect(getPublishedSpaces()).toHaveLength(12);
  });

  it("attaches at least one source to every published historical event", () => {
    expect(
      getPublishedSpaces().every((space) => space.sources && space.sources.length > 0),
    ).toBe(true);
  });

  it("derives tile footprint from editorial importance", () => {
    for (const space of getPublishedSpaces()) {
      expect(space.importanceLevel).toBeDefined();
      expect(getTileLayoutClass(space)).toBe(
        tileLayoutClassByImportance[space.importanceLevel!],
      );
    }
  });

  it("promotes major events to large editorial tiles", () => {
    const majorEvents = getPublishedSpaces().filter(
      (space) => space.importanceLevel === "major",
    );

    expect(majorEvents).not.toHaveLength(0);
    expect(majorEvents.every((space) => getEditorialTileSize(space) === "large")).toBe(true);
  });
});
