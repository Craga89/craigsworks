// A hello for anyone who opens the console: the crate in pixels, then who's behind the site, what's
// on offer, the track record and where to go next, in the brand's colours.
import { SERVICES } from '../data/services';
import { RECORD } from '../data/home';
import { EMAIL, LINKEDIN, OWNER, PERSONAL_SITE, SOURCE, LOCATION, url } from '../site';

const LID = '#E9BC7C';
const SIDE = '#C4893F';
const SHADE = '#8F5E24';
const PAPER = '#F6EFE4';
const INK = '#1E1A16';

// The crate, two spaces per pixel: L lid, S side, D shade.
const CRATE = ['...LL...', '.LLLLLL.', 'SSLLLLDD', 'SSSSDDDD', 'SSSSDDDD', 'SSSSDDDD', '.SSSDDD.', '...SD...'];
const FILL: Record<string, string> = { L: LID, S: SIDE, D: SHADE };

const bg = `background:${INK};`;
const mono = 'font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;line-height:1.6;';
const pad = `${bg}${mono}padding:1px 14px;`;
const S = {
  word: `${bg}color:${PAPER};font:700 26px/1.4 system-ui,sans-serif;letter-spacing:-0.03em;padding:14px 14px 4px;`,
  dim: `${pad}color:#B5A897;`,
  cmd: `${pad}color:${LID};`,
  head: `${pad}color:#FFFFFF;font-weight:700;font-size:13px;`,
  text: `${pad}color:#DCD2C4;`,
  ok: `${pad}color:#7FD6A8;`,
  key: `${pad}color:#B5A897;`,
  link: `${pad}color:${LID};`,
  end: `${bg}${mono}color:#B5A897;padding:4px 14px 14px;`,
};

/** The full address of a page on this site, wherever it's served from. */
const here = (path: string) => new URL(url(path), location.href).href;

function crate() {
  const parts: string[] = [];
  const styles: string[] = [];
  for (const row of CRATE) {
    for (const cell of row) {
      parts.push('%c  ');
      styles.push(
        cell in FILL ? `background:${FILL[cell]};font-size:9px;line-height:1.1;` : 'font-size:9px;line-height:1.1;',
      );
    }
    parts.push('\n');
  }
  return { text: parts.join(''), styles };
}

const lines: [keyof typeof S, string][] = [
  ['word', 'craigsworks'],
  ['dim', '\nengineering consultancy · ' + LOCATION + ' · remote'],
  ['cmd', '\n\n$ whoami'],
  ['head', `\n${OWNER}`],
  ['text', '\nHands-on engineer and engineering leader, 20+ years. Startup to acquisition.'],
  ['ok', '\n● open to new projects'],
  ['cmd', '\n\n$ ls ./services'],
  ...SERVICES.flatMap((s): [keyof typeof S, string][] => [
    ['text', `\n${s.name.padEnd(26)}`],
    ['link', here(`services/${s.slug}/`)],
  ]),
  ['cmd', '\n\n$ cat track-record.txt'],
  ...RECORD.map((r): [keyof typeof S, string] => ['ok', `\n✓ ${r}`]),
  ['cmd', '\n\n$ ls ./links'],
  ['key', '\ncase notes   '],
  ['link', here('work/')],
  ['key', '\nabout        '],
  ['link', here('about/')],
  ['key', '\ncv           '],
  ['link', PERSONAL_SITE],
  ['key', '\nlinkedin     '],
  ['link', LINKEDIN],
  ['key', '\nsource       '],
  ['link', SOURCE],
  ['key', '\nemail        '],
  ['link', EMAIL],
  [
    'end',
    '\n\n# Built with Astro, checked for WCAG 2.2 AA on every change, no cookies or tracking.\n# Like what you see in here? A free 30-minute call is an email away.\n',
  ],
];

const art = crate();
console.log(
  art.text + lines.map(([, text]) => '%c' + text).join(''),
  ...art.styles,
  ...lines.map(([style]) => S[style]),
);
