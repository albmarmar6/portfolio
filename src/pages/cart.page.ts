import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';

/**
 * Page Object representing the Shopping Cart View
 */
export class CartPage extends BasePage {
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  /**
   * Returns names of all items in the cart
   */
  async getCartItemNames(): Promise<string[]> {
    return await this.itemNames.allInnerTexts();
  }

  /**
   * Remove item from cart by data-test button attribute
   */
  async removeItemByDataTest(dataTestRemove: string): Promise<void> {
    await this.page.locator(`[data-test="${dataTestRemove}"]`).click();
  }

  /**
   * Navigate back to inventory
   */
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  /**
   * Click checkout button to begin order completion
   */
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
