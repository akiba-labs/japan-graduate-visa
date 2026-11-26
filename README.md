# Japan Graduate Visa Check

Free checker for international students graduating in Japan: when to change from Student (留学) to a work visa (ISA asks for 1 Dec–31 Jan for April starts), the job-hunting 特定活動 (6 months + 1 renewal), the 内定者 特定活動 for later start dates, part-time work ending at graduation and the 14-day school-leaving notice.

- Full app and API (Vercel): https://japan-graduate-visa.vercel.app
- Checker (GitHub Pages): https://akiba-labs.github.io/japan-graduate-visa/

- API: `GET /api/check?graduationDate=2027-03-20&jobStartDate=2027-04-01&plan=job_offer` (keyless, CORS), `/api/rules`, `/openapi.json`, `/llms.txt`
- MCP: `japan_graduate_visa_check` on https://free-agent-tools.vercel.app/mcp

Sources: ISA 留学→就労資格 notice (10_00240) + leaflet, 在留資格変更許可申請 (16-2), 継続就職活動 and 内定者 特定活動 pages, 特定活動46号 page, 資格外活動 page; university guidance on part-time after graduation. Rules as of 2026-11-10.

**Disclaimer:** educational, not legal advice, not affiliated with the Immigration Services Agency of Japan or any school. ISA decides; confirm with your school's international office or regional immigration bureau.

Dev:

```
npm ci
npm test
npm run build
npm run build:pages
```

`npm run build` is the Vercel app (checker, JSON API, share pages). `npm run build:pages` writes a static `out/` for GitHub Pages and checks that internal links and assets resolve under `/japan-graduate-visa`. Server routes stay in the repo; the Pages script only moves them aside for that build.

GitHub settings: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Pushes to `main` deploy with `.github/workflows/pages.yml`. The copy-paste steps for the other tool repos are at the top of `scripts/build-pages.mjs`.
