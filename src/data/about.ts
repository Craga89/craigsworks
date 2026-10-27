// The about page: career, ways of working and what others have said. From craigthompson.dev.

export const CAREER = [
  {
    when: 'Dec 2018 →',
    company: 'Hive HR',
    role: 'Head of Engineering',
    body: 'Engineering for a multi-tenant B2B SaaS platform running 24/7 for enterprise, mid-market and SME customers, with a team of up to 12.',
    phases: [
      {
        when: '2019–21',
        title: 'Foundations',
        body: '18 repositories into one TypeScript monorepo; CI/CD, Docker and local dev; the React design system.',
      },
      {
        when: '2021–24',
        title: 'Platform',
        body: 'Self-hosted Buildkite and an in-house build engine; continuous deployment; hardened AWS access.',
      },
      {
        when: '2024–26',
        title: 'Architecture, security and AI',
        body: 'Fargate behind CloudFront and WAF, a new auth framework, evidence-led cost cuts, an AI agent service.',
      },
      {
        when: '2026',
        title: 'Acquisition',
        body: 'Through to the acquisition by WorkBuzz, representing engineering through due diligence.',
      },
    ],
  },
  {
    when: '2013 – 2018',
    company: 'Communicator',
    role: 'Technical Lead',
    body: 'Led a Scrum team building an email marketing platform that sends billions of emails: a React drag-and-drop email designer, a CSS-inlining service, and the move to Git and self-hosted GitLab CI.',
    phases: [],
  },
  {
    when: '2011 – 2012',
    company: 'Eutechnyx',
    role: 'Front-end Web Developer',
    body: 'Interfaces and CMS pages for the Auto Club Revolution project, with JavaScript and Backbone.js.',
    phases: [],
  },
  {
    when: '2008 →',
    company: 'craigsworks',
    role: 'Consultant and open-source maintainer',
    body: 'One-off projects for clients worldwide, from single websites to a crop management application, accessible UI libraries, and maintaining qTip2.',
    phases: [],
  },
];

export const SKILLS = [
  { label: 'engineering', items: ['TypeScript, Node.js, React', 'Monorepos and build tooling', 'Playwright, accessibility'] },
  {
    label: 'platform',
    items: ['AWS: Fargate, CloudFront, WAF', 'Terraform, Buildkite, GitHub Actions', 'Auth: SAML SSO, 2FA, key rotation'],
  },
  { label: 'ai', items: ['AI-first team workflows', 'AI review and risk ratings in CI', 'Mastra, Amazon Bedrock, evals'] },
  { label: 'around the code', items: ['Hiring, 1:1s, progression', 'ISO 27001, GDPR, pen tests', 'On-call, incidents, DR'] },
];

export const PRINCIPLES = [
  {
    title: 'Measure first, then change',
    body: "Every saving and speed-up I've made started with data, and landed with the evidence alongside it.",
  },
  {
    title: 'One reviewed change, not a long-lived branch',
    body: 'Big migrations scripted and landed in one go, so the codebase never splits into "old" and "new".',
  },
  {
    title: 'Close doors rather than add locks',
    body: 'Remove whole classes of risk, like public servers or standing keys, instead of piling on controls.',
  },
  {
    title: 'Plain English for the people paying',
    body: 'Technical work explained in terms of outcomes, from engineers to the board.',
  },
  {
    title: 'Fix the system, not the person',
    body: 'Incidents end in better tooling and runbooks, never finger-pointing.',
  },
  {
    title: 'Remove friction before adding process',
    body: 'Most teams need fewer hoops, not more. Process should change when the team does.',
  },
];

/** From LinkedIn, quoted as written (… marks a cut). */
export const QUOTES = [
  {
    quote:
      'Craig is a very able developer, who is capable of putting together high-quality front-end solutions at lightning speed.',
    who: 'Joe Forster',
    role: 'Senior AI Programmer at Ubisoft Reflections',
    when: 'LinkedIn, 2012',
  },
  {
    quote:
      'Craig is the go-to person for all of the frontend jQuery and CSS related issues. … An all-round excellent web-developer.',
    who: 'Peter Davies',
    role: 'Software Engineering Leader',
    when: 'LinkedIn, 2012',
  },
];
