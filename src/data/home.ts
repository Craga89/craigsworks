// The home page's words: the problems people bring, what working together leads to, the track
// record and the questions people ask.

export const PROBLEMS = [
  {
    title: 'Releases are an event',
    body: 'Changes wait for a release day, and someone has to sit with each deploy in case it goes wrong.',
    before:
      'At Hive we stopped having a release train in 2022. Merged work reaches customers by itself, and a bad deploy rolls itself back.',
  },
  {
    title: 'CI is the slowest part of the day',
    body: 'Every change rebuilds everything, and flaky tests get re-run until they pass.',
    before:
      'Builds that work out what a change touched and build only that, and a test suite moved to Playwright for speed and stability.',
  },
  {
    title: "You've tried AI, with mixed results",
    body: "Some of the team swear by it, some don't trust it, and nobody agrees what good AI-written code looks like.",
    before:
      'Coding guidelines kept in the repo, followed by people and models alike, and an AI review that rates every pull request before a person opens it.',
  },
  {
    title: 'The codebase has drifted',
    body: 'Old tooling, half-finished migrations, and several repos that really should be one.',
    before:
      '18 repositories merged into one with their history intact, then nine repo-wide migrations, each landed as a single reviewed change.',
  },
  {
    title: 'Bigger customers ask harder questions',
    body: 'Security questionnaires, single sign-on, pen tests, ISO 27001. Each deal brings a new list.',
    before:
      'A platform taken to enterprise-ready: SAML SSO, 2FA per organisation, a yearly pen test, and ISO 27001 and GDPR audits every year.',
  },
  {
    title: 'The cloud bill keeps creeping up',
    body: "It's grown with the product, and nobody is quite sure what's driving it.",
    before:
      'Measure first, then cut: about $1.3k a month from the first three changes, each with the evidence in its pull request.',
  },
];

export const OUTCOMES = [
  {
    label: 'your pipeline',
    title: 'One your team trusts',
    body: 'Merge, checks, preview, deploy. Quick enough that nobody waits on it, and safe enough that nobody fears it.',
  },
  {
    label: 'your use of ai',
    title: 'The whole team working the same way',
    body: 'Standards written down where the models can read them, review that flags the risky changes, and the routine chores turned into one command.',
  },
  {
    label: 'your next steps',
    title: 'A plan in order of what matters',
    body: 'Ranked by impact and effort, with the reasoning, so you can act on it with or without me.',
  },
  {
    label: 'your team',
    title: 'Able to run and change all of it',
    body: "Runbooks, docs and a walkthrough, so the knowledge stays with you. I'd rather be called back because it went well than because nobody else understands it.",
  },
];

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
