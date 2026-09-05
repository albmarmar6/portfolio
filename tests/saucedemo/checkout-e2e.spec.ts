import { test, expect } from '../../src/fixtures/test.fixture.js';
import { INVENTORY_ITEMS, VALID_CUSTOMER, CHECKOUT_ERROR_MESSAGES } from '../../src/data/checkout.data.js';

test.describe('Checkout & E2E Purchase Flow Suite @e2e', () => {
  test('should complete end-to-end purchase flow with accurate subtotal, tax and total', async ({
    loggedInAsStandardUser: inventoryPage,
  }) => {
    let cartPage: Awaited<ReturnType<typeof inventoryPage.openCart>>;
    let checkoutInfoPage: Awaited<ReturnType<typeof cartPage.proceedToCheckout>>;
    let checkoutOverviewPage: Awaited<ReturnType<typeof checkoutInfoPage.submitInformation>>;
    let checkoutCompletePage: Awaited<ReturnType<typeof checkoutOverviewPage.finishOrder>>;

    await test.step('1. Add multiple items to cart from catalog', async () => {
      await inventoryPage.addItemToCart(INVENTORY_ITEMS.BACKPACK);
      await inventoryPage.addItemToCart(INVENTORY_ITEMS.BOLT_TSHIRT);
      expect(await inventoryPage.header.getCartBadgeCount()).toBe(2);
    });

    await test.step('2. Navigate to cart and verify items', async () => {
      cartPage = await inventoryPage.openCart();
      await expect(cartPage.pageTitle).toHaveText('Your Cart');
      await expect(cartPage.cartItems).toHaveCount(2);
    });

    await test.step('3. Proceed to Checkout Step 1 (Customer Information)', async () => {
      checkoutInfoPage = await cartPage.proceedToCheckout();
      await expect(checkoutInfoPage.pageTitle).toHaveText('Checkout: Your Information');
    });

    await test.step('4. Fill customer details and submit form', async () => {
      checkoutOverviewPage = await checkoutInfoPage.submitInformation(VALID_CUSTOMER);
    });

    await test.step('5. Verify Order Overview items and financial math calculations', async () => {
      await expect(checkoutOverviewPage.pageTitle).toHaveText('Checkout: Overview');
      await expect(checkoutOverviewPage.cartItems).toHaveCount(2);

      const expectedSubtotal = INVENTORY_ITEMS.BACKPACK.price + INVENTORY_ITEMS.BOLT_TSHIRT.price;
      const actualSubtotal = await checkoutOverviewPage.getSubtotal();
      expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);

      const actualTax = await checkoutOverviewPage.getTax();
      const actualTotal = await checkoutOverviewPage.getTotal();
      expect(actualTotal).toBeCloseTo(actualSubtotal + actualTax, 2);
    });

    await test.step('6. Finalize order and confirm success message', async () => {
      checkoutCompletePage = await checkoutOverviewPage.finishOrder();
      await expect(checkoutCompletePage.pageTitle).toHaveText('Checkout: Complete!');
      await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
      await expect(checkoutCompletePage.ponyExpressImage).toBeVisible();
    });

    await test.step('7. Return back to catalog and verify cart is cleared', async () => {
      const homeInventoryPage = await checkoutCompletePage.backToHome();
      await expect(homeInventoryPage.pageTitle).toHaveText('Products');
      expect(await homeInventoryPage.header.getCartBadgeCount()).toBe(0);
    });
  });

  test('should validate required fields on customer information step', async ({
    loggedInAsStandardUser: inventoryPage,
  }) => {
    let cartPage: Awaited<ReturnType<typeof inventoryPage.openCart>>;
    let checkoutInfoPage: Awaited<ReturnType<typeof cartPage.proceedToCheckout>>;

    await test.step('Setup: Add item to cart and reach Checkout Step 1', async () => {
      await inventoryPage.addItemToCart(INVENTORY_ITEMS.BACKPACK);
      cartPage = await inventoryPage.openCart();
      checkoutInfoPage = await cartPage.proceedToCheckout();
    });

    await test.step('Validate first name is required', async () => {
      await checkoutInfoPage.clickContinue();
      expect(await checkoutInfoPage.getErrorMessage()).toBe(CHECKOUT_ERROR_MESSAGES.FIRST_NAME_REQUIRED);
    });

    await test.step('Validate last name is required', async () => {
      await checkoutInfoPage.fillInformation({ firstName: 'Alberto' });
      await checkoutInfoPage.clickContinue();
      expect(await checkoutInfoPage.getErrorMessage()).toBe(CHECKOUT_ERROR_MESSAGES.LAST_NAME_REQUIRED);
    });

    await test.step('Validate postal code is required', async () => {
      await checkoutInfoPage.fillInformation({ lastName: 'Martín' });
      await checkoutInfoPage.clickContinue();
      expect(await checkoutInfoPage.getErrorMessage()).toBe(CHECKOUT_ERROR_MESSAGES.POSTAL_CODE_REQUIRED);
    });

    await test.step('Cancel checkout and verify return to Cart', async () => {
      const returnedCartPage = await checkoutInfoPage.cancel();
      await expect(returnedCartPage.pageTitle).toHaveText('Your Cart');
    });
  });
});
