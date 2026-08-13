import { describe, expect, it } from "vitest";
import { coreProductInventoryTiers, coreProductInventoryTotal } from "./inventory-policy";

describe("core product inventory policy", () => {
  it("accounts for every current space", () => {
    const total = coreProductInventoryTiers.reduce((sum, tier) => sum + tier.count, 0);

    expect(total).toBe(coreProductInventoryTotal);
  });

  it("keeps the featured slot curated", () => {
    const featured = coreProductInventoryTiers.find((tier) => tier.size === "featured");

    expect(featured?.count).toBe(1);
    expect(featured?.sellable).toBe(false);
  });
});
