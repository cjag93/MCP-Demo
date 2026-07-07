// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';

const loginURL = 'file://' + path.resolve('UI - Pages/login.html');

test.describe('Login Page - Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(loginURL);
  });

  test('has correct title and heading', async ({ page }) => {
    await expect(page).toHaveTitle('Login Page');
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
  });

  test('shows all form elements', async ({ page }) => {
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#loginBtn')).toBeVisible();
    await expect(page.locator('#togglePassword')).toBeVisible();
    await expect(page.locator('#rememberMe')).toBeVisible();
    await expect(page.locator('#forgotPassword')).toBeVisible();
  });

  test('shows navbar with logo and nav links', async ({ page }) => {
    await expect(page.locator('.logo')).toBeVisible();
    await expect(page.locator('#navHome')).toBeVisible();
    await expect(page.locator('#navAbout')).toBeVisible();
    await expect(page.locator('#navContact')).toBeVisible();
  });

  test('shows social login buttons', async ({ page }) => {
    await expect(page.locator('#googleLogin')).toBeVisible();
    await expect(page.locator('#githubLogin')).toBeVisible();
  });

  test('shows signup link and footer links', async ({ page }) => {
    await expect(page.locator('#signupLink')).toBeVisible();
    await expect(page.locator('#privacyLink')).toBeVisible();
    await expect(page.locator('#termsLink')).toBeVisible();
  });

  test('username and password inputs have correct placeholders', async ({ page }) => {
    await expect(page.locator('#username')).toHaveAttribute('placeholder', 'Enter your username');
    await expect(page.locator('#password')).toHaveAttribute('placeholder', 'Enter your password');
  });

  test('password field is masked by default', async ({ page }) => {
    await expect(page.locator('#password')).toHaveAttribute('type', 'password');
  });
});

test.describe('Login Page - Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(loginURL);
  });

  test('highlights username field when submitting empty form', async ({ page }) => {
    await page.click('#loginBtn');
    await expect(page.locator('#username')).toHaveClass(/input-error/);
    await expect(page.locator('#password')).not.toHaveClass(/input-error/);
  });

  test('highlights password field when only username is filled', async ({ page }) => {
    await page.fill('#username', 'testuser');
    await page.click('#loginBtn');
    await expect(page.locator('#password')).toHaveClass(/input-error/);
    await expect(page.locator('#username')).not.toHaveClass(/input-error/);
  });

  test('clears username error state on input', async ({ page }) => {
    await page.click('#loginBtn');
    await expect(page.locator('#username')).toHaveClass(/input-error/);
    await page.fill('#username', 'a');
    await expect(page.locator('#username')).not.toHaveClass(/input-error/);
  });

  test('clears password error state and hides error message on input', async ({ page }) => {
    await page.fill('#username', 'wrong');
    await page.fill('#password', 'wrong');
    await page.click('#loginBtn');
    await expect(page.locator('#errorMsg')).toBeVisible({ timeout: 3000 });
    await page.fill('#password', 'p');
    await expect(page.locator('#password')).not.toHaveClass(/input-error/);
    await expect(page.locator('#errorMsg')).toBeHidden();
  });

  test('error and success messages are hidden on initial load', async ({ page }) => {
    await expect(page.locator('#errorMsg')).toBeHidden();
    await expect(page.locator('#successMsg')).toBeHidden();
  });
});

test.describe('Login Page - Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(loginURL);
  });

  test('shows loading state immediately after submission', async ({ page }) => {
    await page.fill('#username', 'user');
    await page.fill('#password', 'pass');
    await page.click('#loginBtn');
    await expect(page.locator('#loginSpinner')).toBeVisible();
    await expect(page.locator('#loginBtn')).toBeDisabled();
    await expect(page.locator('#loginText')).toBeHidden();
  });

  test('shows success message with valid credentials', async ({ page }) => {
    await page.fill('#username', 'user');
    await page.fill('#password', 'pass');
    await page.click('#loginBtn');
    await expect(page.locator('#successMsg')).toBeVisible({ timeout: 3000 });
  });

  test('shows error message with invalid credentials', async ({ page }) => {
    await page.fill('#username', 'wrong');
    await page.fill('#password', 'wrong');
    await page.click('#loginBtn');
    await expect(page.locator('#errorMsg')).toBeVisible({ timeout: 3000 });
  });

  test('marks both fields as error on failed login', async ({ page }) => {
    await page.fill('#username', 'wrong');
    await page.fill('#password', 'wrong');
    await page.click('#loginBtn');
    await expect(page.locator('#errorMsg')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('#username')).toHaveClass(/input-error/);
    await expect(page.locator('#password')).toHaveClass(/input-error/);
  });

  test('re-enables login button after failed login', async ({ page }) => {
    await page.fill('#username', 'wrong');
    await page.fill('#password', 'wrong');
    await page.click('#loginBtn');
    await expect(page.locator('#loginBtn')).toBeEnabled({ timeout: 3000 });
    await expect(page.locator('#loginText')).toBeVisible();
    await expect(page.locator('#loginSpinner')).toBeHidden();
  });

  test('wrong username but correct password format fails login', async ({ page }) => {
    await page.fill('#username', 'notauser');
    await page.fill('#password', 'pass');
    await page.click('#loginBtn');
    await expect(page.locator('#errorMsg')).toBeVisible({ timeout: 3000 });
  });

  test('correct username but wrong password fails login', async ({ page }) => {
    await page.fill('#username', 'user');
    await page.fill('#password', 'wrongpass');
    await page.click('#loginBtn');
    await expect(page.locator('#errorMsg')).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Login Page - UI Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(loginURL);
  });

  test('toggles password visibility on click', async ({ page }) => {
    const passwordInput = page.locator('#password');
    const toggleBtn = page.locator('#togglePassword');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(toggleBtn).toHaveText('Show');
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await expect(toggleBtn).toHaveText('Hide');
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(toggleBtn).toHaveText('Show');
  });

  test('remember me checkbox toggles correctly', async ({ page }) => {
    const checkbox = page.locator('#rememberMe');
    await expect(checkbox).not.toBeChecked();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('forgot password shows toast notification', async ({ page }) => {
    await page.click('#forgotPassword');
    await expect(page.locator('.toast')).toHaveText('Password reset link sent to your email');
    await expect(page.locator('.toast')).toHaveClass(/show/);
  });

  test('google login button shows unavailable toast', async ({ page }) => {
    await page.click('#googleLogin');
    await expect(page.locator('.toast')).toHaveText('Google login is not available yet');
    await expect(page.locator('.toast')).toHaveClass(/show/);
  });

  test('github login button shows unavailable toast', async ({ page }) => {
    await page.click('#githubLogin');
    await expect(page.locator('.toast')).toHaveText('GitHub login is not available yet');
    await expect(page.locator('.toast')).toHaveClass(/show/);
  });

  test('toast disappears after 3 seconds', async ({ page }) => {
    await page.click('#forgotPassword');
    await expect(page.locator('.toast')).toHaveClass(/show/);
    await expect(page.locator('.toast')).not.toHaveClass(/show/, { timeout: 5000 });
  });

  test('login button is enabled on initial load', async ({ page }) => {
    await expect(page.locator('#loginBtn')).toBeEnabled();
  });
});

test.describe('Login Page - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(loginURL);
  });

  test('username input has associated label', async ({ page }) => {
    const label = page.locator('label[for="username"]');
    await expect(label).toBeVisible();
    await expect(label).toHaveText('Usernname');
  });

  test('password input has associated label', async ({ page }) => {
    const label = page.locator('label[for="password"]');
    await expect(label).toBeVisible();
    await expect(label).toHaveText('Password');
  });

  test('can submit form using Enter key on username field', async ({ page }) => {
    await page.fill('#username', 'user');
    await page.fill('#password', 'pass');
    await page.locator('#username').press('Enter');
    await expect(page.locator('#successMsg')).toBeVisible({ timeout: 3000 });
  });

  test('username field receives focus after empty submit', async ({ page }) => {
    await page.click('#loginBtn');
    await expect(page.locator('#username')).toBeFocused();
  });

  test('password field receives focus when only username is empty', async ({ page }) => {
    await page.fill('#username', 'testuser');
    await page.click('#loginBtn');
    await expect(page.locator('#password')).toBeFocused();
  });
});
