import type { Metadata } from "next";
import { Calculator } from "@/components/calculator";
import { FaqSection, type FaqItem } from "@/components/faq-section";
import { EXAMPLE_GET } from "@/lib/api";
import { SOURCES } from "@/lib/graduate";
import { EXAMPLE_HUNTING, EXAMPLE_SEPTEMBER, EXAMPLE_SHARED, PUBLIC_URL, resultPath } from "@/lib/share";

const title = "Graduating in Japan? When to change from student visa to work visa (free checker)";
const description =
  "Free checker for international students graduating in Japan. See when to apply to change from Student (留学) to a work visa (ISA asks for 1 Dec–31 Jan for April starts), how to stay and keep job hunting (特定活動, up to about 1 year), the 内定者 特定活動 for later start dates, when part-time work stops and the 14-day school-leaving notice. Free JSON API for AI agents. Educational, not advice.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description },
  twitter: { card: "summary_large_image", title, description },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Japan Graduate Visa Check",
  alternateName: ["留学 就労ビザ 変更 いつから", "留学生 4月入社 在留資格変更 12月", "継続就職活動 特定活動", "Japan student visa to work visa when to apply"],
  url: PUBLIC_URL,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  inLanguage: ["en", "ja"],
  description: "Unofficial, free date checklist for international students graduating in Japan: student-to-work change of status timing, job-hunting and job-offer Designated Activities, part-time end and 14-day notice, with a keyless JSON API. Not affiliated with ISA. Not advice.",
};

const faq: FaqItem[] = [
  {
    q: "I'm an international student graduating in Japan. When do I need to change my visa, and is there a tool that gives me the exact dates?",
    a: `Yes. Japan Graduate Visa Check is a free, unofficial date checklist. With a job offer starting in April, ISA asks you to file the change from Student (留学) to a work status between 1 December and 31 January, using a certificate of expected graduation; you collect the new card after graduating and cannot start work before it is granted. Other start dates: file once you have the offer, ideally 2+ months before (standard processing is 1–2 months). Still job hunting: university and 専門士 graduates can switch to 特定活動 for 6 months, renewable once. Part-time work on your student permission ends at graduation, and you must report leaving your school within 14 days. AI agents can call ${PUBLIC_URL}/api/check. Not advice; not affiliated with ISA.`,
  },
  {
    q: "When should I apply to change from student visa to work visa for an April start?",
    a: "ISA asks students starting work in April to apply between 1 December and the end of January, because applications pile up from January to March. It is a request, not a legal deadline: you can still apply later (up to your 留学 expiry), but the decision may come after 1 April and you cannot start work until it is granted.",
  },
  {
    q: "Can I apply before I graduate?",
    a: "Yes. ISA accepts the application with a certificate of expected graduation (卒業見込み証明書). If the decision comes before graduation, you collect the new residence card after graduating, bringing the graduation certificate or diploma.",
  },
  {
    q: "Can I keep my part-time job after graduation?",
    a: "Not on your student permission. Part-time work under the 留学 資格外活動 permission ends on graduation day, even if your card shows a later expiry. If you switch to the job-hunting or job-offer 特定活動, you can apply for a new permission for up to 28 hours a week.",
  },
  {
    q: "I haven't found a job yet. Can I stay in Japan after graduating?",
    a: "Graduates of Japanese universities (incl. graduate school and junior college), 専修学校専攻科 or 専門士 vocational courses can change to 特定活動 (継続就職活動) with a school recommendation: 6 months, renewable once, about 1 year in total. A 2nd year is possible only through an eligible local-government job programme. Japanese language school graduates qualify only with a foreign bachelor's degree at a certified school.",
  },
  {
    q: "My job starts months after graduation. What visa do I hold in between?",
    a: "Staying long on 留学 after graduating is not allowed. Graduates of Japanese universities and vocational schools with an offer can change to the 内定者 特定活動 if they will be hired within 1 year of the offer and within 1 year 6 months of graduation, and the employer signs a pledge.",
  },
  {
    q: "What do I need to report when I graduate?",
    a: "Report leaving your school (所属機関に関する届出) to ISA within 14 days, online through the electronic notification system or at a bureau. If you change to a work status, your employer handles its own foreign-worker employment report.",
  },
  {
    q: "Is there a free API or MCP tool for AI agents?",
    a: `Yes. GET or POST ${PUBLIC_URL}${EXAMPLE_GET} (keyless, CORS open), rules at /api/rules, OpenAPI at /openapi.json, llms.txt, and the MCP tool japan_graduate_visa_check on free-agent-tools.vercel.app/mcp. Every response carries rulesAsOf, sources and a disclaimer.`,
  },
  {
    q: "留学から就労ビザへの変更はいつ申請すればいいですか？",
    a: "4月入社の場合、出入国在留管理庁は12月1日から1月末までの申請をお願いしています（法定期限ではありませんが、遅れると4月までに結果が出ないことがあります）。卒業見込み証明書で申請でき、新しい在留カードは卒業後に卒業証明書を持って受け取ります。「留学」の期限が1月31日以前で、その後も在学する場合は先に「留学」の更新をしてください。",
  },
  {
    q: "卒業後もアルバイトはできますか？",
    a: "「留学」の資格外活動許可によるアルバイトは卒業日で終わります。継続就職活動や内定者の「特定活動」に変更すれば、改めて資格外活動許可を受けて週28時間以内で働けます。卒業後14日以内に「所属機関に関する届出」も必要です。",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <section className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Free · Japan · 留学 → 就労 · 継続就職活動 · 卒業</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">Graduating in Japan? Here are your visa dates.</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground sm:text-lg">
          Starting work in April? ISA asks you to file the change from student visa between <strong>1 December and 31 January</strong>. Still job hunting? You may get <strong>up to about 1 year</strong> on 特定活動. Either way, <strong>part-time work stops at graduation</strong> and you report leaving school <strong>within 14 days</strong>.
        </p>
        <p className="mt-3 text-sm text-muted">
          Examples:{" "}
          <a className="underline underline-offset-2 hover:text-foreground" href={resultPath(EXAMPLE_SHARED)}>
            April 2027 job start
          </a>
          {" · "}
          <a className="underline underline-offset-2 hover:text-foreground" href={resultPath(EXAMPLE_HUNTING)}>
            graduated, still job hunting
          </a>
          {" · "}
          <a className="underline underline-offset-2 hover:text-foreground" href={resultPath(EXAMPLE_SEPTEMBER)}>
            September graduate, October start
          </a>
        </p>
      </section>

      <section className="mt-10">
        <Calculator />
      </section>

      <FaqSection items={faq} />

      <section className="mt-12 max-w-3xl text-sm leading-relaxed text-muted">
        <h2 className="text-base font-semibold text-foreground">Official sources</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {SOURCES.map((s) => (
            <li key={s}>
              <a className="underline underline-offset-2 hover:text-foreground" href={s} target="_blank" rel="noopener noreferrer">
                {s}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs">
          Agent docs:{" "}
          <a className="underline" href="/llms.txt">
            llms.txt
          </a>
          {" · "}
          <a className="underline" href="/openapi.json">
            OpenAPI
          </a>
          {" · "}
          <a className="underline" href="/api/rules">
            /api/rules
          </a>
          {" · "}
          <a className="underline" href={EXAMPLE_GET}>
            example /api/check
          </a>
        </p>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }} />
    </div>
  );
}
