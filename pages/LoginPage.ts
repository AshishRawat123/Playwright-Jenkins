import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly dashboardHeading: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.getByPlaceholder("Username");
    this.passwordInput = page.getByPlaceholder("Password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.dashboardHeading = page.getByRole("heading", {
      name: "Dashboard",
    });
    this.errorMessage = page.getByRole("alert", {
      name: "Invalid credentials",
    });
  }

  async goto() {
    await this.page.goto("/web/index.php/auth/login");
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifySuccessfulLogin() {
    await expect(this.dashboardHeading).toBeVisible();
  }

  async verfiyInvalidLogin() {
    await expect(this.errorMessage).not.toBeVisible();
  }
}
