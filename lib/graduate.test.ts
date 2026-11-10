import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addMonths, checkGraduate } from "./graduate";

const base = { graduationDate: "2027-03-20", jobStartDate: "2027-04-01", studentExpiry: "2027-07-15", plan: "job_offer" as const };

describe("job_offer April start", () => {
  it("too early before Dec 1", () => {
    const r = checkGraduate({ ...base, today: "2026-11-10" });
    assert.equal(r.verdict, "too_early");
    assert.equal(r.windowOpens, "2026-12-01");
    assert.equal(r.recommendedBy, "2027-01-31");
    assert.equal(r.lastDay, "2027-03-31");
    assert.equal(r.notifySchoolLeftBy, "2027-04-03");
    assert.equal(r.partTimeEnds, "2027-03-20");
    assert.equal(r.fee?.totalJPY, 33000);
  });
  it("open in the window", () => {
    const r = checkGraduate({ ...base, today: "2027-01-10" });
    assert.equal(r.verdict, "open");
    assert.match(r.summary, /21 days left/);
  });
  it("urgent after Jan 31", () => {
    assert.equal(checkGraduate({ ...base, today: "2027-02-15" }).verdict, "urgent");
  });
  it("applied", () => {
    const r = checkGraduate({ ...base, appliedDate: "2026-12-10", today: "2027-01-10" });
    assert.equal(r.verdict, "applied");
  });
  it("expired after 留学 expiry without application", () => {
    const r = checkGraduate({ ...base, studentExpiry: "2027-03-31", today: "2027-04-05" });
    assert.equal(r.verdict, "expired");
  });
  it("留学 ending before graduation → extend first", () => {
    const r = checkGraduate({ ...base, studentExpiry: "2027-01-20", today: "2026-11-10" });
    assert.ok(r.warnings.some((w) => /Extend 留学/.test(w)));
  });
});

describe("job_offer other months", () => {
  it("October start: suggest 2 months before", () => {
    const r = checkGraduate({ graduationDate: "2027-09-20", jobStartDate: "2027-10-01", studentExpiry: "2027-10-30", school: "vocational", plan: "job_offer", today: "2026-11-10" });
    assert.equal(r.verdict, "open");
    assert.equal(r.windowOpens, null);
    assert.equal(r.recommendedBy, "2027-08-01");
    assert.ok(r.warnings.some((w) => /専門士/.test(w)));
  });
  it("long gap → 内定者 特定活動 with hire-by date", () => {
    const r = checkGraduate({ graduationDate: "2026-09-20", jobStartDate: "2027-04-01", offerDate: "2026-02-01", studentExpiry: "2026-10-31", plan: "job_offer", today: "2026-09-01" });
    assert.equal(r.hireBy, "2027-02-01");
    assert.ok(r.warnings.some((w) => /not met/.test(w)));
  });
});

describe("job_hunting", () => {
  it("open after graduation, ~1 year", () => {
    const r = checkGraduate({ graduationDate: "2027-03-20", studentExpiry: "2027-07-15", plan: "job_hunting", today: "2027-03-25" });
    assert.equal(r.verdict, "open");
    assert.equal(r.jobHuntingUntil, "2028-03-20");
    assert.equal(r.fee?.totalJPY, 18000);
  });
  it("urgent a month after graduation", () => {
    assert.equal(checkGraduate({ graduationDate: "2027-03-20", studentExpiry: "2027-07-15", plan: "job_hunting", today: "2027-05-01" }).verdict, "urgent");
  });
  it("language school without foreign degree not eligible", () => {
    assert.equal(checkGraduate({ graduationDate: "2027-03-20", plan: "job_hunting", school: "language_school", today: "2027-03-01" }).verdict, "not_eligible");
    assert.notEqual(checkGraduate({ graduationDate: "2027-03-20", plan: "job_hunting", school: "language_school", foreignBachelor: true, today: "2027-03-01" }).verdict, "not_eligible");
  });
});

describe("other plans and helpers", () => {
  it("leaving", () => {
    const r = checkGraduate({ graduationDate: "2027-03-20", studentExpiry: "2027-05-01", plan: "leaving", today: "2027-03-01" });
    assert.equal(r.verdict, "info");
    assert.equal(r.lastDay, "2027-05-01");
  });
  it("further study", () => {
    assert.equal(checkGraduate({ graduationDate: "2027-03-20", plan: "further_study", today: "2027-03-01" }).verdict, "info");
  });
  it("addMonths clamps", () => {
    assert.equal(addMonths("2027-03-31", -1), "2027-02-28");
    assert.equal(addMonths("2026-09-20", 18), "2028-03-20");
  });
  it("rejects start before graduation", () => {
    assert.throws(() => checkGraduate({ graduationDate: "2027-03-20", jobStartDate: "2027-03-01", plan: "job_offer" }));
  });
});
