import { describe, expect, it } from "vitest";
import {
  currentExhibition,
  getPublishedSpaces,
  getReservableSpaces,
  getStatusSpaces,
} from "./exhibition-data";

describe("current exhibition wall states", () => {
  it("partitions every sample tile into one public state", () => {
    const published = getPublishedSpaces();
    const status = getStatusSpaces();
    const ids = [...published, ...status].map((space) => space.id);

    expect(ids).toHaveLength(currentExhibition.spaces.length);
    expect(new Set(ids).size).toBe(currentExhibition.spaces.length);
  });

  it("matches the current sample counts shown by the wall", () => {
    expect(getPublishedSpaces()).toHaveLength(12);
    expect(getReservableSpaces()).toHaveLength(0);
    expect(getStatusSpaces()).toHaveLength(0);
  });

  it("attaches at least one source to every published historical event", () => {
    expect(
      getPublishedSpaces().every((space) => space.sources && space.sources.length > 0),
    ).toBe(true);
  });
});
