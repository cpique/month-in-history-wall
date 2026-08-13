import { LegalPage } from "@/components/legal/legal-page";

export const metadata = {
  title: "Privacy Policy | One Month Museum",
  description: "Working privacy policy for One Month Museum.",
};

const sections = [
  {
    title: "Information we may collect",
    items: [
      "Creator and reservation details such as name, email, work metadata, selected months, and policy acknowledgement.",
      "Operational information such as review, payment, and support status.",
      "Limited technical information needed for security, reliability, and abuse prevention.",
    ],
  },
  {
    title: "How we use it",
    items: [
      "To review, publish, archive, or remove submitted work.",
      "To communicate about reservations, review outcomes, payments, and support.",
      "To operate the museum and understand aggregate usage after analytics are introduced.",
    ],
  },
  {
    title: "Public archive",
    items: [
      "Approved creator names, work titles, descriptions, media, links, and placement may remain public in the permanent archive.",
      "Private contact information and internal review notes should not be published.",
    ],
  },
  {
    title: "Retention and requests",
    items: [
      "Approved exhibition records may remain in the public archive; other records should be retained only as long as operational, legal, accounting, or safety needs require.",
      "The production policy must provide a contact path for access, correction, deletion, and privacy questions.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      description="This working policy explains the information the museum may need to operate reservations, review submissions, publish work, and preserve the archive. It requires legal review before production launch."
      sections={sections}
      title="Privacy policy."
    />
  );
}
