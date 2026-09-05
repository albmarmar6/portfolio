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
 * Extended Playwright test instance with Page Objects, authenticated state, and auto-cleanup teardown
 */
export const test = baseTest.extend<TestFixtures>({
  page: async ({ page }, use) => {
    await use(page);
    // Automatic teardown: Close the page upon test completion
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
   * Pre-authenticated fixture that navigates to base URL, logs in with standard user,
   * and provides a ready-to-use InventoryPage instance.
   */
  loggedInAsStandardUser: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    const inventoryPage = await loginPage.loginAs(USERS.STANDARD);
    await expect(inventoryPage.pageTitle).toBeVisible();
    await use(inventoryPage);
  },
});

export { expect };
