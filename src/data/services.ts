// The three services: a summary for the home page, and the words for each one's own page.
// Everything under "done before" is from real work; see the case notes (data/notes.ts).

export type Tone = 'acc' | 'ok' | undefined;
/** A step in a flow diagram. */
export interface FlowStep {
  text: string;
  tone?: Tone;
}

export interface Service {
  slug: string;
  /** Short name, for labels and links. */
  name: string;
  /** The page's heading. */
  title: string;
  /** One line for the home page tile. */
  summary: string;
  lede: string;
  /** "Is this you?": signs it would help. */
  signals: string[];
  /** What we'd do together, in order. */
  steps: { title: string; body: string }[];
  stepsNote?: string;
  /** Case note ids (data/notes.ts) to link at the end. */
  related: string[];
  cta: { title: string; body: string };
  description: string;
}

export const SERVICES: Service[] = [
  {
    slug: 'release-acceleration',
    name: 'Release acceleration',
    title: 'Get merged work to customers, without a release day',
    summary:
      'I look at your pipeline, environments and review process, fix the slowest steps first, and work towards deploys nobody has to babysit.',
    lede: "Faster, calmer releases: a pipeline quick enough that nobody waits on it, a preview of every change, and deploys that look after themselves. I've built exactly this, and I'll help your team build its own version.",
    signals: [
      'Changes wait for a weekly or fortnightly release',
      'A deploy needs a particular person around',
      'CI takes long enough that people switch tasks while they wait',
      'Flaky tests get re-run until they go green',
      "Nobody can try a change until it's merged",
      'Rolling back means a scramble and a late night',
    ],
    steps: [
      {
        title: 'Measure',
        body: 'Time every stage of the pipeline and find where the waiting really is. No changes yet, just facts.',
      },
      {
        title: 'Speed up',
        body: 'Fix the slowest steps first: caching, running in parallel, and building only what a change touches.',
      },
      { title: 'Preview', body: 'Give every change a place to be seen before it merges, for review, product and QA.' },
      {
        title: 'Automate and hand over',
        body: 'Deploys that check their own health and roll back, with runbooks and a walkthrough for the team.',
      },
    ],
    stepsNote: 'In this order, because each step makes the next one easier, and you can stop after any of them.',
    related: ['ci', 'test', 'mono'],
    cta: {
      title: 'Want to see where your releases are stuck?',
      body: "Walk me through how a change gets to production today. I'll tell you honestly where I think the time goes.",
    },
    description:
      'Release acceleration: faster, calmer releases with quick CI, a preview of every change and deploys that look after themselves, from someone who has built it.',
  },
  {
    slug: 'ai-adoption',
    name: 'AI development adoption',
    title: 'Bring AI into the team, keep the quality',
    summary:
      'Guidelines in the repo, a pilot on real work, and AI review that helps people decide rather than deciding for them.',
    lede: 'AI coding and review introduced the way I did it at Hive: standards written down where people and models can both read them, a pilot on real work, and review that points people at the risky changes rather than replacing them.',
    signals: [
      'Some of the team use AI every day, others not at all',
      "There's no agreed standard for AI-written code",
      "Reviewers can't keep up with the volume of pull requests",
      'There are worries about security, privacy or where code goes',
      "A tool produced plausible code that didn't fit your codebase",
      'Leadership is asking what the plan for AI is',
    ],
    steps: [
      {
        title: 'Write the rules down',
        body: 'Coding and style guidelines in the repo, so the models and the team work to the same standard.',
      },
      {
        title: 'Pilot on real work',
        body: 'One team, real tickets, a few weeks. We measure what changes rather than guessing.',
      },
      {
        title: 'AI review first, people decide',
        body: 'Every pull request rated for risk before a person opens it, so attention goes where it matters.',
      },
      {
        title: 'Spread what works',
        body: 'Turn the routine chores into commands anyone (or any agent) can run, and update onboarding to match.',
      },
    ],
    related: ['aiproc', 'ai', 'proc'],
    cta: {
      title: 'Curious what AI could do for your team?',
      body: "Tell me how the team works today. I'll share what worked for us, what didn't, and where I'd start in your shoes.",
    },
    description:
      'AI development adoption: AI coding and review brought into your team with written standards, a pilot on real work and review that keeps people in charge.',
  },
  {
    slug: 'health-check',
    name: 'Technical health check',
    title: 'A clear look at where you are, and what to do next',
    summary: 'Fixed scope and price, agreed up front. Useful on its own, and the usual place to start.',
    lede: "A fixed-scope review of how your team builds, ships and runs software, by someone who's run all of it. You end up with a ranked plan you can act on, with or without me.",
    signals: [],
    steps: [],
    related: ['ci', 'cost', 'sec'],
    cta: {
      title: 'Not sure where to start?',
      body: "That's what the health check is for. Tell me a bit about your team on a free call and I'll suggest a scope that fits.",
    },
    description:
      'Technical health check: a fixed-scope review of your delivery, code, cloud, security, AI readiness and team, ending in a ranked plan you keep.',
  },
];

export const service = (slug: string) => {
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) throw new Error(`no service ${slug}`);
  return s;
};

/** The health check's six areas, each with what I've done there before. */
export const AREAS = [
  {
    key: 'delivery',
    title: 'Pipeline and releases',
    body: 'How a change gets from a laptop to customers: CI, environments, testing and the release process.',
    done: "Built Hive's CI/CD from scratch; continuous deployment since 2022.",
  },
  {
    key: 'codebase',
    title: 'Code and tooling',
    body: 'Structure, drift, ageing tools and half-finished migrations.',
    done: 'Merged 18 repos into one; led nine repo-wide migrations.',
  },
  {
    key: 'cloud',
    title: 'Architecture and cost',
    body: 'AWS set-up, networking, scaling, and where the bill really goes.',
    done: 'Moved to Fargate behind CloudFront and WAF; evidence-led cost cuts.',
  },
  {
    key: 'security',
    title: 'Security and enterprise readiness',
    body: 'Access, secrets, public surface, SSO and what auditors and big customers will ask.',
    done: 'ISO 27001 and GDPR audits, yearly pen tests, a new auth framework.',
  },
  {
    key: 'ai',
    title: 'AI readiness',
    body: 'Where AI would help most, and the guardrails it needs first.',
    done: 'Led a department from AI-assisted to AI-first in a year.',
  },
  {
    key: 'team',
    title: 'Team and process',
    body: 'Ways of working, review, on-call, incidents and documentation.',
    done: 'Led teams of up to 12; set up on-call, status page and post-mortems.',
  },
];

/** An illustrative health check plan (not a real client's). */
export const SAMPLE_PLAN: { change: string; impact: 'high' | 'medium'; effort: 'S' | 'M' }[] = [
  { change: 'Build only the packages a change touches', impact: 'high', effort: 'S' },
  { change: 'A preview environment per pull request', impact: 'high', effort: 'M' },
  { change: 'Move secrets out of .env files', impact: 'high', effort: 'S' },
  { change: 'Agree AI coding guidelines, pilot AI review', impact: 'medium', effort: 'M' },
  { change: 'Right-size services idling under 5% CPU', impact: 'medium', effort: 'S' },
];

/** How an engagement runs. */
export const STEPS = [
  { title: 'A free call', body: "30 minutes to talk through what's slowing you down. If I can't help, I'll say so." },
  { title: 'A health check', body: 'Fixed scope and price, agreed up front. You get a ranked plan and a walkthrough.' },
  { title: 'Hands-on work', body: 'Alongside your team, on the items you choose, scoped and priced before we start.' },
  {
    title: 'A clean handover',
    body: 'Docs, runbooks and a session with the team, so it all keeps working without me.',
  },
];
