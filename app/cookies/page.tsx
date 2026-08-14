import { LegalPage } from "@/components/legal/legal-page";

export const metadata = {
  title: "Cookie Policy | Month in History Wall",
  description: "Working cookie policy for Month in History Wall.",
};

const sections = [
  {
    title: "Current product",
    items: [
      "The current public application does not intentionally set analytics, advertising, or payment cookies.",
      "Admin authentication may use Clerk cookies when Clerk is configured.",
      "Browser and hosting infrastructure may still use strictly necessary technical mechanisms outside the application code.",
    ],
  },
  {
    title: "Future categories",
    items: [
      "Strictly necessary cookies for security, sessions, authentication, and requested features.",
      "Preference cookies for choices such as theme or consent state.",
      "Measurement cookies only after purpose, retention, opt-out, and consent requirements are defined.",
      "No advertising or cross-site tracking cookies without a separate product and legal decision.",
    ],
  },
  {
    title: "Control and disclosure",
    items: [
      "Production must document cookie names, providers, purposes, duration, and first- or third-party status.",
      "Non-essential cookies should not load before the required consent decision in jurisdictions where consent is required.",
    ],
  },
];

export default function CookiesPage() {
  return (
    <LegalPage
      description="This working policy documents the current public no-tracking application and the consent decisions required before analytics, broader authentication, or theme preferences are added."
      sections={sections}
      title="Cookie policy."
    />
  );
}
