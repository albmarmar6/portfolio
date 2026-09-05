import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { CartPage } from './cart.page.js';

export type ProductSortOrder = 'az' | 'za' | 'lohi' | 'hilo';

export interface CatalogItem {
  name: string;
  price: number;
  dataTestAdd: string;
  dataTestRemove: string;
}

/**
 * Page Object representing the Product Catalog (Inventory) View
 */
export class InventoryPage extends BasePage {
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
  }

  /**
   * Sorts the catalog items using the dropdown filter
   */
  async sortBy(order: ProductSortOrder): Promise<this> {
    await this.sortDropdown.selectOption(order);
    return this;
  }

  /**
   * Returns list of all item names displayed on the catalog
   */
  async getItemNames(): Promise<string[]> {
    return await this.itemNames.allInnerTexts();
  }

  /**
   * Returns numeric prices parsed from catalog ($XX.XX -> XX.XX)
   */
  async getItemPrices(): Promise<number[]> {
    const rawPrices = await this.itemPrices.allInnerTexts();
    return rawPrices.map((price) => parseFloat(price.replace('$', '').trim()));
  }

  /**
   * Adds product to cart using strongly typed CatalogItem or string key
   */
  async addItemToCart(item: CatalogItem | string): Promise<this> {
    const selector = typeof item === 'string' ? item : item.dataTestAdd;
    await this.page.locator(`[data-test="${selector}"]`).click();
    return this;
  }

  /**
   * Removes product from cart on inventory page
   */
  async removeItemFromCart(item: CatalogItem | string): Promise<this> {
    const selector = typeof item === 'string' ? item : item.dataTestRemove;
    await this.page.locator(`[data-test="${selector}"]`).click();
    return this;
  }

  /**
   * Navigates to the shopping cart page, returning CartPage instance
   */
  async openCart(): Promise<CartPage> {
    await this.header.clickCart();
    return new CartPage(this.page);
  }

  /**
   * Clicks on an item title to open its detail view
   */
  async openItemDetails(itemName: string): Promise<void> {
    await this.page.locator('[data-test="inventory-item-name"]', { hasText: itemName }).click();
  }
}
