# Core Product Inventory

The production baseline uses a 48-space monthly inventory. This is large enough to feel like a real wall, but still small enough for manual curation, review, and layout quality control.

## Inventory Mix

| Size | Count | Relative price | Sellable | Intended use |
|---|---|---:|---|---|
| Tiny | 16 | 1x | Yes | Icons, very short text, small images, or minimal GIFs. |
| Small | 18 | 2x | Yes | Single images, short written pieces, calm GIFs, or project notes. |
| Medium | 9 | 4x | Yes | Larger artwork, video previews, image-led launches, or longer text. |
| Large | 4 | 8x | Yes | Prominent visual work, image series, or major creative statements. |
| Featured | 1 | 15x | No for open self-serve reservations | Curated anchor placement, guest artist, editorial work, or sponsor after review. |

Total: 48 spaces.

## Sales Model

The core product sells size and visibility categories, not exact permanent coordinates.

Visitors choose a visible available slot during reservation. That selection becomes a current-month preference and temporary hold target, not a promise that the creator owns those exact coordinates forever.

This keeps the museum flexible enough to:

- Rebalance layouts each month.
- Handle multi-month reservations without freezing the wall.
- Preserve editorial control over the composition.
- Avoid disputes when templates change.

## Multi-Month Rule

The production baseline supports one-month and three-month purchases only.

A three-month reservation guarantees:

- The same size category.
- Similar visibility.
- Similar media capability.

It does not guarantee:

- The same coordinates.
- The same shape.
- The same neighboring works.
- The same monthly template.

## Implementation Notes

- `lib/inventory-policy.ts` mirrors this decision for current UI and pricing work.
- The current static exhibition has fewer sample spaces than the target 48-space inventory.
- The featured space remains curated until the review, sponsorship, and pricing rules are mature enough for open sale.
