import { test, expect } from '../../src/fixtures/test.fixture.js';
import { INVENTORY_ITEMS } from '../../src/data/checkout.data.js';

test.describe('Shopping Cart Suite @cart', () => {
  test('should update cart badge when adding and removing items from catalog', async ({ loggedInAsStandardUser: inventoryPage }) => {
    // Initial state: badge is 0 (not visible)
    expect(await inventoryPage.getCartItemCount()).toBe(0);

    // Add backpack
    await inventoryPage.addItemByDataTest(INVENTORY_ITEMS.BACKPACK.dataTestAdd);
    expect(await inventoryPage.getCartItemCount()).toBe(1);

    // Add bike light
    await inventoryPage.addItemByDataTest(INVENTORY_ITEMS.BIKE_LIGHT.dataTestAdd);
    expect(await inventoryPage.getCartItemCount()).toBe(2);

    // Remove backpack from inventory page
    await inventoryPage.removeItemByDataTest(INVENTORY_ITEMS.BACKPACK.dataTestRemove);
    expect(await inventoryPage.getCartItemCount()).toBe(1);
  });

  test('should remove items directly from within the cart page', async ({ loggedInAsStandardUser: inventoryPage, cartPage }) => {
    await inventoryPage.addItemByDataTest(INVENTORY_ITEMS.FLEECE_JACKET.dataTestAdd);
    await inventoryPage.addItemByDataTest(INVENTORY_ITEMS.ONESIE.dataTestAdd);
    await inventoryPage.openCart();

    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.cartItems).toHaveCount(2);

    const items = await cartPage.getCartItemNames();
    expect(items).toContain(INVENTORY_ITEMS.FLEECE_JACKET.name);
    expect(items).toContain(INVENTORY_ITEMS.ONESIE.name);

    // Remove Fleece Jacket from cart
    await cartPage.removeItemByDataTest(INVENTORY_ITEMS.FLEECE_JACKET.dataTestRemove);

    await expect(cartPage.cartItems).toHaveCount(1);
    const updatedItems = await cartPage.getCartItemNames();
    expect(updatedItems).not.toContain(INVENTORY_ITEMS.FLEECE_JACKET.name);
    expect(updatedItems).toContain(INVENTORY_ITEMS.ONESIE.name);
    expect(await cartPage.getCartItemCount()).toBe(1);
  });

  test('should navigate back to catalog from cart with Continue Shopping button', async ({ loggedInAsStandardUser: inventoryPage, cartPage }) => {
    await inventoryPage.openCart();
    await expect(cartPage.title).toHaveText('Your Cart');

    await cartPage.continueShopping();
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
  });
});
