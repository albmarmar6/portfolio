import { test, expect } from '../../src/fixtures/test.fixture.js';
import { INVENTORY_ITEMS } from '../../src/data/checkout.data.js';

test.describe('Shopping Cart Suite @cart', () => {
  test('should update cart badge when adding and removing items from catalog', async ({ loggedInAsStandardUser: inventoryPage }) => {
    await test.step('Verify initial cart badge count is 0', async () => {
      expect(await inventoryPage.header.getCartBadgeCount()).toBe(0);
    });

    await test.step('Add Backpack and verify cart badge increments to 1', async () => {
      await inventoryPage.addItemToCart(INVENTORY_ITEMS.BACKPACK);
      expect(await inventoryPage.header.getCartBadgeCount()).toBe(1);
    });

    await test.step('Add Bike Light and verify cart badge increments to 2', async () => {
      await inventoryPage.addItemToCart(INVENTORY_ITEMS.BIKE_LIGHT);
      expect(await inventoryPage.header.getCartBadgeCount()).toBe(2);
    });

    await test.step('Remove Backpack from catalog and verify cart badge decrements to 1', async () => {
      await inventoryPage.removeItemFromCart(INVENTORY_ITEMS.BACKPACK);
      expect(await inventoryPage.header.getCartBadgeCount()).toBe(1);
    });
  });

  test('should remove items directly from within the cart page', async ({ loggedInAsStandardUser: inventoryPage }) => {
    let cartPage: Awaited<ReturnType<typeof inventoryPage.openCart>>;

    await test.step('Add Fleece Jacket and Onesie to cart and navigate to cart view', async () => {
      await inventoryPage.addItemToCart(INVENTORY_ITEMS.FLEECE_JACKET);
      await inventoryPage.addItemToCart(INVENTORY_ITEMS.ONESIE);
      cartPage = await inventoryPage.openCart();
    });

    await test.step('Verify cart contains 2 items', async () => {
      await expect(cartPage.pageTitle).toHaveText('Your Cart');
      await expect(cartPage.cartItems).toHaveCount(2);
      const items = await cartPage.getItemNames();
      expect(items).toContain(INVENTORY_ITEMS.FLEECE_JACKET.name);
      expect(items).toContain(INVENTORY_ITEMS.ONESIE.name);
    });

    await test.step('Remove Fleece Jacket from cart', async () => {
      await cartPage.removeItem(INVENTORY_ITEMS.FLEECE_JACKET);
    });

    await test.step('Verify cart is updated to 1 remaining item', async () => {
      await expect(cartPage.cartItems).toHaveCount(1);
      const updatedItems = await cartPage.getItemNames();
      expect(updatedItems).not.toContain(INVENTORY_ITEMS.FLEECE_JACKET.name);
      expect(updatedItems).toContain(INVENTORY_ITEMS.ONESIE.name);
      expect(await cartPage.header.getCartBadgeCount()).toBe(1);
    });
  });

  test('should navigate back to catalog from cart with Continue Shopping button', async ({ loggedInAsStandardUser: inventoryPage }) => {
    let cartPage: Awaited<ReturnType<typeof inventoryPage.openCart>>;

    await test.step('Open empty shopping cart', async () => {
      cartPage = await inventoryPage.openCart();
      await expect(cartPage.pageTitle).toHaveText('Your Cart');
    });

    await test.step('Click Continue Shopping and verify return to product catalog', async () => {
      const returnedInventoryPage = await cartPage.continueShopping();
      await expect(returnedInventoryPage.pageTitle).toHaveText('Products');
      await expect(returnedInventoryPage.page).toHaveURL(/.*inventory.html/);
    });
  });
});
