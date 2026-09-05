import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { CheckoutCustomerInfo } from '../data/checkout.data.js';
import { CheckoutOverviewPage } from './checkout-overview.page.js';
import { CartPage } from './cart.page.js';

/**
 * Page Object representing Step 1 of Checkout: Customer Information
 */
export class CheckoutInfoPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessageContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessageContainer = page.locator('[data-test="error"]');
  }

  /**
   * Fills partial or complete customer information
   */
  async fillInformation(info: Partial<CheckoutCustomerInfo>): Promise<this> {
    if (info.firstName !== undefined) {
      await this.firstNameInput.fill(info.firstName);
    }
    if (info.lastName !== undefined) {
      await this.lastNameInput.fill(info.lastName);
    }
    if (info.postalCode !== undefined) {
      await this.postalCodeInput.fill(info.postalCode);
    }
    return this;
  }

  /**
   * Fills information and submits, returning CheckoutOverviewPage instance
   */
  async submitInformation(info: CheckoutCustomerInfo): Promise<CheckoutOverviewPage> {
    await this.fillInformation(info);
    await this.continueButton.click();
    return new CheckoutOverviewPage(this.page);
  }

  /**
   * Clicks continue button (for negative test assertions)
   */
  async clickContinue(): Promise<this> {
    await this.continueButton.click();
    return this;
  }

  /**
   * Reads error message banner text
   */
  async getErrorMessage(): Promise<string> {
    await this.errorMessageContainer.waitFor({ state: 'visible' });
    return (await this.errorMessageContainer.innerText()).trim();
  }

  /**
   * Cancels checkout and returns to CartPage
   */
  async cancel(): Promise<CartPage> {
    await this.cancelButton.click();
    return new CartPage(this.page);
  }
}
