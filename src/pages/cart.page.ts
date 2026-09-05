import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { CheckoutInfoPage } from './checkout-info.page.js';
import { InventoryPage, CatalogItem } from './inventory.page.js';

/**
 * Page Object representing the Shopping Cart View
 */
export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  /**
   * Retrieves list of all product names currently in cart
   */
  async getItemNames(): Promise<string[]> {
    return await this.itemNames.allInnerTexts();
  }

  /**
   * Removes item from cart by CatalogItem object or data-test string
   */
  async removeItem(item: CatalogItem | string): Promise<this> {
    const selector = typeof item === 'string' ? item : item.dataTestRemove;
    await this.page.locator(`[data-test="${selector}"]`).click();
    return this;
  }

  /**
   * Clicks continue shopping and returns to InventoryPage
   */
  async continueShopping(): Promise<InventoryPage> {
    await this.continueShoppingButton.click();
    return new InventoryPage(this.page);
  }

  /**
   * Proceeds to checkout step 1, returning CheckoutInfoPage instance
   */
  async proceedToCheckout(): Promise<CheckoutInfoPage> {
    await this.checkoutButton.click();
    return new CheckoutInfoPage(this.page);
  }
}
