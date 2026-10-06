import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';

test.describe('Login page', () => {
  
  test('logs in successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });

  test('logs in successfully for a second valid user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('problem_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });

  test('shows an error for invalid username and password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('invalid_user', 'wrong_password');

    await expect(loginPage.errorMessage).toContainText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('shows an error for locked-out user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(loginPage.errorMessage).toContainText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  test('requires a username before login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('', 'secret_sauce');

    await expect(loginPage.errorMessage).toContainText('Epic sadface: Username is required');
  });

  test('requires a password before login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', '');

    await expect(loginPage.errorMessage).toContainText('Epic sadface: Password is required');
  });

  test('rejects blank username and password as a boundary case', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('', '');

    await expect(loginPage.errorMessage).toContainText('Epic sadface: Username is required');
  });

  test('rejects oversized input as a boundary case', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const oversizedUsername = 'a'.repeat(256);
    const oversizedPassword = 'b'.repeat(256);

    await loginPage.goto();
    await loginPage.login(oversizedUsername, oversizedPassword);

    await expect(loginPage.errorMessage).toContainText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });
});