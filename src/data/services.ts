// The three services, as the home page's tabs show them.

export interface Service {
  /** Used for the tab and panel ids. */
  id: string;
  /** The tab's label. */
  tab: string;
  title: string;
  body: string;
  note: string;
  /** Three tiles: what the work involves. */
  steps: [string, string, string];
}

export const SERVICES: Service[] = [
  {
    id: 'releases',
    tab: 'Releases',
    title: 'Release Acceleration',
    body: 'I review your pipeline, environments and review process, then fix the slowest steps. Faster, safer releases and a deploy button people trust.',
    note: 'Pairs well with a health check first',
    steps: ['Cached, parallel builds', 'A preview environment per change', 'Automated deploys with rollback'],
  },
  {
    id: 'ai',
    tab: 'AI adoption',
    title: 'AI Development Adoption',
    body: "AI coding and review tools, introduced with the guidelines and guardrails that keep quality high. I've led this shift in a live SaaS team.",
    note: 'The speed of AI, the quality of a senior team',
    steps: ['Guidelines committed in the repo', 'A pilot with one team', 'AI review first, humans decide'],
  },
  {
    id: 'health',
    tab: 'Health check',
    title: 'Technical Health Check',
    body: 'A fixed-price, fixed-scope audit of your architecture, security and delivery, ending in a prioritised plan you keep, with or without me.',
    note: 'Fixed price, agreed up front · most clients start here',
    steps: ['Pipeline, environments and testing', 'Architecture and security', 'A ranked plan and a walkthrough'],
  },
];

/** Track record lines, shown as a terminal. */
export const RECORD = [
  'Led engineering from startup through acquisition',
  'Team of up to 12; hired 10+ engineers',
  'Moved a live SaaS team to AI-assisted development',
  'ISO 27001 + GDPR, incident response, disaster recovery',
  'On-call rota, status page, yearly pen test',
];

/** How an engagement runs. */
export const STEPS = [
  { title: 'Intro call', body: 'Free, 30 minutes. Is this a fit?' },
  { title: 'Health check', body: 'Fixed scope and price. A plan you keep.' },
  { title: 'Hands-on work', body: 'Alongside your team, then a clean handover.' },
];
