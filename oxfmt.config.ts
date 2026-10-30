// oxfmt has no `extends`: the shared options from Craga89/standards, plus this repo's ignores.
import standards from './node_modules/.pnpm-config/@craga89/standards/configs/oxfmt/base.json' with { type: 'json' };

export default {
  ...standards,
  ignorePatterns: [...standards.ignorePatterns, 'site/**', 'src/assets/fonts/**'],
};
