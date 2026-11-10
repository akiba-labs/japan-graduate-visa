// Japan Graduate Visa Check: what an international student must do, and by when, around graduation.
// Educational reading of ISA's 留学→就労資格 notice (10_00240), 在留資格変更許可申請 (16-2), the
// 継続就職活動 and 内定者 特定活動 pages and university guidance on part-time work after graduation.
// Not immigration or legal advice.

export const RULES_AS_OF = "2026-11-10";

export const SOURCES = [
  "https://www.moj.go.jp/isa/10_00240.html",
  "https://www.moj.go.jp/isa/content/001353746.pdf",
  "https://www.moj.go.jp/isa/applications/procedures/16-2.html",
  "https://www.moj.go.jp/isa/applications/resources/nyukan_nyukan84.html",
  "https://www.moj.go.jp/isa/applications/resources/nyuukokukanri07_00013.html",
  "https://www.moj.go.jp/isa/applications/status/designatedactivities15.html",
  "https://www.moj.go.jp/isa/applications/status/designatedactivities11.html",
  "https://www.moj.go.jp/isa/applications/procedures/nyuukokukanri07_00003.html",
  "https://www.meiji.ac.jp/cip/student_support/entry_clearance/activities.html",
] as const;

export const DISCLAIMER =
  "Educational date checklist, not immigration or legal advice. Not affiliated with the Immigration Services Agency of Japan (ISA), the Ministry of Justice or any school. It applies ISA's published guidance (as of the date shown) to the dates you enter; it cannot see your residence card, your school's records or any decision. ISA decides, and regional bureaus may announce their own timing; confirm with your school's international office, your regional immigration bureau, ISA's information centre (0570-013904) or a licensed gyoseishoshi / lawyer.";

export const PLANS = ["job_offer", "job_hunting", "leaving", "further_study"] as const;
export const SCHOOLS = ["university", "vocational", "language_school", "other"] as const;
export const METHODS = ["counter", "online"] as const;
export type Plan = (typeof PLANS)[number];
export type School = (typeof SCHOOLS)[number];
export type Method = (typeof METHODS)[number];
export type Verdict = "too_early" | "open" | "urgent" | "applied" | "not_eligible" | "expired" | "info";

export class RuleInputError extends Error {}

export type FeeBand = { label: string; maxMonths: number; counterJPY: number; onlineJPY: number; onlineProcessingJPY: number };
// 2026-10-01 fee table by period GRANTED (ISA 16-2 counter table; online table as on ISA's fee page).
export const FEE_BANDS: FeeBand[] = [
  { label: "3 months or less", maxMonths: 3, counterJPY: 10000, onlineJPY: 10000, onlineProcessingJPY: 330 },
  { label: "Over 3 up to 6 months", maxMonths: 6, counterJPY: 18000, onlineJPY: 15000, onlineProcessingJPY: 330 },
  { label: "Over 6 months, under 1 year", maxMonths: 11.99, counterJPY: 25000, onlineJPY: 21000, onlineProcessingJPY: 330 },
  { label: "1 year", maxMonths: 12, counterJPY: 33000, onlineJPY: 27000, onlineProcessingJPY: 330 },
  { label: "Over 1 year, under 3 years", maxMonths: 35.99, counterJPY: 48000, onlineJPY: 42000, onlineProcessingJPY: 330 },
  { label: "3 years or more, under 5 years", maxMonths: 59.99, counterJPY: 64000, onlineJPY: 56000, onlineProcessingJPY: 550 },
  { label: "5 years or more", maxMonths: Infinity, counterJPY: 75000, onlineJPY: 65000, onlineProcessingJPY: 550 },
];

export const RULES = {
  aprilStart: "For work starting in April, ISA asks students to apply to change from 留学 to a work status between 1 December and the end of January (10_00240). It is a request, not a legal deadline: later applications are still accepted but may not be decided by April.",
  changeOfStatus: "Change of status (在留資格変更許可申請, ISA 16-2): file from when the reason arises up to your current expiry date. Standard processing 1–2 months. You can file with a certificate of expected graduation (卒業見込み証明書); the new card is collected after graduation with the graduation certificate. You cannot start the job until the new status is granted.",
  studentExpiryBeforeFeb: "If your 留学 period ends on or before 31 January and you are still studying after that, extend 留学 first instead of filing the work-status change in the Dec–Jan window (10_00240).",
  docOmission: "Since 2025-12-01, changes from 留学 to 技術・人文知識・国際業務 or 研究 may omit documents (same as category 2) for Japanese university / graduate school / junior college graduates, graduates of foreign universities ranked in the top 300 of two of QS / THE / ARWU, or employers already employing a former student who changed from 留学 and renewed once. Not for dispatch employment. Attach the explanation form.",
  jobHunting: "継続就職活動 特定活動: university (incl. graduate school, junior college), 専修学校専攻科 or 専門士 vocational graduates with a school recommendation can change to 特定活動 for 6 months, renewable once (about 1 year after graduation). A 2nd year is possible only through an eligible local-government job programme. Foreign-bachelor graduates of certain certified Japanese language schools have a similar route.",
  jobOfferWait: "内定者 特定活動: graduates of a Japanese university or vocational school with an offer can stay until hiring if hired within 1 year of the offer AND within 1 year 6 months of graduation, the job is expected to qualify for a work status, and the employer signs a pledge.",
  partTime: "Part-time work on a 留学 資格外活動 permission ends at graduation, even if your 留学 period has time left (school guidance based on ISA rules). On 継続就職活動 or 内定者 特定活動 you can get a new 資格外活動 permission for up to 28 hours a week.",
  notification: "Report leaving your school (所属機関に関する届出) to ISA within 14 days of graduation (Immigration Control Act art. 19-16), online or at a bureau.",
  stayingOn: "留学 covers study. Staying long after graduation on 留学 is not allowed; schools advise about 1 month to prepare departure, and ISA may cancel a status whose activity has stopped.",
  fees: "Change-of-status fee depends on the period granted (from 2026-10-01): counter ¥10,000 (≤3 months) to ¥75,000 (5 years+), ¥33,000 for 1 year; online ¥10,000–¥65,000 plus ¥330/¥550.",
} as const;

export type GraduateInput = {
  graduationDate: string;
  studentExpiry?: string | null;
  plan?: Plan;
  jobStartDate?: string | null;
  offerDate?: string | null;
  school?: School;
  foreignBachelor?: boolean;
  appliedDate?: string | null;
  expectedGrantMonths?: number | null;
  method?: Method;
  today?: string | null;
};

export type Deadline = { date: string; what: string; ja: string; passed: boolean };

export type GraduateResult = {
  plan: Plan;
  school: School;
  targetStatus: { en: string; ja: string };
  verdict: Verdict;
  summary: string;
  today: string;
  graduationDate: string;
  studentExpiry: string | null;
  windowOpens: string | null;
  recommendedBy: string | null;
  lastDay: string | null;
  partTimeEnds: string;
  notifySchoolLeftBy: string;
  jobHuntingUntil: string | null;
  hireBy: string | null;
  fee: null | { band: string; method: Method; feeJPY: number; processingFeeJPY: number; totalJPY: number; note: string };
  deadlines: Deadline[];
  actions: string[];
  warnings: string[];
  rulesAsOf: string;
  sources: readonly string[];
};

const ISO = /^\d{4}-\d{2}-\d{2}$/;
export function validDate(s: string): boolean {
  if (!ISO.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}
const toDate = (s: string) => new Date(`${s}T00:00:00Z`);
const fmt = (d: Date) => d.toISOString().slice(0, 10);
export function addDays(s: string, n: number): string {
  const d = toDate(s);
  d.setUTCDate(d.getUTCDate() + n);
  return fmt(d);
}
export function daysBetween(a: string, b: string): number {
  return Math.round((toDate(b).getTime() - toDate(a).getTime()) / 86_400_000);
}
export function todayJst(now: Date = new Date()): string {
  return fmt(new Date(now.getTime() + 9 * 3_600_000));
}
/** Same calendar day `months` later (negative = earlier), clamped to month end. */
export function addMonths(s: string, months: number): string {
  const d = toDate(s);
  const m = d.getUTCMonth() + months;
  const ty = d.getUTCFullYear() + Math.floor(m / 12);
  const tm = ((m % 12) + 12) % 12;
  const last = new Date(Date.UTC(ty, tm + 1, 0)).getUTCDate();
  return fmt(new Date(Date.UTC(ty, tm, Math.min(d.getUTCDate(), last))));
}
const minDate = (...xs: (string | null)[]) => xs.filter((x): x is string => !!x).sort()[0] ?? null;

function date(v: string | null | undefined, name: string, required = false): string | null {
  if (v === undefined || v === null || v === "") {
    if (required) throw new RuleInputError(`Missing ${name} (YYYY-MM-DD).`);
    return null;
  }
  if (!validDate(v)) throw new RuleInputError(`${name} must be a real date in YYYY-MM-DD form (got "${v}").`);
  return v;
}

export function feeFor(months: number, method: Method) {
  const b = FEE_BANDS.find((x) => months <= x.maxMonths) ?? FEE_BANDS[FEE_BANDS.length - 1];
  const f = method === "counter" ? b.counterJPY : b.onlineJPY;
  const p = method === "online" ? b.onlineProcessingJPY : 0;
  return { band: b.label, method, feeJPY: f, processingFeeJPY: p, totalJPY: f + p };
}

const TARGETS: Record<Plan, { en: string; ja: string }> = {
  job_offer: { en: "Work status (usually Engineer / Specialist in Humanities / International Services)", ja: "就労資格（主に技術・人文知識・国際業務）" },
  job_hunting: { en: "Designated Activities for continued job hunting", ja: "特定活動（継続就職活動）" },
  leaving: { en: "No change: leave Japan", ja: "出国" },
  further_study: { en: "Student (new school) or Designated Activities while waiting to enter graduate school", ja: "留学（進学先）／特定活動（進学待機）" },
};

export function checkGraduate(input: GraduateInput): GraduateResult {
  const grad = date(input.graduationDate, "graduationDate", true)!;
  const expiry = date(input.studentExpiry, "studentExpiry");
  const start = date(input.jobStartDate, "jobStartDate");
  const offer = date(input.offerDate, "offerDate");
  const applied = date(input.appliedDate, "appliedDate");
  const today = date(input.today, "today") ?? todayJst();
  const plan: Plan = input.plan ?? (start ? "job_offer" : "job_hunting");
  const school: School = input.school ?? "university";
  const method: Method = input.method ?? "counter";
  if (!PLANS.includes(plan)) throw new RuleInputError(`plan must be one of ${PLANS.join(", ")}`);
  if (!SCHOOLS.includes(school)) throw new RuleInputError(`school must be one of ${SCHOOLS.join(", ")}`);
  if (!METHODS.includes(method)) throw new RuleInputError(`method must be one of ${METHODS.join(", ")}`);
  const grant = input.expectedGrantMonths ?? (plan === "job_hunting" ? 6 : 12);
  if (!(grant > 0 && grant <= 120)) throw new RuleInputError("expectedGrantMonths must be between 1 and 120.");
  if (plan === "job_offer" && !start) throw new RuleInputError("jobStartDate is required when plan is job_offer.");
  if (start && start < grad && plan === "job_offer") throw new RuleInputError("jobStartDate is before graduationDate; full-time work on a work status starts after graduation.");

  const notifyBy = addDays(grad, 14);
  const actions: string[] = [];
  const warnings: string[] = [];
  const deadlines: Deadline[] = [];
  const dl = (d: string | null, what: string, ja: string) => {
    if (d) deadlines.push({ date: d, what, ja, passed: d < today });
  };

  let verdict: Verdict = "info";
  let summary = "";
  let windowOpens: string | null = null;
  let recommendedBy: string | null = null;
  let lastDay: string | null = null;
  let jobHuntingUntil: string | null = null;
  let hireBy: string | null = null;
  let fee: GraduateResult["fee"] = null;

  const japaneseInstitution = school === "university" || school === "vocational";

  if (plan === "job_offer") {
    const s = start!;
    const april = s.slice(5, 7) === "04";
    const y = Number(s.slice(0, 4));
    lastDay = minDate(expiry, addDays(s, -1));
    if (april) {
      windowOpens = `${y - 1}-12-01`;
      recommendedBy = `${y}-01-31`;
    } else {
      windowOpens = null;
      recommendedBy = addMonths(s, -2);
    }
    if (expiry && expiry < grad) {
      warnings.push(`Your 留学 period (${expiry}) ends before graduation (${grad}). Extend 留学 by ${expiry} first; ${expiry <= `${y}-01-31` && april ? "ISA asks you not to file the work-status change in the Dec–Jan window in this case." : "then file the work-status change."}`);
    }
    if (applied) {
      verdict = "applied";
      summary = `Applied on ${applied}. Collect the new card after graduation (${grad}) with your graduation certificate, and do not start work until the new status is granted.`;
      if (applied > (expiry ?? applied)) warnings.push(`You applied after your 留学 expiry (${expiry}). Contact ISA now.`);
      if (april && applied > `${y}-01-31`) warnings.push("You filed after ISA's Dec–Jan request for April starts, so the decision may come after your start date; agree a fallback start date with your employer.");
    } else if (expiry && today > expiry) {
      verdict = "expired";
      summary = `Your 留学 period ended on ${expiry} with no application on file. Contact your regional immigration bureau today.`;
    } else if (windowOpens && today < windowOpens) {
      verdict = "too_early";
      summary = `For an April ${y} start, file the change of status between ${windowOpens} and ${recommendedBy} (${daysBetween(today, windowOpens)} days until the window). Get your employer's documents ready now.`;
    } else if (lastDay && today > lastDay) {
      verdict = "urgent";
      summary = `Your start date ${s} is here and no application is on file. You cannot start the job until a work status is granted; file now and tell your employer.`;
    } else if (recommendedBy && today > recommendedBy) {
      verdict = "urgent";
      summary = april
        ? `ISA's Dec–Jan window for April starts closed on ${recommendedBy}. You can still file (last day ${lastDay}), but the decision may come after ${s}. File now.`
        : `File now: with 1–2 months' standard processing, a decision before ${s} is at risk. Last day to file: ${lastDay}.`;
    } else {
      verdict = "open";
      summary = april
        ? `Your window is open: file the change of status by ${recommendedBy} for an April ${y} start (${daysBetween(today, recommendedBy!)} days left).`
        : `You can file now with your expected-graduation certificate. Aim to file by ${recommendedBy} (2 months before ${s}); last day ${lastDay}.`;
    }
    const f = feeFor(grant, method);
    fee = { ...f, note: `Paid when the status is granted, by the period ISA grants (assumed ${grant} months)${method === "counter" ? ", in revenue stamps (収入印紙)" : ""}. First grants after graduation are often 1 year, but ISA decides.` };

    if (windowOpens) dl(windowOpens, "ISA's requested window for April starts opens", "4月入社の申請受付（依頼期間）開始");
    dl(recommendedBy, april ? "End of ISA's requested window (apply by this date)" : "Suggested latest filing date (2 months before start)", april ? "依頼期間の終了（1月末）" : "申請目安（入社2か月前）");
    dl(grad, "Graduation: part-time work on 留学 permission ends; collect the new card after this", "卒業（アルバイト終了・新カード受領は卒業後）");
    dl(lastDay, "Last day to file (before 留学 expiry and before the start date)", "申請の最終日");
    dl(s, "Job start (only once the new status is granted)", "入社日");

    const gap = daysBetween(grad, s);
    if (gap > 31) {
      if (!japaneseInstitution) {
        warnings.push(`There are ${gap} days between graduation and your start date. The 内定者 特定活動 for waiting is only for graduates of Japanese universities / vocational schools.`);
      } else {
        hireBy = minDate(addMonths(grad, 18), offer ? addMonths(offer, 12) : null);
        warnings.push(`There are ${gap} days between graduation and your start date. You cannot stay long on 留学 after graduating; ask about the 内定者 特定活動 (hiring must be within 1 year of the offer and within 1 year 6 months of graduation${hireBy ? `, i.e. by ${hireBy}` : ""}).`);
        if (hireBy && s > hireBy) warnings.push(`Your start date ${s} is after ${hireBy}, so the 内定者 特定活動 conditions are not met as entered.`);
        dl(hireBy, "Latest hiring date for the 内定者 特定活動", "内定者特定活動：採用期限");
      }
    }
    if (expiry && expiry < s && expiry >= grad && gap <= 31) warnings.push(`Your 留学 period (${expiry}) ends before your start date (${s}). File the change by ${expiry}; a timely application keeps you lawfully in Japan until the decision (up to 2 months after expiry).`);

    actions.push("Confirm with your employer which status the job fits (usually 技術・人文知識・国際業務) and get the company-side documents and category proof.");
    actions.push("File the change of status (在留資格変更許可申請) at your regional bureau or online, with your certificate of expected graduation (卒業見込み証明書).");
    if (school === "university") actions.push("Japanese university graduates changing to 技人国 or 研究 can use the document-omission rule (since 2025-12-01) unless the job is dispatch (派遣); attach the explanation form.");
    actions.push("After graduation, collect the new residence card with your graduation certificate (卒業証明書) or diploma. Do not start full-time work before that.");
    if (school === "university") actions.push("If you also hold JLPT N1 or BJT 480+, 特定活動46号 (Japanese university graduates) allows a wider range of jobs; see Japan JLPT Level Check.");
    if (school === "vocational") warnings.push("Vocational (専門士) graduates need a close link between their major and the job for 技人国; ISA judges this more strictly than for university graduates.");
    if (school === "language_school") warnings.push("A Japanese language school course alone does not meet the education requirement for 技人国; you normally need a degree (often a foreign bachelor's) or 10 years' experience.");
  } else if (plan === "job_hunting") {
    jobHuntingUntil = addDays(addMonths(grad, 12), 0);
    const eligible = japaneseInstitution || (school === "language_school" && !!input.foreignBachelor);
    windowOpens = grad;
    lastDay = expiry;
    if (!eligible) {
      verdict = "not_eligible";
      summary = school === "language_school"
        ? "Job hunting after a Japanese language school is only possible for foreign-bachelor holders at certified schools with a recommendation. As entered, plan to leave Japan or switch to a status you qualify for."
        : "The 継続就職活動 特定活動 is for graduates of Japanese universities and vocational schools (専門士). As entered, plan to leave Japan or switch to a status you qualify for.";
    } else if (applied) {
      verdict = "applied";
      summary = `Applied on ${applied}. If granted, you get 6 months, renewable once: job hunting up to about ${jobHuntingUntil}.`;
    } else if (expiry && today > expiry) {
      verdict = "expired";
      summary = `Your 留学 period ended on ${expiry} with no application on file. Contact your regional immigration bureau today.`;
    } else if (today < grad) {
      verdict = "too_early";
      summary = `After graduating on ${grad}, change to 特定活動 (job hunting) promptly${expiry ? `, by ${expiry} at the latest` : ""}. Ask your school for the recommendation letter now.`;
    } else {
      const since = daysBetween(grad, today);
      verdict = (expiry && daysBetween(today, expiry) <= 14) || since > 30 ? "urgent" : "open";
      summary = `File the change to 特定活動 (job hunting) now${expiry ? `; last day ${expiry}` : ""}. You graduated ${since} day${since === 1 ? "" : "s"} ago, and staying on 留学 after graduation is only for a short period.`;
    }
    const f = feeFor(grant, method);
    fee = { ...f, note: `The job-hunting 特定活動 is granted for 6 months, renewable once (each grant is paid separately)${method === "counter" ? "; counter fees are paid in revenue stamps" : ""}.` };
    dl(grad, "Graduation: part-time work on 留学 permission ends", "卒業（アルバイト終了）");
    dl(expiry, "Last day to file the change (留学 expiry)", "申請の最終日（留学の満了日）");
    if (eligible) dl(jobHuntingUntil, "About 1 year after graduation: end of job hunting (6 months + 1 renewal)", "継続就職活動の上限（卒業後約1年）");
    actions.push("Get a recommendation letter (推薦状) from your school; many schools set early request deadlines and require proof you job-hunted while enrolled.");
    actions.push("Apply to change to 特定活動 (継続就職活動) at your regional bureau, then apply for 資格外活動 permission if you want up to 28 hours a week of part-time work.");
    actions.push("When you get an offer, change to the work status, or to the 内定者 特定活動 if your start date is far away.");
    if (school === "university") actions.push("Top-university graduates may instead qualify for J-Find (未来創造人材, up to 2 years); see ISA's designated activities pages.");
  } else if (plan === "leaving") {
    lastDay = expiry;
    verdict = expiry && today > expiry ? "expired" : "info";
    summary = expiry && today > expiry
      ? `Your 留学 period ended on ${expiry}. If you are still in Japan, contact your regional immigration bureau today.`
      : `Plan to leave Japan soon after graduating on ${grad}${expiry ? ` and before ${expiry}` : ""}. Part-time work ends at graduation; return your residence card at the airport.`;
    dl(grad, "Graduation: part-time work on 留学 permission ends", "卒業（アルバイト終了）");
    dl(expiry, "留学 period ends: leave Japan by this date", "在留期間の満了日");
    actions.push("Book your departure: schools advise about 1 month after graduation to prepare. If your 留学 period ends too soon to prepare, ask the bureau about a short-term stay (not available if your remaining period already covers it).");
    actions.push("Before leaving: move-out notice (転出届) at the city office, close utilities, final resident-tax arrangements and the National Pension lump-sum refund option (see Japan Leaving Tax Check).");
    actions.push("At departure, hand your residence card to the immigration officer and do not tick the re-entry box unless you plan to come back within your period.");
  } else {
    lastDay = expiry;
    verdict = expiry && today > expiry ? "expired" : "info";
    summary = expiry && today > expiry
      ? `Your 留学 period ended on ${expiry}. Contact your regional immigration bureau today.`
      : `Going on to further study: if the new course starts soon after ${grad}, extend or update 留学 with the new school's papers; if it starts later, ask about the 特定活動 (進学待機) for the wait.`;
    dl(grad, "Graduation: part-time work on 留学 permission ends until you enrol again", "卒業（アルバイト終了）");
    dl(expiry, "留学 period ends: file any extension or change by this date", "在留期間の満了日");
    actions.push("Get the new school's admission letter early; if your 留学 period ends before the new course, extend 留学 (在留期間更新) with it.");
    actions.push("If there is a gap before entering graduate school, ask about the 特定活動 for waiting to enrol (generally only when enrolment is within 1 year and the new school pledges support).");
    actions.push("Report the school change to ISA within 14 days of leaving your school and again within 14 days of enrolling.");
  }

  dl(notifyBy, "Report leaving your school to ISA (所属機関に関する届出) within 14 days", "所属機関に関する届出（14日以内）");
  deadlines.sort((a, b) => a.date.localeCompare(b.date) || a.what.localeCompare(b.what));

  actions.push(`Report leaving your school (所属機関に関する届出) by ${notifyBy}, online through ISA's electronic notification system or at a bureau.`);
  warnings.push(`Part-time work on your 留学 資格外活動 permission ends on graduation day (${grad}), even if your card shows a later expiry.`);
  if (expiry && plan !== "leaving" && daysBetween(grad, expiry) > 92) warnings.push(`Your 留学 card shows ${expiry}, but that does not let you stay on 留学 after graduating without studying. ISA may cancel a status whose activity has stopped.`);

  return {
    plan,
    school,
    targetStatus: TARGETS[plan],
    verdict,
    summary,
    today,
    graduationDate: grad,
    studentExpiry: expiry,
    windowOpens,
    recommendedBy,
    lastDay,
    partTimeEnds: grad,
    notifySchoolLeftBy: notifyBy,
    jobHuntingUntil,
    hireBy,
    fee,
    deadlines,
    actions,
    warnings,
    rulesAsOf: RULES_AS_OF,
    sources: SOURCES,
  };
}
