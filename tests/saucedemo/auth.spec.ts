import { test, expect } from '../../src/fixtures/test.fixture.js';
import { USERS, AUTH_ERROR_MESSAGES } from '../../src/data/users.data.js';

test.describe('Authentication Suite @auth', () => {
  test.beforeEach(async ({ loginPage }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.navigate();
    });
  });

  test('should successfully log in with standard user credentials', async ({ loginPage }) => {
    let inventoryPage: Awaited<ReturnType<typeof loginPage.loginAs>>;

    await test.step('Submit valid credentials for standard user', async () => {
      inventoryPage = await loginPage.loginAs(USERS.STANDARD);
    });

    await test.step('Verify inventory catalog is rendered and URL is updated', async () => {
      await expect(inventoryPage.pageTitle).toBeVisible();
      await expect(inventoryPage.pageTitle).toHaveText('Products');
      await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
    });
  });

  test('should show error when logging in with locked out user', async ({ loginPage }) => {
    await test.step('Attempt login with locked-out user account', async () => {
      await loginPage.submitInvalidLogin(USERS.LOCKED_OUT.username, USERS.LOCKED_OUT.password);
    });

    await test.step('Verify locked-out error banner is displayed', async () => {
      await expect(loginPage.errorMessageContainer).toBeVisible();
      await expect(loginPage.errorMessageContainer).toHaveText(AUTH_ERROR_MESSAGES.LOCKED_OUT);
    });
  });

  test('should show error when logging in with invalid credentials', async ({ loginPage }) => {
    await test.step('Attempt login with unregistered user credentials', async () => {
      await loginPage.submitInvalidLogin(USERS.INVALID.username, USERS.INVALID.password);
    });

    await test.step('Verify invalid credentials error banner is displayed', async () => {
      await expect(loginPage.errorMessageContainer).toBeVisible();
      await expect(loginPage.errorMessageContainer).toContainText(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
    });
  });

  test('should show validation error when username is empty', async ({ loginPage }) => {
    await test.step('Submit login form without username', async () => {
      await loginPage.submitInvalidLogin('', USERS.STANDARD.password);
    });

    await test.step('Verify username required validation error is shown', async () => {
      await expect(loginPage.errorMessageContainer).toBeVisible();
      await expect(loginPage.errorMessageContainer).toHaveText(AUTH_ERROR_MESSAGES.USERNAME_REQUIRED);
    });
  });

  test('should show validation error when password is empty', async ({ loginPage }) => {
    await test.step('Submit login form without password', async () => {
      await loginPage.submitInvalidLogin(USERS.STANDARD.username, '');
    });

    await test.step('Verify password required validation error is shown', async () => {
      await expect(loginPage.errorMessageContainer).toBeVisible();
      await expect(loginPage.errorMessageContainer).toHaveText(AUTH_ERROR_MESSAGES.PASSWORD_REQUIRED);
    });
  });

  test('should log out successfully from sidebar navigation', async ({ loginPage }) => {
    let inventoryPage: Awaited<ReturnType<typeof loginPage.loginAs>>;

    await test.step('Login with standard user', async () => {
      inventoryPage = await loginPage.loginAs(USERS.STANDARD);
      await expect(inventoryPage.pageTitle).toBeVisible();
    });

    await test.step('Open sidebar and click logout', async () => {
      await inventoryPage.logout();
    });

    await test.step('Verify user is redirected to login page with inputs visible', async () => {
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.page).toHaveURL('https://www.saucedemo.com/');
    });
  });
});
