# Content Policy

One Month Museum accepts original, permissioned creative work that can be safely reviewed, exhibited, archived, and understood by visitors.

This document is the source-facing companion to the public `/policy` page. It should stay aligned with reservation form copy, review dashboard decisions, and payment authorization rules.

## Allowed Formats

- Images, GIFs, short text, muted video previews, and approved external links are suitable for the public reservation flow.
- Every visual submission should include alt text before it can be published.
- Text work should stay readable, honest, and compatible with the selected space size.

## Not Accepted

- Explicit sexual content, graphic violence, hate speech, harassment, extremist propaganda, threats, scams, malware, phishing, or deceptive links.
- Stolen artwork, copyright-infringing material, impersonation, doxxing, hidden tracking, unrestricted embedded code, or rapidly flashing media.
- Political advertising, illegal products or services, or submissions that are technically safe but misleading, very low quality, or incompatible with the exhibition.

## Review Outcome

- Payment reserves a space, but manual approval decides whether the work is exhibited.
- If a submission is rejected before publication, the payment authorization is cancelled or refunded.
- Approved work is displayed during the purchased month and preserved in the permanent archive snapshot.

## Creator Responsibility

- Creators must own the submitted work or have permission to exhibit and archive it.
- Creators grant the museum a limited license to display, archive, thumbnail, promote, and show screenshots of accepted work.
- Copyright complaints and takedown requests need a documented review path before the paid launch.

## Implementation Notes

- The `/policy` route is public and informational.
- The reservation checkbox links to `/policy` and is enforced by server-side validation.
- Admin review tooling references these same categories when approving, rejecting, or requesting changes.
