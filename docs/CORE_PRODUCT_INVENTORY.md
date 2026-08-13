# Editorial Tile Inventory

The wall is an editorial composition, not a sales inventory.

Tile size communicates historical importance inside a single month. It must not be sold secretly or influenced by sponsorship without clear labeling.

## Importance Mix

| Level | Typical count | Tile size | Intended use |
|---|---:|---|---|
| Featured | 1-2 | Featured or large | Defining events of the month. |
| Major | 3-6 | Large or medium | Globally or historically significant events. |
| Notable | 8-18 | Medium or small | Important regional, cultural, scientific, legal, sports, or business events. |
| Signal | Flexible | Small or tiny | Smaller signals that reveal the texture of the month. |

## Implementation Notes

- `lib/exhibition-data.ts` now seeds June 1984 with historical event tiles while inherited type names remain in place.
- Public walls should show published event content only.
- Draft and in-review event candidates belong in admin/editorial views.
- Sponsored content, if introduced later, must be visually distinct from editorial importance.
