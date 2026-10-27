# craigsworks brand kit

The logo is the word **craigsworks**, all lowercase, set in Space Grotesk Bold, with a kraft-paper
shipping crate standing in for the "o". The crate on its own is the icon.

Every file here is final artwork: the letters are outlined (vector shapes, not live text), so they
look the same everywhere and don't need the font installed.

## Files

| File                                                              | Use it for                                                                                                                              |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `svg/craigsworks-wordmark.svg`                                    | The main logo, on light backgrounds                                                                                                     |
| `svg/craigsworks-wordmark-reversed.svg`                           | On dark backgrounds                                                                                                                     |
| `svg/craigsworks-wordmark-black.svg`, `-white.svg`                | One-colour printing, stamps, engraving, photos                                                                                          |
| `svg/craigsworks-crate.svg` (and `-reversed`, `-black`, `-white`) | The icon on its own                                                                                                                     |
| `svg/craigsworks-app-icon.svg`                                    | Avatars and profile pictures (rounded square)                                                                                           |
| `svg/craigsworks-app-icon-square.svg`                             | Where the platform rounds the corners itself                                                                                            |
| `png/`                                                            | The same, as transparent PNGs: wordmarks at 600, 1200 and 2400px wide, the crate at 256, 512 and 1024px, the app icon at 512 and 1024px |
| `favicon/`                                                        | `favicon.ico` (16, 32 and 48px), `favicon.svg`, `apple-touch-icon.png` (180px), `icon-192.png`, `icon-512.png`                          |

Prefer the SVGs; use the PNGs where SVG isn't accepted (social profiles, some email tools, office
documents).

The favicon uses a slightly chunkier crate than the logo so it still reads at 16px.

## Colours: kraft & ink

|       | Hex       | Where                                                   |
| ----- | --------- | ------------------------------------------------------- |
| Lid   | `#E9BC7C` | Crate top; buttons and highlight panels (with ink text) |
| Side  | `#C4893F` | Crate left face; small accents                          |
| Shade | `#8F5E24` | Crate right face                                        |
| Ink   | `#1E1A16` | Letters, body text, dark backgrounds                    |
| Paper | `#F6EFE4` | Light backgrounds                                       |

On dark backgrounds the crate lifts to `#F2C98C` / `#D39A50` / `#A86F2E` and the letters are paper.

For text in the accent colour on a light background, use `#8A5A22` (at least 4.5:1 contrast on paper
and white). Don't set white text on the lid colour; use ink.

## Using the logo

- **Clear space:** keep at least the height of the crate clear on every side.
- **Smallest size:** the wordmark 96px (25mm) wide; below that, use the crate on its own.
- **Don't** recolour the crate, swap it for a real "o", add effects, stretch it, or put the colour
  version on a busy photo (use the one-colour version there).
- In writing, the name is always lowercase: craigsworks, even at the start of a sentence.

## Typeface

[Space Grotesk](https://github.com/floriankarsten/space-grotesk) by Florian Karsten, under the SIL Open
Font License 1.1 (copied in `OFL-SpaceGrotesk.txt`). It's free for commercial use, including logos;
the outlined artwork doesn't count as distributing the font. The website self-hosts the font files,
which the licence also allows as long as the notice goes with them.

The site uses Space Grotesk for everything except code-style labels, which are JetBrains Mono (also
SIL OFL 1.1).
