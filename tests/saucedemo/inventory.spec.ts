import { test, expect } from '../../src/fixtures/test.fixture.js';
import { INVENTORY_ITEMS } from '../../src/data/checkout.data.js';

test.describe('Product Catalog & Inventory Suite @inventory', () => {
  test('should display default product catalog with 6 items', async ({ loggedInAsStandardUser: inventoryPage }) => {
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
    const names = await inventoryPage.getAllItemNames();
    expect(names).toContain(INVENTORY_ITEMS.BACKPACK.name);
    expect(names).toContain(INVENTORY_ITEMS.BIKE_LIGHT.name);
  });

  test('should sort products by Name (A to Z and Z to A)', async ({ loggedInAsStandardUser: inventoryPage }) => {
    // A to Z
    await inventoryPage.selectSortOption('az');
    const namesAZ = await inventoryPage.getAllItemNames();
    const sortedAZ = [...namesAZ].sort((a, b) => a.localeCompare(b));
    expect(namesAZ).toEqual(sortedAZ);

    // Z to A
    await inventoryPage.selectSortOption('za');
    const namesZA = await inventoryPage.getAllItemNames();
    const sortedZA = [...namesZA].sort((a, b) => b.localeCompare(a));
    expect(namesZA).toEqual(sortedZA);
  });

  test('should sort products by Price (Low to High and High to Low)', async ({ loggedInAsStandardUser: inventoryPage }) => {
    // Low to High
    await inventoryPage.selectSortOption('lohi');
    const pricesLoHi = await inventoryPage.getAllItemPrices();
    const sortedLoHi = [...pricesLoHi].sort((a, b) => a - b);
    expect(pricesLoHi).toEqual(sortedLoHi);

    // High to Low
    await inventoryPage.selectSortOption('hilo');
    const pricesHiLo = await inventoryPage.getAllItemPrices();
    const sortedHiLo = [...pricesHiLo].sort((a, b) => b - a);
    expect(pricesHiLo).toEqual(sortedHiLo);
  });

  test('should navigate to product details and return back to inventory', async ({ loggedInAsStandardUser: inventoryPage }) => {
    await inventoryPage.clickItemName(INVENTORY_ITEMS.BACKPACK.name);

    await expect(inventoryPage.page).toHaveURL(/.*inventory-item.html\?id=4/);
    await expect(inventoryPage.page.locator('[data-test="inventory-item-name"]')).toHaveText(INVENTORY_ITEMS.BACKPACK.name);

    const backButton = inventoryPage.page.locator('[data-test="back-to-products"]');
    await expect(backButton).toBeVisible();
    await backButton.click();

    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
  });
});
