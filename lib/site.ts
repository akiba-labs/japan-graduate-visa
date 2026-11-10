export const SITE_NAME = "Japan Graduate Visa Check";

export const SITE_TAGLINE =
  "Graduating from a Japanese university, vocational school or language school? See when to change from student visa to a work visa (ISA asks for 1 Dec–31 Jan for April starts), how to stay and keep job hunting, when part-time work stops, the 14-day school-leaving notice and every date that matters.";

export const DISCLAIMER_SHORT =
  "Educational date checklist, not immigration or legal advice; not affiliated with the Immigration Services Agency of Japan, the Ministry of Justice or any school. ISA decides; confirm with your school's international office or regional immigration bureau before you rely on a date.";

export const HONESTY =
  "Rules as of 2026-11-10 from ISA's 留学→就労資格 notice, the change-of-status page (16-2), the 継続就職活動 and 内定者 特定活動 pages and university guidance on part-time work after graduation. It works from the dates you type; it cannot see your card, school records or any decision.";

export const SIBLING_TOOLS = [
  { href: "https://japan-visa-renewal.vercel.app", label: "Japan Visa Renewal Window Check" },
  { href: "https://japan-jlpt-check.vercel.app", label: "Japan JLPT Level Check" },
  { href: "https://japan-job-loss.vercel.app", label: "Japan Job Loss Check" },
  { href: "https://japan-medical-cost-cap.vercel.app", label: "Japan High-Cost Medical Expense Check" },
  { href: "https://japan-lost-item.vercel.app", label: "Japan Lost Item Check" },
  { href: "https://japan-leaving-tax.vercel.app", label: "Japan Leaving Tax Check" },
  { href: "https://japan-disaster-prep.vercel.app", label: "Japan Disaster Prep Check" },
  { href: "https://japan-parttime-check.vercel.app", label: "Japan Part-time Work Check" },
  { href: "https://japan-reentry-check.vercel.app", label: "Japan Re-entry Deadline Check" },
  { href: "https://japan-visa-fee.vercel.app", label: "Japan Visa Fee Calculator" },
  { href: "https://japan-pr-check.vercel.app", label: "Japan PR Guideline Check" },
  { href: "https://japan-hsp-points.vercel.app", label: "Japan HSP Points Calculator" },
  { href: "https://japan-mynumber-card-check.vercel.app", label: "Japan My Number Card Check" },
  { href: "https://japan-pet-quarantine.vercel.app", label: "Japan Pet Quarantine Check" },
  { href: "https://japan-overseas-dependents.vercel.app", label: "Japan Overseas Dependents Check" },
  { href: "https://japan-driving-check.vercel.app", label: "Japan Driving Check" },
  { href: "https://japan-tb-screening.vercel.app", label: "Japan TB Screening Check" },
  { href: "https://japan-customs-allowance.vercel.app", label: "Japan Customs Allowance" },
  { href: "https://japan-luggage.vercel.app", label: "Japan Luggage Check" },
  { href: "https://japan-tax-free-refund.vercel.app", label: "Japan Tax-Free Refund" },
  { href: "https://japan-intl-postage.vercel.app", label: "Japan Postage Calculator" },
  { href: "https://japan-alert-decoder.vercel.app", label: "Japan Alert Decoder" },
  { href: "https://japan-dual-pricing.vercel.app", label: "Japan Dual Pricing Check" },
  { href: "https://kyushu-travel-discount.vercel.app", label: "Kyushu Travel Discount" },
  { href: "https://house-rules-check.vercel.app", label: "House Rules Check" },
  { href: "https://japan-trip-brain.vercel.app", label: "Japan Trip Brain" },
  { href: "https://free-agent-tools.vercel.app", label: "Free Agent Tools MCP" },
] as const;

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production.replace(/^https?:\/\//, "")}`;
  return "https://japan-graduate-visa.vercel.app";
}
