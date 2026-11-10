import { InputError, type Endpoint, type Input } from "./agent-api";
import { DISCLAIMER, METHODS, PLANS, RULES_AS_OF, RuleInputError, SCHOOLS, checkGraduate, type Method, type Plan, type School } from "./graduate";
import { SITE_NAME, SITE_TAGLINE } from "./site";

export const PUBLIC_URL = "https://japan-graduate-visa.vercel.app";
export const API_DISCLAIMER = DISCLAIMER;
export const API_INFO = { title: `${SITE_NAME} API`, description: SITE_TAGLINE, version: "1.0.0" };

export const EXAMPLE_GET = "/api/check?graduationDate=2027-03-20&jobStartDate=2027-04-01&studentExpiry=2027-07-15&plan=job_offer";

function first(v: unknown): unknown {
  return Array.isArray(v) ? v[0] : v;
}
function s(v: unknown): string | null {
  const f = first(v);
  return f === undefined || f === null || String(f).trim() === "" ? null : String(f).trim();
}
function tb(v: unknown, name: string): boolean | undefined {
  const f = first(v);
  if (typeof f === "boolean") return f;
  if (f === undefined || f === null || String(f).trim() === "") return undefined;
  const t = String(f).trim();
  if (/^(1|true|yes|y|on|はい)$/i.test(t)) return true;
  if (/^(0|false|no|n|off|いいえ)$/i.test(t)) return false;
  throw new InputError(`${name} must be true or false`);
}
function months(v: unknown, name: string): number | null {
  const f = s(v);
  if (f === null) return null;
  const m = f.toLowerCase().replace(/\s+/g, "").match(/^(\d+(?:\.\d+)?)(y|yr|yrs|year|years|年|m|mo|month|months|か月|ヶ月|ケ月|月)?$/);
  if (!m) throw new InputError(`${name} must be months (e.g. 12) or years (e.g. 1y)`);
  const x = Number(m[1]);
  return m[2] && /^(y|yr|yrs|year|years|年)$/.test(m[2]) ? x * 12 : x;
}

const PLAN_ALIASES: Record<string, Plan> = {
  offer: "job_offer", job: "job_offer", work: "job_offer", hired: "job_offer", 内定: "job_offer", 就職: "job_offer", 就職内定: "job_offer",
  hunting: "job_hunting", job_search: "job_hunting", jobsearch: "job_hunting", 就職活動: "job_hunting", 継続就職活動: "job_hunting",
  leave: "leaving", go_home: "leaving", return_home: "leaving", depart: "leaving", 帰国: "leaving", 出国: "leaving",
  study: "further_study", grad_school: "further_study", graduate_school: "further_study", 進学: "further_study", 大学院: "further_study",
};
const SCHOOL_ALIASES: Record<string, School> = {
  uni: "university", college: "university", graduate_school: "university", junior_college: "university", 大学: "university", 大学院: "university", 短大: "university", 短期大学: "university",
  senmon: "vocational", senmon_gakko: "vocational", vocational_school: "vocational", 専門学校: "vocational", 専修学校: "vocational", 専門士: "vocational",
  language: "language_school", japanese_language_school: "language_school", nihongo: "language_school", 日本語学校: "language_school", 日本語教育機関: "language_school",
};
const METHOD_ALIASES: Record<string, Method> = { window: "counter", in_person: "counter", 窓口: "counter", オンライン: "online", web: "online" };

function pick<T extends string>(raw: string | null, allowed: readonly T[], aliases: Record<string, T>, name: string): T | undefined {
  if (raw === null) return undefined;
  const k = raw.toLowerCase().replace(/[\s-]+/g, "_");
  const v = (aliases[k] ?? aliases[raw] ?? k) as T;
  if (!(allowed as readonly string[]).includes(v)) throw new InputError(`Invalid ${name} "${raw}". Allowed: ${allowed.join(", ")}`);
  return v;
}

export function computeCheck(input: Input) {
  try {
    const graduationDate = s(input.graduationDate ?? input.graduation ?? input.gradDate ?? input.卒業日);
    if (!graduationDate) throw new InputError("Missing graduationDate (YYYY-MM-DD, your expected graduation day).");
    return checkGraduate({
      graduationDate,
      studentExpiry: s(input.studentExpiry ?? input.expiryDate ?? input.expiry ?? input.満了日),
      plan: pick(s(input.plan ?? input.after ?? input.next), PLANS, PLAN_ALIASES, "plan"),
      jobStartDate: s(input.jobStartDate ?? input.startDate ?? input.start ?? input.入社日),
      offerDate: s(input.offerDate ?? input.offer ?? input.内定日),
      school: pick(s(input.school ?? input.schoolType), SCHOOLS, SCHOOL_ALIASES, "school"),
      foreignBachelor: tb(input.foreignBachelor ?? input.foreignDegree, "foreignBachelor"),
      appliedDate: s(input.appliedDate ?? input.applied),
      expectedGrantMonths: months(input.expectedGrantMonths ?? input.grantMonths, "expectedGrantMonths"),
      method: pick(s(input.method), METHODS, METHOD_ALIASES, "method"),
      today: s(input.today),
    });
  } catch (e) {
    if (e instanceof RuleInputError) throw new InputError(e.message);
    throw e;
  }
}

export const ENDPOINTS: Record<"check", Endpoint> = {
  check: {
    path: "/api/check",
    operationId: "japanGraduateVisaCheck",
    summary: "International student graduating in Japan: when to change visa, job-hunting visa, part-time end, 14-day notice",
    description: `Applies ISA guidance (as of ${RULES_AS_OF}) to a student's graduation. job_offer: change from 留学 to a work status (usually 技術・人文知識・国際業務); for April starts ISA asks for filing 1 Dec–31 Jan; otherwise aim for 2 months before start (standard processing 1–2 months); file with a certificate of expected graduation, collect the card after graduation; renew 留学 first if it ends on/before 31 Jan while still studying; 内定者 特定活動 for long gaps (hire within 1 year of offer and 1 year 6 months of graduation); document omission since 2025-12-01. job_hunting: 継続就職活動 特定活動 6 months + 1 renewal (~1 year) for Japanese university / vocational (専門士) grads with a school recommendation. leaving / further_study: dated steps. Always: part-time work on 留学 permission ends at graduation; report leaving the school within 14 days. Returns verdict (too_early | open | urgent | applied | not_eligible | expired | info), summary, targetStatus, windowOpens, recommendedBy, lastDay, partTimeEnds, notifySchoolLeftBy, jobHuntingUntil, hireBy, fee, deadlines, actions, warnings, sources, disclaimer.`,
    params: [
      { name: "graduationDate", type: "string", required: true, description: "YYYY-MM-DD (expected) graduation day. Aliases: graduation, gradDate, 卒業日." },
      { name: "plan", type: "string", enum: PLANS, description: "job_offer (default when jobStartDate given) | job_hunting | leaving | further_study. Aliases: 内定, 就職活動, 帰国, 進学…" },
      { name: "jobStartDate", type: "string", description: "YYYY-MM-DD job start (required for job_offer). Aliases: startDate, 入社日." },
      { name: "studentExpiry", type: "string", description: "YYYY-MM-DD 留学 period-of-stay expiry on your residence card. Aliases: expiryDate, 満了日." },
      { name: "school", type: "string", enum: SCHOOLS, default: "university", description: "university (incl. graduate school, junior college) | vocational (専門学校 / 専門士) | language_school | other." },
      { name: "foreignBachelor", type: "boolean", default: false, description: "Language-school students: you hold a foreign bachelor's degree." },
      { name: "offerDate", type: "string", description: "YYYY-MM-DD job offer (内定) date, for the 内定者 特定活動 hiring limit." },
      { name: "appliedDate", type: "string", description: "YYYY-MM-DD if you already filed." },
      { name: "expectedGrantMonths", type: "string", description: "Period you expect to be granted, for the fee (default 12; job hunting 6)." },
      { name: "method", type: "string", enum: METHODS, default: "counter", description: "counter (revenue stamps) or online." },
      { name: "today", type: "string", description: "Override today's date (default: today in Japan)." },
    ],
    example: EXAMPLE_GET,
    compute: computeCheck,
  },
};

export const PLUGIN = {
  name: "Japan Graduate Visa Check",
  nameForModel: "japan_graduate_visa",
  descriptionForHuman: "Graduating in Japan? When to change from student visa, job-hunting visa and deadlines.",
  descriptionForModel:
    "Use when an international student in Japan asks what to do with their visa around graduation: when to apply to change from Student (留学) to a work visa such as 技術・人文知識・国際業務 (for April starts ISA asks for 1 Dec–31 Jan), whether they can apply before graduating, what happens if the decision is late, how to stay to keep job hunting (特定活動 継続就職活動, 6 months + 1 renewal), how to wait for a later start (内定者 特定活動), when part-time work must stop (graduation day) and the 14-day school-leaving notice. Computes dated answers; relay the disclaimer (educational; ISA decides).",
  logo: "/icon.svg",
};
