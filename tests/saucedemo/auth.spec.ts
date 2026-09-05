import { test, expect } from '../../src/fixtures/test.fixture.js';
import { USERS, AUTH_ERROR_MESSAGES } from '../../src/data/users.data.js';

test.describe('Authentication Suite @auth', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should successfully log in with standard user credentials', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);

    await expect(inventoryPage.title).toBeVisible();
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
  });

  test('should show error when logging in with locked out user', async ({ loginPage }) => {
    await loginPage.login(USERS.LOCKED_OUT.username, USERS.LOCKED_OUT.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(AUTH_ERROR_MESSAGES.LOCKED_OUT);
  });

  test('should show error when logging in with invalid credentials', async ({ loginPage }) => {
    await loginPage.login(USERS.INVALID.username, USERS.INVALID.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
  });

  test('should show validation error when username is empty', async ({ loginPage }) => {
    await loginPage.login('', USERS.STANDARD.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(AUTH_ERROR_MESSAGES.USERNAME_REQUIRED);
  });

  test('should show validation error when password is empty', async ({ loginPage }) => {
    await loginPage.login(USERS.STANDARD.username, '');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(AUTH_ERROR_MESSAGES.PASSWORD_REQUIRED);
  });

  test('should log out successfully from sidebar navigation', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    await expect(inventoryPage.title).toBeVisible();

    await inventoryPage.logout();

    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.page).toHaveURL('https://www.saucedemo.com/');
  });
});
