import { Page, Locator } from '@playwright/test';
import { InventoryPage } from './inventory.page.js';

export interface UserCredentials {
  username: string;
  password?: string;
}

/**
 * Page Object representing the SauceDemo Authentication View
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessageContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessageContainer = page.locator('[data-test="error"]');
  }

  /**
   * Navigates directly to the login page
   */
  async navigate(): Promise<this> {
    await this.page.goto('/');
    return this;
  }

  /**
   * Submits credentials and returns InventoryPage instance for fluent chaining
   */
  async loginAs(credentials: UserCredentials): Promise<InventoryPage> {
    await this.fillCredentials(credentials.username, credentials.password);
    await this.loginButton.click();
    return new InventoryPage(this.page);
  }

  /**
   * Fills credentials without asserting navigation (useful for negative/error cases)
   */
  async submitInvalidLogin(username?: string, password?: string): Promise<this> {
    await this.fillCredentials(username, password);
    await this.loginButton.click();
    return this;
  }

  /**
   * Helper to fill user input fields safely
   */
  private async fillCredentials(username?: string, password?: string): Promise<void> {
    if (username !== undefined) {
      await this.usernameInput.fill(username);
    }
    if (password !== undefined) {
      await this.passwordInput.fill(password);
    }
  }

  /**
   * Retrieves text content from the error message banner
   */
  async getErrorMessage(): Promise<string> {
    await this.errorMessageContainer.waitFor({ state: 'visible' });
    return (await this.errorMessageContainer.innerText()).trim();
  }

  /**
   * Verifies if the error banner is currently displayed
   */
  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessageContainer.isVisible();
  }
}
