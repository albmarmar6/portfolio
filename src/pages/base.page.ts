import { Page, Locator } from '@playwright/test';
import { HeaderComponent } from '../components/header.component.js';
import { SidebarComponent } from '../components/sidebar.component.js';

/**
 * Abstract Base Page Object establishing shared layout components and generic interactions
 */
export abstract class BasePage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly sidebar: SidebarComponent;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.sidebar = new SidebarComponent(page);
    this.pageTitle = page.locator('[data-test="title"]');
  }

  /**
   * Retrieves the header title text of the current page (e.g., 'Products', 'Your Cart')
   */
  async getPageTitleText(): Promise<string> {
    return (await this.pageTitle.innerText()).trim();
  }

  /**
   * Open the sidebar and perform logout
   */
  async logout(): Promise<void> {
    await this.header.openMenu();
    await this.sidebar.clickLogout();
  }
}
