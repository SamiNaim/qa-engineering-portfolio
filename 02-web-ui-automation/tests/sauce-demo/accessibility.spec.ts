import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@fixtures/test-fixtures';
import { SAUCE_STORAGE_STATE } from '@config/paths';

test.use({ storageState: SAUCE_STORAGE_STATE });

/**
 * Accepted pre-existing violations in the application under test.
 *
 * Sauce Demo genuinely ships these defects; they are not test bugs and we
 * cannot fix third-party markup. Recording them here keeps the suite honest:
 * the test still fails on any *new* violation, which is the regression signal
 * we actually want. Remove an entry once the site fixes it.
 */
const KNOWN_VIOLATIONS: Record<string, string> = {
  'select-name': 'Product sort dropdown ships with no accessible name (critical).',
};

test.describe('Sauce Demo - Accessibility', () => {
  test(
    'inventory page introduces no new WCAG violations',
    { tag: ['@a11y', '@regression'] },
    async ({ inventory, page }, testInfo) => {
      await inventory.open();
      await expect(inventory.inventoryList).toBeVisible();

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Attach the full scan so every finding is visible in the HTML report,
      // including the ones the baseline tolerates.
      await testInfo.attach('axe-violations.json', {
        body: JSON.stringify(results.violations, null, 2),
        contentType: 'application/json',
      });

      // Surface the tolerated findings in the report so the baseline stays visible.
      testInfo.annotations.push(
        ...results.violations
          .filter((v) => v.id in KNOWN_VIOLATIONS)
          .map((v) => ({
            type: 'known-a11y-issue',
            description: `${v.id} — ${KNOWN_VIOLATIONS[v.id]}`,
          }))
      );

      const newViolations = results.violations.filter((v) => !(v.id in KNOWN_VIOLATIONS));

      expect(
        newViolations.map((v) => `${v.impact}: ${v.id} — ${v.help}`),
        'New accessibility violations detected that are not in the documented baseline'
      ).toEqual([]);
    }
  );
});
