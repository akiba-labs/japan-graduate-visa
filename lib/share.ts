import { METHODS, PLANS, SCHOOLS, checkGraduate, type GraduateInput, type Method, type Plan, type School } from "./graduate";

export { PUBLIC_URL } from "./api";

type Params = URLSearchParams | Record<string, string | string[] | undefined>;
function one(p: Params, k: string): string | null {
  const v = p instanceof URLSearchParams ? p.get(k) : p[k];
  const f = Array.isArray(v) ? v[0] : v;
  return f === undefined || f === null || f === "" ? null : String(f);
}
const ISO = /^\d{4}-\d{2}-\d{2}$/;
function date(p: Params, k: string): string | null {
  const v = one(p, k);
  return v && ISO.test(v) ? v : null;
}
function oneOf<T extends string>(p: Params, k: string, allowed: readonly T[], fallback: T): T {
  const v = one(p, k);
  return v && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
}
function num(p: Params, k: string): number | null {
  const v = one(p, k);
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export type Shared = {
  plan: Plan;
  school: School;
  graduationDate: string;
  studentExpiry: string | null;
  jobStartDate: string | null;
  offerDate: string | null;
  foreignBachelor: boolean;
  appliedDate: string | null;
  expectedGrantMonths: number | null;
  method: Method;
  today: string | null;
};

export const EXAMPLE_SHARED: Shared = {
  plan: "job_offer",
  school: "university",
  graduationDate: "2027-03-20",
  studentExpiry: "2027-07-15",
  jobStartDate: "2027-04-01",
  offerDate: null,
  foreignBachelor: false,
  appliedDate: null,
  expectedGrantMonths: 12,
  method: "counter",
  today: "2026-11-10",
};
export const EXAMPLE_HUNTING: Shared = { ...EXAMPLE_SHARED, plan: "job_hunting", jobStartDate: null, expectedGrantMonths: 6, today: "2027-03-25" };
export const EXAMPLE_SEPTEMBER: Shared = { ...EXAMPLE_SHARED, school: "vocational", graduationDate: "2027-09-20", studentExpiry: "2027-10-30", jobStartDate: "2027-10-01" };
export const EXAMPLES = [EXAMPLE_SHARED, EXAMPLE_HUNTING, EXAMPLE_SEPTEMBER];

export function parseShared(p: Params): Shared | null {
  const g = date(p, "g");
  if (!g) return null;
  return {
    plan: oneOf(p, "p", PLANS, "job_offer"),
    school: oneOf(p, "s", SCHOOLS, "university"),
    graduationDate: g,
    studentExpiry: date(p, "e"),
    jobStartDate: date(p, "j"),
    offerDate: date(p, "o"),
    foreignBachelor: one(p, "fb") === "1",
    appliedDate: date(p, "a"),
    expectedGrantMonths: num(p, "gm"),
    method: oneOf(p, "m", METHODS, "counter"),
    today: date(p, "t"),
  };
}

export function sharedQuery(s: Shared): string {
  const q = new URLSearchParams();
  q.set("g", s.graduationDate);
  if (s.plan !== "job_offer") q.set("p", s.plan);
  if (s.school !== "university") q.set("s", s.school);
  if (s.studentExpiry) q.set("e", s.studentExpiry);
  if (s.jobStartDate) q.set("j", s.jobStartDate);
  if (s.offerDate) q.set("o", s.offerDate);
  if (s.foreignBachelor) q.set("fb", "1");
  if (s.appliedDate) q.set("a", s.appliedDate);
  if (s.expectedGrantMonths != null) q.set("gm", String(s.expectedGrantMonths));
  if (s.method !== "counter") q.set("m", s.method);
  if (s.today) q.set("t", s.today);
  return q.toString();
}

export function toCheckInput(s: Shared): GraduateInput {
  return { ...s };
}
export function safeCheck(s: Shared) {
  try {
    return checkGraduate(toCheckInput(s));
  } catch {
    return null;
  }
}
export function resultPath(s: Shared): string {
  return `/r?${sharedQuery(s)}`;
}
export function ogPath(s: Shared): string {
  return `/og?${sharedQuery(s)}`;
}
export function isIndexable(s: Shared): boolean {
  return EXAMPLES.some((e) => resultPath(e) === resultPath(s));
}
