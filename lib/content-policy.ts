export type PolicySection = {
  title: string;
  items: string[];
};

export const contentPolicySummary =
  "One Month Museum accepts original, permissioned creative work that can be safely reviewed, exhibited, archived, and understood by visitors.";

export const contentPolicySections: PolicySection[] = [
  {
    title: "Allowed formats",
    items: [
      "Images, GIFs, short text, muted video previews, and approved external links are suitable for the first public reservation flow.",
      "Every visual submission should include alt text before it can be published.",
      "Text work should stay readable, honest, and compatible with the selected space size.",
    ],
  },
  {
    title: "Not accepted",
    items: [
      "Explicit sexual content, graphic violence, hate speech, harassment, extremist propaganda, threats, scams, malware, phishing, or deceptive links.",
      "Stolen artwork, copyright-infringing material, impersonation, doxxing, hidden tracking, unrestricted embedded code, or rapidly flashing media.",
      "Political advertising, illegal products or services, or submissions that are technically safe but misleading, very low quality, or incompatible with the exhibition.",
    ],
  },
  {
    title: "Review outcome",
    items: [
      "Payment should reserve a space, but manual approval decides whether the work is exhibited.",
      "If a submission is rejected before publication, the payment authorization should be cancelled or refunded when payments are introduced.",
      "Approved work can be displayed during the purchased month and preserved in the permanent archive snapshot.",
    ],
  },
  {
    title: "Creator responsibility",
    items: [
      "Creators must own the submitted work or have permission to exhibit and archive it.",
      "Creators grant the museum a limited license to display, archive, thumbnail, promote, and show screenshots of accepted work.",
      "Copyright complaints and takedown requests need a documented review path before the paid launch.",
    ],
  },
];