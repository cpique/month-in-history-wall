import { describe, expect, it } from "vitest";
import { searchPublishedEvents } from "./search-service";

describe("search published events", () => {
  it("returns an empty array for an empty query", async () => {
    const results = await searchPublishedEvents("   ");

    expect(results).toEqual([]);
  });

  it("finds static events by title", async () => {
    const results = await searchPublishedEvents("Tetris");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.title).toContain("Tetris");
  });

  it("finds static events by category", async () => {
    const results = await searchPublishedEvents("music");

    expect(results.length).toBeGreaterThanOrEqual(2);
    expect(results.every((event) => event.category.toLowerCase() === "music")).toBe(true);
  });

  it("finds static events by country", async () => {
    const results = await searchPublishedEvents("France");

    expect(results.some((event) => event.title.includes("UEFA Euro"))).toBe(true);
  });

  it("does not expose draft or unavailable spaces from static data", async () => {
    const results = await searchPublishedEvents("available");

    expect(results).toEqual([]);
  });

  it("is case-insensitive", async () => {
    const lower = await searchPublishedEvents("ghostbusters");
    const upper = await searchPublishedEvents("GHOSTBUSTERS");

    expect(lower.length).toBeGreaterThan(0);
    expect(upper.length).toBe(lower.length);
  });
});
