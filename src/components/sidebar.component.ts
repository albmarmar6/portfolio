import { Locator, Page } from '@playwright/test';

/**
 * Component representing the collapsible sidebar navigation menu
 */
export class SidebarComponent {
  readonly page: Page;
  readonly container: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly closeMenuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator('.bm-menu-wrap');
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.aboutLink = page.locator('[data-test="about-sidebar-link"]');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetAppStateLink = page.locator('[data-test="reset-sidebar-link"]');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
  }

  /**
   * Clicks logout link inside sidebar
   */
  async clickLogout(): Promise<void> {
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.logoutLink.click();
  }

  /**
   * Resets application state and closes sidebar
   */
  async resetAppState(): Promise<void> {
    await this.resetAppStateLink.waitFor({ state: 'visible' });
    await this.resetAppStateLink.click();
    await this.closeMenuButton.click();
    await this.container.waitFor({ state: 'hidden' });
  }

  /**
   * Closes the sidebar menu
   */
  async close(): Promise<void> {
    await this.closeMenuButton.click();
    await this.container.waitFor({ state: 'hidden' });
  }
}
