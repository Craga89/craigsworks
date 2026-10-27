// A hello for anyone who opens the console: the crate in pixels, then who's behind the site, what's
// on offer, the track record and where to go next, in the brand's colours on an ink panel.
import { SERVICES } from '../data/services';
import { RECORD } from '../data/home';
import { EMAIL, LINKEDIN, OWNER, PERSONAL_SITE, SOURCE, LOCATION, url } from '../site';

const LID = '#E9BC7C';
const SIDE = '#C4893F';
const SHADE = '#8F5E24';
const INK = '#1E1A16';

const MONO = 'font-family:ui-monospace,Menlo,Consolas,monospace;';
const panel = `background:${INK};${MONO}font-size:12px;line-height:1.7;`;
const STYLE = {
  word: `background:${INK};color:#F6EFE4;font:700 24px/1.5 system-ui,sans-serif;letter-spacing:-0.03em;`,
  dim: `${panel}color:#B5A897;`,
  cmd: `${panel}color:${LID};`,
  head: `${panel}color:#FFFFFF;font-weight:700;`,
  text: `${panel}color:#DCD2C4;`,
  ok: `${panel}color:#7FD6A8;`,
  link: `${panel}color:${LID};`,
};
type Style = keyof typeof STYLE;
type Row = [Style, string][];

// The crate, a block per pixel: L lid, S side, D shade.
const CRATE = ['...LL...', '.LLLLLL.', 'SSLLLLDD', 'SSSSDDDD', 'SSSSDDDD', 'SSSSDDDD', '.SSSDDD.', '...SD...'];
const PIXEL: Record<string, string> = { L: LID, S: SIDE, D: SHADE };

/** The full address of a page on this site, wherever it's served from. */
const here = (path: string) => new URL(url(path), location.href).href;

const rows: Row[] = [
  [['dim', `engineering consultancy · ${LOCATION} · remote`]],
  [],
  [['cmd', '$ whoami']],
  [['head', OWNER]],
  [['text', 'Hands-on engineer and engineering leader, 20+ years. Startup to acquisition.']],
  [['ok', '● open to new projects']],
  [],
  [['cmd', '$ ls ./services']],
  ...SERVICES.map((s): Row => [
    ['text', s.name.padEnd(26)],
    ['link', here(`services/${s.slug}/`)],
  ]),
  [],
  [['cmd', '$ cat track-record.txt']],
  ...RECORD.map((r): Row => [['ok', `✓ ${r}`]]),
  [],
  [['cmd', '$ ls ./links']],
  ...(
    [
      ['case notes', here('work/')],
      ['about', here('about/')],
      ['cv', PERSONAL_SITE],
      ['linkedin', LINKEDIN],
      ['source', SOURCE],
      ['email', EMAIL],
    ] as const
  ).map(([k, v]): Row => [
    ['dim', k.padEnd(13)],
    ['link', v],
  ]),
  [],
  [['dim', '# Built with Astro, checked for WCAG 2.2 AA on every change, no cookies or tracking.']],
  [['dim', '# Like what you see in here? A free 30-minute call is an email away.']],
];

// Every row padded to the same width, so the ink panel has a straight right-hand edge.
const width = Math.max(...rows.map((r) => r.reduce((n, [, t]) => n + t.length, 0))) + 2;

const text: string[] = [];
const styles: string[] = [];
const add = (style: string, t: string) => {
  text.push('%c' + t);
  styles.push(style);
};

for (const line of CRATE) {
  for (const cell of line) add(`${MONO}font-size:12px;line-height:1;color:${PIXEL[cell] ?? 'transparent'};`, '██');
  add(MONO, '\n');
}
add(STYLE.word, ` craigsworks${' '.repeat(Math.max(0, Math.round(width * 0.5) - 12))}\n`);
for (const row of rows) {
  const used = row.reduce((n, [, t]) => n + t.length, 0);
  add(STYLE.dim, ' ');
  for (const [style, t] of row) add(STYLE[style], t);
  add(STYLE.dim, ' '.repeat(width - used) + '\n');
}

console.log(text.join(''), ...styles);
