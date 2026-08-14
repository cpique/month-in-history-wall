# LLM Month Import Prompt

Use this prompt when asking an LLM to draft a month import file for the seeder.

The output should match `schemas/history-month.schema.json` and should be saved as a JSON file under `data/imports/`, for example `data/imports/2001-09.json`.

## Prompt

```text
You are preparing a sourced historical month import for Month in History Wall.

Create valid JSON only. Do not wrap it in markdown. Do not include comments.

Target month:
- Month number: {{MONTH_NUMBER}}
- Year: {{YEAR}}
- Month title: {{MONTH_TITLE}}

Goal:
Create a broad, international historical snapshot of this month. Include politics, war/conflict, science/technology, culture, sports, business/economics, disasters, law, social movements, space, deaths/births, and everyday cultural signals where relevant.

Output schema:
{
  "month": number,
  "year": number,
  "title": string,
  "description": string,
  "status": "draft",
  "layoutSeed": string,
  "events": [
    {
      "slug": "url-safe-event-slug",
      "title": "Event title",
      "summary": "1-2 sentence factual summary.",
      "context": "Short background explaining what led to or surrounds the event.",
      "whyItMatters": "Short explanation of historical significance.",
      "category": "Politics | Conflict | Science | Technology | Culture | Music | Film | Sports | Business | Disaster | Law | Social Movement | Space | Other",
      "date": "YYYY-MM-DD or YYYY-MM or ISO timestamp if known",
      "dateRange": {
        "start": "YYYY-MM-DD",
        "end": "YYYY-MM-DD"
      },
      "location": "City/region/country, or broader location",
      "countries": ["Country names"],
      "relevanceScore": number from 0 to 100,
      "media": {
        "kind": "image",
        "url": "PHOTO_PLACEHOLDER",
        "alt": "Plain-language description of the desired image.",
        "caption": "Suggested caption.",
        "credit": "UNKNOWN",
        "license": "UNKNOWN"
      },
      "detailMarkdown": "A concise markdown detail body, 2-5 short paragraphs. Include no footnote syntax unless source URLs are also present in sources.",
      "sources": [
        {
          "title": "Source title",
          "url": "https://source-url",
          "publisher": "Publisher name",
          "sourceType": "encyclopedia | archive | official | news | academic | reference | other",
          "notes": "Optional note about what this source supports."
        }
      ]
    }
  ]
}

Rules:
- Return valid JSON only.
- Include 20 to 40 events unless the month is sparse or the user requested a different count.
- Every event must have at least one credible source URL.
- Prefer primary or reputable sources: official records, museums, libraries, archives, encyclopedias, academic sources, reputable newspapers, sports/statistics databases, or official organization pages.
- Do not fabricate sources, URLs, dates, publishers, or media credits.
- If an exact day is unknown, use "YYYY-MM" in "date" and explain uncertainty in "detailMarkdown".
- Use either "date" or "dateRange". Use "dateRange" for multi-day events.
- Keep "status" as "draft".
- Set "layoutSeed" to a stable value like "{{YEAR}}-{{TWO_DIGIT_MONTH}}-v1".
- "relevanceScore" is relative inside this month: 100 is the defining event, 70-95 major events, 35-69 notable events, 0-34 contextual signals.
- Do not make every event highly relevant. The wall needs uneven importance.
- For media, use "PHOTO_PLACEHOLDER" when you do not have a verified image URL. Do not invent Wikimedia filenames or media URLs.
- Still provide useful media alt/caption text describing the kind of image an editor should find manually.
- Do not include unsourced claims in "summary", "context", "whyItMatters", or "detailMarkdown".

Quality checks before final output:
- JSON parses.
- No markdown fences.
- No trailing commas.
- All event slugs are unique.
- All events have title, summary, category, relevanceScore, and at least one source.
- relevanceScore values create a clear hierarchy rather than a flat list.
```

## Suggested Follow-Up Prompt

Use this after the first draft if you want the LLM to self-audit before you seed it:

```text
Audit the JSON you just produced against the Month in History Wall import rules.

Return a corrected JSON object only.

Check:
- It is valid JSON.
- It matches the requested month and year.
- Every event belongs to that month.
- Every event has at least one real source URL.
- No source URL, publisher, date, or media URL is fabricated.
- Media URLs are PHOTO_PLACEHOLDER unless verified.
- relevanceScore values are meaningfully distributed from defining events down to smaller signals.
- Slugs are unique and URL-safe.
- The JSON contains no comments, markdown fences, or trailing commas.
```

## Manual Media Pass

After the JSON draft is sourced, replace `PHOTO_PLACEHOLDER` values manually with verified media URLs. Keep `credit` and `license` accurate. If a media URL cannot be verified, leave the placeholder or remove the `media` object before seeding.
