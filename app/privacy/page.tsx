import { LegalPage } from "@/components/legal/legal-page";

export const metadata = {
  title: "Privacy Policy | Month in History Wall",
  description: "Working privacy policy for Month in History Wall.",
};

const sections = [
  {
    title: "Information we may collect",
    items: [
      "Correction request details such as message text, optional source URL, optional contact email, event id, and month slug.",
      "Admin/editorial account information provided through Clerk when admin authentication is enabled.",
      "Limited technical information needed for security, reliability, and abuse prevention.",
    ],
  },
  {
    title: "How we use it",
    items: [
      "To review correction requests and improve sourced historical event records.",
      "To communicate about correction or privacy requests when contact information is provided.",
      "To operate the archive, protect admin routes, and understand aggregate usage only after analytics rules are defined.",
    ],
  },
  {
    title: "Public archive",
    items: [
      "Published event titles, summaries, context, media URLs, and source citations may remain public in the permanent archive.",
      "Private contact information and internal review notes should not be published.",
    ],
  },
  {
    title: "Retention and requests",
    items: [
      "Published event and locked month records may remain in the public archive; correction requests and operational records should be retained only as long as needed.",
      "The production policy must provide a contact path for access, correction, deletion, and privacy questions.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      description="This working policy explains the information Month in History Wall may need to operate a sourced historical archive, review corrections, and protect admin workflows. It requires legal review before production launch."
      sections={sections}
      title="Privacy policy."
    />
  );
}
