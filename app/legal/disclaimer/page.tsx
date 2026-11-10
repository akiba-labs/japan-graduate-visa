import type { Metadata } from "next";
import { RULES_AS_OF, SOURCES } from "@/lib/graduate";
import { DISCLAIMER_SHORT, HONESTY } from "@/lib/site";

export const metadata: Metadata = { title: "Disclaimer", description: DISCLAIMER_SHORT };

export default function DisclaimerPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Read this</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">Disclaimer</h1>
      <p className="mt-4 text-lg text-foreground">{DISCLAIMER_SHORT}</p>
      <p className="mt-2 text-muted">{HONESTY}</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-base font-semibold text-foreground">What this is</h2>
          <p className="mt-2">
            A free educational date checklist. It applies a dated reading (as of {RULES_AS_OF}) of the Immigration Services Agency&apos;s guidance on changing from Student (留学) to a work status, the April-start filing request (1 December to 31 January), the job-hunting and job-offer 特定活動, the 2026-10-01 fee table and schools&apos; guidance on part-time work after graduation to the dates you enter.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">What it is not</h2>
          <p className="mt-2">
            It is not immigration or legal advice and is not affiliated with the Immigration Services Agency of Japan, the Ministry of Justice or any school. It does not decide whether ISA will grant a status, whether your job fits a work status, which period ISA will grant or whether your school will recommend you. Regional bureaus may announce their own timing. ISA decides; confirm with your school&apos;s international office, your regional immigration bureau, ISA&apos;s information centre (0570-013904) or a licensed gyoseishoshi / lawyer.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">How dates are counted</h2>
          <p className="mt-2">
            &quot;Within 14 days&quot; counts from the day after graduation. &quot;2 months before start&quot; is our suggested margin based on ISA&apos;s 1–2 month standard processing, not an ISA rule. &quot;About 1 year&quot; of job hunting is 6 months plus one 6-month renewal from the grant date, shown from graduation. Treat every date as the latest safe day, not a target, and apply with a margin.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Sources</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {SOURCES.map((s) => (
              <li key={s}>
                <a href={s} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
