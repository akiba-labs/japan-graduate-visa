import { preflight, staticJson } from "@/lib/agent-api";
import { PUBLIC_URL } from "@/lib/api";
import { DISCLAIMER, FEE_BANDS, RULES, RULES_AS_OF, SOURCES } from "@/lib/graduate";

export function GET() {
  return staticJson({
    ...RULES,
    feeBands: FEE_BANDS.map((b) => ({ ...b, maxMonths: Number.isFinite(b.maxMonths) ? b.maxMonths : null })),
    rulesAsOf: RULES_AS_OF,
    sources: SOURCES,
    disclaimer: DISCLAIMER,
    docs: `${PUBLIC_URL}/openapi.json`,
    checker: `${PUBLIC_URL}/api/check`,
  });
}
export const OPTIONS = preflight;
