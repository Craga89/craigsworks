// The home page's words: the demo runs, the results, the enterprise checklist, the track record
// and the questions people ask. Every figure is from real work (see the case notes, data/notes.ts).

/** Track record lines, shown as a terminal. */
export const RECORD = [
  'Continuous deployment, no release train since 2022',
  'AI-assisted to AI-first development in a year',
  '18 repos → one TypeScript monorepo, 100+ packages',
  'ISO 27001 + GDPR audits, yearly pen test',
  'On-call rota, status page, disaster recovery plan',
  '36 interface languages kept in step on every build',
];

/** Sites that used my jQuery plugins (qTip, qTip2, Simpletip). */
export const USED_BY = [
  'Mozilla',
  'Salesforce',
  'Lloyds TSB',
  'ASOS',
  'Syngenta',
  'Urban Dictionary',
  'Northumbria University',
  'Skrill',
];

export const FAQ = [
  {
    q: 'Who do you usually work with?',
    a: "Startups and small-to-medium companies with a product already in customers' hands, that want to ship faster or get more from AI without letting quality slip. Usually there's an engineering team in place and I work alongside it.",
  },
  {
    q: 'Do you write code, or just advise?',
    a: "Both. I'm still hands-on day to day, so I'll happily change the pipeline or pair on the first pull requests myself. The aim is that your team can carry it on afterwards.",
  },
  {
    q: 'How much does it cost?',
    a: "The health check is a fixed price agreed before we start, based on the size of what we're looking at. Anything hands-on is scoped and priced the same way, piece by piece.",
  },
  {
    q: "We're not sure we're ready for AI. Is that a problem?",
    a: 'Not at all. Plenty of teams get more from faster releases first. When you do want to bring AI in, the same groundwork (clear standards, good tests, quick feedback) is what makes it work.',
  },
  {
    q: 'How much of your time can we have?',
    a: "I take on a small number of projects at a time so each one gets proper attention. We'll agree what that looks like up front.",
  },
  {
    q: 'Do you work remotely?',
    a: 'Yes, remote by default, from Newcastle upon Tyne in the UK.',
  },
];

/** A line in a terminal: a mark, the item and a note. Tones: ok (done), warn (a finding), acc (the result), dim. */
export interface TermLine {
  tone: 'ok' | 'warn' | 'acc' | 'dim';
  item: string;
  note?: string;
}

/** The hero's health check run: illustrative, matching the sample plan on the health check page. */
export const HERO_RUN: TermLine[] = [
  { tone: 'dim', item: 'reading the pipeline, code, cloud, security, ai and team' },
  { tone: 'warn', item: 'pipeline and releases', note: '2 high-impact changes' },
  { tone: 'ok', item: 'code and tooling', note: 'in good shape' },
  { tone: 'warn', item: 'architecture and cost', note: 'services idling under 5% CPU' },
  { tone: 'warn', item: 'security', note: 'secrets in .env files' },
  { tone: 'warn', item: 'ai readiness', note: 'no shared guidelines yet' },
  { tone: 'ok', item: 'team and process', note: 'in good shape' },
  { tone: 'acc', item: 'plan.md', note: '5 changes, ranked by impact' },
];

/** Results from the case notes, as before-and-after bars (each value a percentage of the longer bar). */
export const RESULTS = [
  { title: 'Typechecks', detail: '9,700+ files, on TypeScript 7', pill: '~10× faster', after: 10, before: 100 },
  { title: 'Report ceiling', detail: 'the flagship report, at scale', pill: '10× higher', after: 100, before: 10 },
  {
    title: 'Repositories',
    detail: 'merged, history intact',
    pill: '18 → 1',
    after: 6,
    before: 100,
    labels: ['1 monorepo', '18 repos'],
  },
] as const;

/** The enterprise checklist at Hive HR, as run in the terminal and the cards beside it. */
export const ENTERPRISE_RUN: TermLine[] = [
  { tone: 'ok', item: 'saml single sign-on', note: 'per organisation' },
  { tone: 'ok', item: 'two-factor', note: 'enforced per organisation' },
  { tone: 'ok', item: 'penetration test', note: 'every year' },
  { tone: 'ok', item: 'iso 27001 + gdpr', note: 'audited every year' },
  { tone: 'ok', item: 'public surface', note: 'the cdn, nothing else' },
  { tone: 'ok', item: 'ssh', note: 'port 22 closed everywhere' },
];

export const ENTERPRISE = [
  {
    icon: 'key',
    title: 'Single sign-on with SAML',
    pill: 'per organisation',
    body: 'Enterprise customers sign in their own way, and two-factor can be required per organisation.',
    note: 'auth',
  },
  {
    icon: 'search',
    title: 'A penetration test',
    pill: 'every year',
    body: 'Arranged every year with outside testers, and the findings fixed and tracked to closure.',
    note: 'sec',
  },
  {
    icon: 'shield',
    title: 'ISO 27001 and GDPR',
    pill: 'audited yearly',
    body: 'Technical liaison for both, alongside the InfoSec manager, through every annual audit.',
  },
  {
    icon: 'lock',
    title: 'Nothing public but the CDN',
    pill: 'port 22 closed',
    body: 'CloudFront and WAF the only way in, no servers to patch, and admin access through SSO only.',
    note: 'aws',
  },
] as const;

/**
 * The monorepo graph: illustrative changes, each the package it touched and the packages that
 * depend on it (indexes into a 12 × 9 grid). Only these get built.
 */
export const GRAPH = {
  packages: 108,
  changes: [
    { name: 'packages/reports', hit: 17, deps: [18, 29, 30, 41, 53] },
    { name: 'packages/translations', hit: 62, deps: [50, 61, 63, 74, 86, 87, 98] },
    { name: 'packages/auth', hit: 33, deps: [21, 34, 45] },
    { name: 'packages/surveys', hit: 90, deps: [78, 79, 91, 102] },
  ],
};
