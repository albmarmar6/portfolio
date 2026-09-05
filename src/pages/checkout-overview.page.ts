import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { CheckoutCompletePage } from './checkout-complete.page.js';
import { InventoryPage } from './inventory.page.js';

/**
 * Page Object representing Step 2 of Checkout: Order Overview & Financial Summary
 */
export class CheckoutOverviewPage extends BasePage {
  readonly cartItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  /**
   * Extracts and parses the subtotal from text format: 'Item total: $XX.XX'
   */
  async getSubtotal(): Promise<number> {
    const text = await this.subtotalLabel.innerText();
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Extracts and parses the tax amount from text format: 'Tax: $X.XX'
   */
  async getTax(): Promise<number> {
    const text = await this.taxLabel.innerText();
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Extracts and parses the total price from text format: 'Total: $XX.XX'
   */
  async getTotal(): Promise<number> {
    const text = await this.totalLabel.innerText();
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Submits final order confirmation, returning CheckoutCompletePage instance
   */
  async finishOrder(): Promise<CheckoutCompletePage> {
    await this.finishButton.click();
    return new CheckoutCompletePage(this.page);
  }

  /**
   * Cancels checkout overview and returns to InventoryPage
   */
  async cancel(): Promise<InventoryPage> {
    await this.cancelButton.click();
    return new InventoryPage(this.page);
  }
}
