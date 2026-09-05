import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object representing common layout elements and methods
 */
export abstract class BasePage {
  readonly page: Page;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutSidebarLink: Locator;
  readonly resetSidebarLink: Locator;
  readonly closeMenuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutSidebarLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetSidebarLink = page.locator('[data-test="reset-sidebar-link"]');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
  }

  /**
   * Get the current count of items in the shopping cart badge.
   * Returns 0 if badge is not present.
   */
  async getCartItemCount(): Promise<number> {
    if (await this.shoppingCartBadge.isVisible()) {
      const text = await this.shoppingCartBadge.innerText();
      return parseInt(text.trim(), 10) || 0;
    }
    return 0;
  }

  /**
   * Open the shopping cart view
   */
  async openCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  /**
   * Open burger menu and click logout
   */
  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutSidebarLink.waitFor({ state: 'visible' });
    await this.logoutSidebarLink.click();
  }

  /**
   * Reset application state via sidebar
   */
  async resetAppState(): Promise<void> {
    await this.menuButton.click();
    await this.resetSidebarLink.waitFor({ state: 'visible' });
    await this.resetSidebarLink.click();
    await this.closeMenuButton.click();
  }
}
