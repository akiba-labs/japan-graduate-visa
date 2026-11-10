# Japan Graduate Visa Check

Free checker for international students graduating in Japan: when to change from Student (留学) to a work visa (ISA asks for 1 Dec–31 Jan for April starts), the job-hunting 特定活動 (6 months + 1 renewal), the 内定者 特定活動 for later start dates, part-time work ending at graduation and the 14-day school-leaving notice.

Live: https://japan-graduate-visa.vercel.app

- API: `GET /api/check?graduationDate=2027-03-20&jobStartDate=2027-04-01&plan=job_offer` (keyless, CORS), `/api/rules`, `/openapi.json`, `/llms.txt`
- MCP: `japan_graduate_visa_check` on https://free-agent-tools.vercel.app/mcp

Sources: ISA 留学→就労資格 notice (10_00240) + leaflet, 在留資格変更許可申請 (16-2), 継続就職活動 and 内定者 特定活動 pages, 特定活動46号 page, 資格外活動 page; university guidance on part-time after graduation. Rules as of 2026-11-10.

**Disclaimer:** educational, not legal advice, not affiliated with the Immigration Services Agency of Japan or any school. ISA decides; confirm with your school's international office or regional immigration bureau.

Dev: `npm ci && npm test && npm run build`
