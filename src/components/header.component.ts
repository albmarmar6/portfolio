import { Locator, Page } from '@playwright/test';

/**
 * Component representing the navigation header bar present across SauceDemo pages
 */
export class HeaderComponent {
  readonly page: Page;
  readonly container: Locator;
  readonly appLogo: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly openMenuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator('.primary_header');
    this.appLogo = page.locator('.app_logo');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.openMenuButton = page.locator('#react-burger-menu-btn');
  }

  /**
   * Reads and parses the current numeric count from the cart badge.
   * Returns 0 if no badge is visible (cart is empty).
   */
  async getCartBadgeCount(): Promise<number> {
    if (await this.shoppingCartBadge.isVisible()) {
      const text = await this.shoppingCartBadge.innerText();
      return parseInt(text.trim(), 10) || 0;
    }
    return 0;
  }

  /**
   * Clicks on the shopping cart icon
   */
  async clickCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  /**
   * Opens the burger menu sidebar
   */
  async openMenu(): Promise<void> {
    await this.openMenuButton.click();
  }
}
