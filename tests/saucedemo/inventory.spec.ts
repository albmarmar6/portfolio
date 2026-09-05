import { test, expect } from '../../src/fixtures/test.fixture.js';
import { INVENTORY_ITEMS } from '../../src/data/checkout.data.js';

test.describe('Product Catalog & Inventory Suite @inventory', () => {
  test('should display default product catalog with 6 items', async ({ loggedInAsStandardUser: inventoryPage }) => {
    await test.step('Verify total count of items rendered on catalog', async () => {
      await expect(inventoryPage.inventoryItems).toHaveCount(6);
    });

    await test.step('Verify specific key products are present in catalog', async () => {
      const names = await inventoryPage.getItemNames();
      expect(names).toContain(INVENTORY_ITEMS.BACKPACK.name);
      expect(names).toContain(INVENTORY_ITEMS.BIKE_LIGHT.name);
    });
  });

  test('should sort products by Name (A to Z and Z to A)', async ({ loggedInAsStandardUser: inventoryPage }) => {
    await test.step('Sort by Name (A to Z) and verify alphabetical order', async () => {
      await inventoryPage.sortBy('az');
      const namesAZ = await inventoryPage.getItemNames();
      const sortedAZ = [...namesAZ].sort((a, b) => a.localeCompare(b));
      expect(namesAZ).toEqual(sortedAZ);
    });

    await test.step('Sort by Name (Z to A) and verify reverse alphabetical order', async () => {
      await inventoryPage.sortBy('za');
      const namesZA = await inventoryPage.getItemNames();
      const sortedZA = [...namesZA].sort((a, b) => b.localeCompare(a));
      expect(namesZA).toEqual(sortedZA);
    });
  });

  test('should sort products by Price (Low to High and High to Low)', async ({ loggedInAsStandardUser: inventoryPage }) => {
    await test.step('Sort by Price (Low to High) and verify ascending numeric order', async () => {
      await inventoryPage.sortBy('lohi');
      const pricesLoHi = await inventoryPage.getItemPrices();
      const sortedLoHi = [...pricesLoHi].sort((a, b) => a - b);
      expect(pricesLoHi).toEqual(sortedLoHi);
    });

    await test.step('Sort by Price (High to Low) and verify descending numeric order', async () => {
      await inventoryPage.sortBy('hilo');
      const pricesHiLo = await inventoryPage.getItemPrices();
      const sortedHiLo = [...pricesHiLo].sort((a, b) => b - a);
      expect(pricesHiLo).toEqual(sortedHiLo);
    });
  });

  test('should navigate to product details and return back to inventory', async ({ loggedInAsStandardUser: inventoryPage }) => {
    await test.step('Click on Backpack product name to view details', async () => {
      await inventoryPage.openItemDetails(INVENTORY_ITEMS.BACKPACK.name);
      await expect(inventoryPage.page).toHaveURL(/.*inventory-item.html\?id=4/);
      await expect(inventoryPage.page.locator('[data-test="inventory-item-name"]')).toHaveText(INVENTORY_ITEMS.BACKPACK.name);
    });

    await test.step('Click back button and verify navigation back to inventory', async () => {
      const backButton = inventoryPage.page.locator('[data-test="back-to-products"]');
      await expect(backButton).toBeVisible();
      await backButton.click();
      await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
    });
  });
});
