import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { InputError } from "./agent-api";
import { EXAMPLE_GET, computeCheck } from "./api";

describe("computeCheck", () => {
  it("example get works", () => {
    const q = Object.fromEntries(new URL(`https://x.example${EXAMPLE_GET}`).searchParams);
    const r = computeCheck({ ...q, today: "2026-11-10" });
    assert.equal(r.verdict, "too_early");
    assert.equal(r.windowOpens, "2026-12-01");
    assert.equal(r.recommendedBy, "2027-01-31");
    assert.ok(r.sources.length >= 5);
  });
  it("accepts aliases", () => {
    const r = computeCheck({ 卒業日: "2027-03-15", plan: "就職活動", school: "専門学校", today: "2027-03-20" });
    assert.equal(r.plan, "job_hunting");
    assert.equal(r.school, "vocational");
    const o = computeCheck({ graduation: "2027-03-15", startDate: "2027-04-01", method: "オンライン", grantMonths: "1年", today: "2026-12-05" });
    assert.equal(o.plan, "job_offer");
    assert.equal(o.fee?.totalJPY, 27330);
  });
  it("missing date → InputError", () => {
    assert.throws(() => computeCheck({}), InputError);
  });
  it("bad plan → InputError", () => {
    assert.throws(() => computeCheck({ graduationDate: "2027-03-20", plan: "tourism" }), InputError);
  });
  it("bad date → InputError", () => {
    assert.throws(() => computeCheck({ graduationDate: "2027-02-30" }), InputError);
  });
  it("job_offer without start → InputError", () => {
    assert.throws(() => computeCheck({ graduationDate: "2027-03-20", plan: "job_offer" }), InputError);
  });
});
