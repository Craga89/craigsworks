// Stroke icon paths on a 24 × 24 grid, for components/ui/Icon.astro.
export const PATHS = {
  pulse: ['M3 12h4l3-8 4 16 3-8h4'],
  code: ['M8 6l-6 6 6 6', 'M16 6l6 6-6 6'],
  cloud: ['M7 18a5 5 0 0 1 0-10 6 6 0 0 1 11.3 1.5A4 4 0 0 1 17.5 18Z'],
  shield: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6Z', 'M9 12l2 2 4-4'],
  spark: ['M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8'],
  team: [
    'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'M3 20a6 6 0 0 1 12 0',
    'M17 11a3 3 0 1 0 0-6',
    'M21 20a6 6 0 0 0-4-5.7',
  ],
  key: ['M8 19a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M11 12l9-9', 'M17 6l3 3'],
  search: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z', 'M21 21l-4.3-4.3'],
  lock: ['M6 10h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z', 'M8 10V7a4 4 0 0 1 8 0v3'],
  check: ['M5 12l5 5L20 7'],
  copy: ['M9 9h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2Z', 'M5 15V5a2 2 0 0 1 2-2h8'],
} as const;

export type IconName = keyof typeof PATHS;
