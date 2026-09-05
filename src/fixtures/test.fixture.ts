import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { InventoryPage } from '../pages/inventory.page.js';
import { CartPage } from '../pages/cart.page.js';
import { CheckoutInfoPage } from '../pages/checkout-info.page.js';
import { CheckoutOverviewPage } from '../pages/checkout-overview.page.js';
import { CheckoutCompletePage } from '../pages/checkout-complete.page.js';
import { USERS } from '../data/users.data.js';

/**
 * Fixture types definition
 */
export type TestFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
  loggedInAsStandardUser: InventoryPage;
};

/**
 * Extended Playwright test instance with Page Objects and authenticated state fixtures
 */
export const test = baseTest.extend<TestFixtures>({
  page: async ({ page }, use) => {
    await use(page);
    // Automatic teardown: Close the browser page/window as soon as the test finishes
    await page.close();
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutInfoPage: async ({ page }, use) => {
    await use(new CheckoutInfoPage(page));
  },

  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },

  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },

  /**
   * Pre-authenticated fixture that navigates to base URL, performs login with standard user,
   * and provides ready-to-use InventoryPage instance.
   */
  loggedInAsStandardUser: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.title).toBeVisible();
    await use(inventoryPage);
  },
});

export { expect };
