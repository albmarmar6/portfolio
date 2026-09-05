import { test, expect } from '../../src/fixtures/test.fixture.js';
import { USERS } from '../../src/data/users.data.js';

test.describe('SauceDemo - Network Interception & Mocking Suite @mocking', () => {
  test('should successfully intercept and abort image requests to accelerate page load', async ({ loginPage, page }) => {
    let imageRequestsBlocked = 0;

    await test.step('Set up route interception to block image assets (.png, .jpg, .svg)', async () => {
      await page.route('**/*.{png,jpg,jpeg,svg}*', (route) => {
        imageRequestsBlocked++;
        route.abort();
      });
    });

    await test.step('Navigate to login and authenticate', async () => {
      await loginPage.navigate();
      const inventoryPage = await loginPage.loginAs(USERS.STANDARD);
      await expect(inventoryPage.pageTitle).toHaveText('Products');
    });

    await test.step('Verify that network interception successfully filtered image requests', async () => {
      expect(imageRequestsBlocked).toBeGreaterThan(0);
    });
  });

  test('should intercept and inspect static JavaScript bundle requests', async ({ page }) => {
    let jsBundlesIntercepted = 0;

    await test.step('Monitor JavaScript application bundle requests via route handler', async () => {
      await page.route('**/*.js*', async (route) => {
        jsBundlesIntercepted++;
        await route.continue();
      });
    });

    await test.step('Navigate to application root', async () => {
      await page.goto('/');
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    });

    await test.step('Confirm route handler intercepted and analyzed client bundles', async () => {
      expect(jsBundlesIntercepted).toBeGreaterThan(0);
    });
  });
});
