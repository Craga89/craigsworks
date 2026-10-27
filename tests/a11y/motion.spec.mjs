// Motion: 2.3.3 / 2.2.2 with reduced motion nothing loops; otherwise every loop can be paused,
// and the choice sticks.
// Content on hover or focus: 1.4.13 the tooltip is dismissible, hoverable and persistent.
import { test, expect } from './axe.mjs';

/** Looping animations running on the page now. */
const loops = () =>
  document
    .getAnimations()
    .filter((a) => a.playState === 'running' && a.effect?.getTiming().iterations === Infinity)
    .map((a) => {
      const target = /** @type {KeyframeEffect} */ (a.effect).target;
      return (
        (target && String(/** @type {Element} */ (target).className)) ||
        /** @type {CSSAnimation} */ (a).animationName ||
        '?'
      );
    });

test.describe('motion', { tag: '@desktop' }, () => {
  test.describe('with reduced motion', () => {
    test.use({ contextOptions: { reducedMotion: 'reduce' } });
    test('nothing loops or moves on its own', async ({ page }) => {
      await page.goto('./');
      await expect.poll(() => page.evaluate(loops)).toEqual([]);
    });
  });

  test('every looping animation can be paused, and stays paused', async ({ page }) => {
    await page.goto('./');
    expect(await page.evaluate(loops), 'something loops to begin with').not.toEqual([]);
    const toggle = page.locator('[data-motion-toggle]');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(() => page.evaluate(loops)).toEqual([]);
    await page.reload();
    await expect(page.locator('[data-motion-toggle]')).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(() => page.evaluate(loops)).toEqual([]);
    await page.locator('[data-motion-toggle]').click();
    await expect(page.locator('html')).not.toHaveAttribute('data-motion', 'off');
  });
});

test(
  'the tooltip: shown on hover and focus, hoverable, and Escape dismisses it',
  { tag: '@desktop' },
  async ({ page }) => {
    await page.goto('./');
    const button = page.locator('.tip-btn');
    const tip = page.getByRole('tooltip');
    await expect(button).toHaveAccessibleDescription(/tooltip/);
    await button.scrollIntoViewIfNeeded();
    await expect(tip).toBeHidden();
    await button.hover();
    await expect(tip).toBeVisible();
    await tip.hover();
    await expect(tip, 'stays while the pointer is on it').toBeVisible();
    await page.keyboard.press('Escape');
    await expect(tip, 'Escape dismisses it').toBeHidden();
    await page.mouse.move(1, 1);
    await button.focus();
    await expect(tip, 'shown on keyboard focus').toBeVisible();
    await page.keyboard.press('Escape');
    await expect(tip).toBeHidden();
    await expect(button, 'focus stays put').toBeFocused();
  },
);
