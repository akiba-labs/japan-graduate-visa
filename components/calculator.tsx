"use client";

import { useState, useSyncExternalStore } from "react";
import { CardDisclaimer } from "@/components/card-disclaimer";
import { ShareBar } from "@/components/share-bar";
import type { Method, Plan, School } from "@/lib/graduate";
import { EXAMPLE_SHARED, PUBLIC_URL, resultPath, safeCheck, type Shared } from "@/lib/share";
import { VERDICT_LABEL, VERDICT_STYLE } from "@/lib/verdict";

const field = "mt-2 w-full rounded-xl border border-line bg-black/40 px-3 py-2 text-sm text-foreground focus:border-amber";
const noopSubscribe = () => () => {};
const yen = (n: number) => `¥${n.toLocaleString("en-US")}`;

function DateField({ label, value, set, testid }: { label: string; value: string; set: (v: string) => void; testid?: string }) {
  return (
    <label className="mt-4 block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input data-testid={testid} type="date" className={field} value={value} onChange={(e) => set(e.target.value)} />
    </label>
  );
}

export function Calculator({ initial }: { initial?: Shared }) {
  const start = initial ?? EXAMPLE_SHARED;
  const [plan, setPlan] = useState<Plan>(start.plan);
  const [school, setSchool] = useState<School>(start.school);
  const [grad, setGrad] = useState(start.graduationDate);
  const [expiry, setExpiry] = useState(start.studentExpiry ?? "");
  const [jobStart, setJobStart] = useState(start.jobStartDate ?? "");
  const [offer, setOffer] = useState(start.offerDate ?? "");
  const [foreignBachelor, setFB] = useState(start.foreignBachelor);
  const [applied, setApplied] = useState(start.appliedDate ?? "");
  const [method, setMethod] = useState<Method>(start.method);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [todayEdit, setToday] = useState<string | null>(null);
  const today = todayEdit ?? (initial || !hydrated ? (start.today ?? "") : "");

  const offerPlan = plan === "job_offer";
  const shared: Shared = {
    plan,
    school,
    graduationDate: grad,
    studentExpiry: expiry || null,
    jobStartDate: offerPlan ? jobStart || null : null,
    offerDate: offerPlan ? offer || null : null,
    foreignBachelor: school === "language_school" ? foreignBachelor : false,
    appliedDate: applied || null,
    expectedGrantMonths: plan === "job_hunting" ? 6 : 12,
    method,
    today: today || null,
  };
  const r = grad ? safeCheck(shared) : null;
  const shareUrl = `${PUBLIC_URL}${resultPath(shared)}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.3fr]">
      <div className="rounded-3xl border border-line bg-panel/60 p-5 sm:p-6">
        <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">Your graduation</p>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-foreground">After graduating I will…</span>
          <select data-testid="plan" className={field} value={plan} onChange={(e) => setPlan(e.target.value as Plan)}>
            <option value="job_offer">Start a job in Japan (I have an offer, 内定)</option>
            <option value="job_hunting">Keep job hunting in Japan (継続就職活動)</option>
            <option value="further_study">Go on to further study (進学)</option>
            <option value="leaving">Leave Japan (帰国)</option>
          </select>
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-foreground">School</span>
          <select data-testid="school" className={field} value={school} onChange={(e) => setSchool(e.target.value as School)}>
            <option value="university">Japanese university, graduate school or junior college</option>
            <option value="vocational">Japanese vocational school (専門学校, 専門士)</option>
            <option value="language_school">Japanese language school (日本語学校)</option>
            <option value="other">Other</option>
          </select>
        </label>
        {school === "language_school" ? (
          <label className="mt-3 flex items-start gap-2 text-sm text-foreground">
            <input type="checkbox" className="mt-1" checked={foreignBachelor} onChange={(e) => setFB(e.target.checked)} />
            <span>I hold a bachelor&apos;s degree from a university abroad</span>
          </label>
        ) : null}
        <DateField label="Graduation day (卒業日, expected)" value={grad} set={setGrad} testid="grad" />
        <DateField label="留学 period of stay expires (on your residence card)" value={expiry} set={setExpiry} testid="expiry" />
        {offerPlan ? (
          <>
            <DateField label="Job start date (入社日)" value={jobStart} set={setJobStart} testid="start" />
            <DateField label="Offer date (内定日, optional)" value={offer} set={setOffer} />
            <label className="mt-4 block">
              <span className="text-sm font-medium text-foreground">How you will apply</span>
              <select className={field} value={method} onChange={(e) => setMethod(e.target.value as Method)}>
                <option value="counter">At the immigration bureau (窓口)</option>
                <option value="online">Online (オンライン申請)</option>
              </select>
            </label>
          </>
        ) : null}
        {plan === "job_offer" || plan === "job_hunting" ? <DateField label="Already applied on (optional)" value={applied} set={setApplied} testid="applied" /> : null}
        <label className="mt-4 block">
          <span className="text-sm font-medium text-muted">Check as of (optional, default today)</span>
          <input type="date" className={field} value={today} onChange={(e) => setToday(e.target.value)} />
        </label>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-line bg-panel/60">
        <div className="p-5 sm:p-7" data-testid="result">
          {r ? (
            <>
              <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
                {VERDICT_LABEL[r.verdict]} · {r.targetStatus.ja}
              </p>
              <p className={`mt-2 font-display text-3xl leading-tight tracking-tight sm:text-4xl ${VERDICT_STYLE[r.verdict]}`}>{r.summary}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-line bg-black/30 p-3">
                  <p className="font-mono text-lg text-foreground">{r.recommendedBy ?? r.lastDay ?? "—"}</p>
                  <p className="text-xs text-muted">{r.recommendedBy ? "apply by (recommended)" : "last day on 留学"}</p>
                </div>
                <div className="rounded-2xl border border-line bg-black/30 p-3">
                  <p className="font-mono text-lg text-foreground">{r.partTimeEnds}</p>
                  <p className="text-xs text-muted">part-time work stops</p>
                </div>
                <div className="rounded-2xl border border-line bg-black/30 p-3">
                  <p className="font-mono text-lg text-foreground">{r.notifySchoolLeftBy}</p>
                  <p className="text-xs text-muted">report leaving school by</p>
                </div>
              </div>
              {r.fee ? (
                <p className="mt-4 text-sm text-muted">
                  Fee: <span className="font-mono text-foreground">{yen(r.fee.totalJPY)}</span> ({r.fee.band}). {r.fee.note}
                </p>
              ) : null}
              {r.jobHuntingUntil ? (
                <p className="mt-2 text-sm text-muted">
                  Job hunting can last until about <span className="font-mono text-foreground">{r.jobHuntingUntil}</span> (6 months + 1 renewal).
                </p>
              ) : null}

              <h3 className="mt-6 text-sm font-semibold text-foreground">Dates</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-muted">
                {r.deadlines.map((d) => (
                  <li key={d.date + d.what} className={d.passed ? "line-through opacity-60" : ""}>
                    <span className="mr-2 font-mono text-foreground">{d.date}</span>
                    {d.what} <span className="text-xs">· {d.ja}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-6 text-sm font-semibold text-foreground">To do</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
                {r.actions.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              {r.warnings.length ? (
                <>
                  <h3 className="mt-6 text-sm font-semibold text-foreground">Watch out</h3>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
                    {r.warnings.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              <div className="mt-6">
                <ShareBar url={shareUrl} text={`Graduating in Japan: ${r.summary}`} />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted">Enter your graduation day{offerPlan ? " and job start date" : ""}. Dates must be real.</p>
          )}
        </div>
        <CardDisclaimer />
      </div>
    </div>
  );
}
