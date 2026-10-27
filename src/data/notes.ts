// Case notes: real work, mostly from leading engineering at Hive HR, summarised from the case
// studies on craigthompson.dev (each note links to its full write-up there).
import { PERSONAL_SITE } from '../site';

export type Area = 'releases' | 'ai' | 'platform' | 'cost' | 'business';

export interface Note {
  id: string;
  area: Area;
  kicker: string;
  title: string;
  /** The headline result. */
  stat: string;
  body: string;
  /** Who it's useful for. */
  fit: string;
  /** The full write-up on craigthompson.dev. */
  href: string;
}

const cs = (slug: string) => `${PERSONAL_SITE}/case-studies/${slug}/`;
const resp = (slug: string) => `${PERSONAL_SITE}/responsibilities/${slug}/`;

export const AREAS: { key: Area; label: string }[] = [
  { key: 'releases', label: 'Releases and tooling' },
  { key: 'ai', label: 'AI' },
  { key: 'platform', label: 'Platform and security' },
  { key: 'cost', label: 'Cost' },
  { key: 'business', label: 'Business' },
];

export const NOTES: Note[] = [
  {
    id: 'ci',
    area: 'releases',
    kicker: 'ci/cd · 2019 → today',
    title: 'Build only what changed, ship every merge',
    stat: 'no release train since 2022',
    body: 'A graph-aware build engine on self-hosted Buildkite, one quality gate, a test environment from any pull request, and deploys that stop themselves.',
    fit: 'Useful if changes queue up for a release, or CI is the slowest part of the day.',
    href: cs('ci-cd'),
  },
  {
    id: 'aiproc',
    area: 'ai',
    kicker: 'ai-assisted engineering · last 12 months',
    title: 'From AI-assisted to AI-first, in a year',
    stat: 'most code AI-generated',
    body: 'Guidelines in the repo, AI risk ratings on every pull request, AI summaries of Terraform plans, and 20+ Claude Code skills for the chores.',
    fit: "Useful if AI use is patchy, or reviewers can't keep up.",
    href: resp('ai'),
  },
  {
    id: 'mono',
    area: 'releases',
    kicker: 'monorepo · 2019 → today',
    title: 'One codebase, kept modern without stopping delivery',
    stat: '18 repos → 1, history intact',
    body: 'Twelve services, a React app, Lambdas, Terraform and a QA suite merged into one TypeScript monorepo, now 100+ packages.',
    fit: 'Useful if the same change means several repos and several pull requests.',
    href: cs('monorepo'),
  },
  {
    id: 'refactor',
    area: 'releases',
    kicker: 'refactors and migrations',
    title: 'Keep the toolchain modern, one reviewed change at a time',
    stat: '9,700+ files, ~10× faster typechecks',
    body: 'Nine repo-wide migrations, each scripted with a codemod and landed as a single reviewed change: linting, packages, bundling, runtime, compiler.',
    fit: 'Useful if your tooling has aged, or a migration has been "half done" for months.',
    href: cs('refactor'),
  },
  {
    id: 'test',
    area: 'releases',
    kicker: 'test automation',
    title: 'A test suite that kept up with the platform',
    stat: 'Cypress → Playwright',
    body: 'Led the first end-to-end suite with the Test Automation Engineers, then moved it to Playwright when it grew slow.',
    fit: 'Useful if tests are slow, flaky or quietly ignored.',
    href: cs('testing'),
  },
  {
    id: 'ai',
    area: 'ai',
    kicker: 'ai platform · 2024 → 2026',
    title: 'AI where it earns its keep',
    stat: 'evals in CI',
    body: 'An agent service built with Mastra on Amazon Bedrock, in its own AWS account with its own bill, checked by an eval suite before changes reach customers.',
    fit: 'Useful if you want AI in the product, not just in the editor.',
    href: cs('ai-platform'),
  },
  {
    id: 'aws',
    area: 'platform',
    kicker: 'aws architecture · 2021 → 2026',
    title: 'Nothing public but the CDN',
    stat: 'no servers to patch',
    body: 'From EC2 hosts behind a public load balancer to Fargate and Service Connect, with CloudFront and WAF the only way in. No big-bang cutover.',
    fit: 'Useful before a security review, or when patching hosts eats into delivery.',
    href: cs('aws'),
  },
  {
    id: 'auth',
    area: 'platform',
    kicker: 'authentication · 2024 → 2026',
    title: "Sign-in that enterprises trust and users don't notice",
    stat: 'SAML SSO · 2FA per org',
    body: 'A legacy sign-in replaced organisation by organisation behind a per-tenant switch, with rate limits by identity and keys that rotate without logouts.',
    fit: 'Useful when enterprise customers start asking for SSO.',
    href: cs('auth'),
  },
  {
    id: 'sec',
    area: 'platform',
    kicker: 'security and privacy · 2021 → 2026',
    title: 'Closing doors, not adding locks',
    stat: 'port 22 closed everywhere',
    body: 'SSO-only admin access, PrivateLink instead of peering, secrets injected at runtime, pen-test findings fixed and tracked to closure.',
    fit: 'Useful when security questionnaires keep getting longer.',
    href: cs('security'),
  },
  {
    id: 'cost',
    area: 'cost',
    kicker: 'cloud cost · 2022 → 2026',
    title: 'Measure first, then cut',
    stat: '≈ $1.3k / month, first three',
    body: 'Traced ~1.2 TB a day of CI NAT traffic, halved idle services, right-sized Redis, and scaled non-production down every night.',
    fit: 'Useful if the cloud bill has grown faster than the product.',
    href: cs('cost'),
  },
  {
    id: 'data',
    area: 'platform',
    kicker: 'data and performance',
    title: 'Making the flagship report fast at scale',
    stat: '10× higher complexity ceiling',
    body: 'Moved reporting work from read time to write time, and proved the new version matched the old one in production before switching.',
    fit: 'Useful if your biggest customers are the ones finding the slow pages.',
    href: cs('data'),
  },
  {
    id: 'i18n',
    area: 'platform',
    kicker: 'internationalisation',
    title: 'One product in 36 languages, kept in step',
    stat: '~116k blank strings removed',
    body: 'Language files synced on every build, English as the fallback, and customer content translated cache-first inside the VPC.',
    fit: 'Useful if translations drift or show up blank.',
    href: cs('i18n'),
  },
  {
    id: 'acq',
    area: 'business',
    kicker: 'startup → acquisition',
    title: 'From startup to acquisition',
    stat: 'through due diligence',
    body: 'Technical leadership across the whole journey, then representing engineering through architecture, security, compliance and code-quality questions.',
    fit: 'Useful if investment or an exit is on the horizon.',
    href: resp('acquisition'),
  },
  {
    id: 'proc',
    area: 'business',
    kicker: 'ways of working',
    title: 'Process that changes when the team does',
    stat: 'Scrum → Kanban → AI-driven',
    body: 'Team process iterated many times, most recently for AI-driven workflows, with one set of guidelines for engineers and AI tools alike.',
    fit: 'Useful if process has grown hoops nobody remembers the reason for.',
    href: resp('process'),
  },
];

export const note = (id: string) => {
  const n = NOTES.find((x) => x.id === id);
  if (!n) throw new Error(`no case note ${id}`);
  return n;
};
