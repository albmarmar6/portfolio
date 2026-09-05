import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { InventoryPage } from './inventory.page.js';

/**
 * Page Object representing Step 3 of Checkout: Order Complete Confirmation
 */
export class CheckoutCompletePage extends BasePage {
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;
  readonly ponyExpressImage: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.ponyExpressImage = page.locator('[data-test="pony-express"]');
  }

  /**
   * Retrieves header message text
   */
  async getHeaderText(): Promise<string> {
    return (await this.completeHeader.innerText()).trim();
  }

  /**
   * Returns to products catalog
   */
  async backToHome(): Promise<InventoryPage> {
    await this.backHomeButton.click();
    return new InventoryPage(this.page);
  }
}
