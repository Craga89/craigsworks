// Versions report: for each package, the version in use, the latest, and the newest at least 14 days old.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const names = [...Object.keys(pkg.devDependencies), 'pnpm', 'lighthouse', '@types/node'];
const cutoff = Date.now() - 14 * 864e5;
const out = {};
for (const name of [...new Set(names)]) {
  const v = JSON.parse(execFileSync('pnpm', ['view', name, 'dist-tags', 'time', 'engines', 'peerDependencies', '--json'], { encoding: 'utf8' }));
  const stable = Object.entries(v.time).filter(([k]) => /^\d+\.\d+\.\d+$/.test(k)).sort((a, b) => Date.parse(a[1]) - Date.parse(b[1]));
  const aged = stable.filter(([, t]) => Date.parse(t) <= cutoff).at(-1);
  const recent = stable.slice(-8).map(([k, t]) => `${k} ${t.slice(0, 10)}`);
  out[name] = { current: pkg.devDependencies[name] ?? (name === 'pnpm' ? pkg.packageManager : ''), latest: v['dist-tags'].latest, latestDate: v.time[v['dist-tags'].latest]?.slice(0, 10), aged14: aged?.[0], aged14Date: aged?.[1].slice(0, 10), tags: v['dist-tags'], recent, engines: v.engines, peers: v.peerDependencies };
}
writeFileSync('audit/versions.json', JSON.stringify(out, null, 2));
