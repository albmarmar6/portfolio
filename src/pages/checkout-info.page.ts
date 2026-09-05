import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { CheckoutCustomerInfo } from '../data/checkout.data.js';

/**
 * Page Object representing Step 1 of Checkout: Customer Information
 */
export class CheckoutInfoPage extends BasePage {
  readonly title: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /**
   * Fill personal details
   */
  async fillInformation(info: Partial<CheckoutCustomerInfo>): Promise<void> {
    if (info.firstName !== undefined) {
      await this.firstNameInput.fill(info.firstName);
    }
    if (info.lastName !== undefined) {
      await this.lastNameInput.fill(info.lastName);
    }
    if (info.postalCode !== undefined) {
      await this.postalCodeInput.fill(info.postalCode);
    }
  }

  /**
   * Complete form and click continue
   */
  async submitInformation(info: CheckoutCustomerInfo): Promise<void> {
    await this.fillInformation(info);
    await this.continueButton.click();
  }

  /**
   * Click continue button
   */
  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  /**
   * Get error text
   */
  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return (await this.errorMessage.innerText()).trim();
  }

  /**
   * Cancel and return to cart
   */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
