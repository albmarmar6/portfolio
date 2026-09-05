import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';

/**
 * Page Object representing Step 2 of Checkout: Order Overview & Summary
 */
export class CheckoutOverviewPage extends BasePage {
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  /**
   * Parse numeric subtotal from 'Item total: $XX.XX'
   */
  async getSubtotal(): Promise<number> {
    const text = await this.subtotalLabel.innerText();
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Parse numeric tax amount from 'Tax: $X.XX'
   */
  async getTax(): Promise<number> {
    const text = await this.taxLabel.innerText();
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Parse total cost from 'Total: $XX.XX'
   */
  async getTotal(): Promise<number> {
    const text = await this.totalLabel.innerText();
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Finalize the order
   */
  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }
}
