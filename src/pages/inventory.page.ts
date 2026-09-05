import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

/**
 * Page Object representing the Inventory (Product Catalog) Page
 */
export class InventoryPage extends BasePage {
  readonly title: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
  }

  /**
   * Sort products using the dropdown
   * 'az': Name (A to Z)
   * 'za': Name (Z to A)
   * 'lohi': Price (low to high)
   * 'hilo': Price (high to low)
   */
  async selectSortOption(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  /**
   * Returns list of all item names currently rendered in the catalog
   */
  async getAllItemNames(): Promise<string[]> {
    return await this.itemNames.allInnerTexts();
  }

  /**
   * Returns list of all item prices parsed as floating point numbers
   */
  async getAllItemPrices(): Promise<number[]> {
    const rawPrices = await this.itemPrices.allInnerTexts();
    return rawPrices.map((price) => parseFloat(price.replace('$', '').trim()));
  }

  /**
   * Add item to cart by its button data-test attribute or name
   */
  async addItemByDataTest(dataTestAdd: string): Promise<void> {
    await this.page.locator(`[data-test="${dataTestAdd}"]`).click();
  }

  /**
   * Remove item from cart by its button data-test attribute
   */
  async removeItemByDataTest(dataTestRemove: string): Promise<void> {
    await this.page.locator(`[data-test="${dataTestRemove}"]`).click();
  }

  /**
   * Click on a product name to navigate to its details view
   */
  async clickItemName(name: string): Promise<void> {
    await this.page.locator('[data-test="inventory-item-name"]', { hasText: name }).click();
  }
}
