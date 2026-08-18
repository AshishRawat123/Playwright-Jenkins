import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import dotenv from "dotenv";

dotenv.config({
  path: process.env.ENV_FILE || ".env",
});

test.describe("OrangeHRM Login", () => {
  test.use({
    storageState: {
      cookies: [],
      origins: [],
    },
  });

  type userDetails ={ user:string, pass:string};
  const InvalidCredential: userDetails[] = [
    {user:'Ashish', pass:'admin123'},
    {user:'admin', pass:'admin'}
  ]

  test("should login successfully with valid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Navigate to login page
    await loginPage.goto();
    console.log(
      "My local or jenskins username  :  ",
      process.env.PLAYWRIGHT_username,
    );
    await page.waitForLoadState("domcontentloaded");

    const username = process.env.PLAYWRIGHT_username;
    const password = process.env.password;

    if (!username || !password) {
      throw new Error(
        "PLAYWRIGHT_USERNAME and PLAYWRIGHT_PASSWORD must be set",
      );
    }

    // Login with valid credentials
    await loginPage.login(username, password);
    await loginPage.verifySuccessfulLogin();
  });

  for(const details of InvalidCredential){
    test.only(`should not login successfully with Invalid credentials ${details.user} and password ${details.pass}`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Navigate to login page
    await loginPage.goto();
    const username = details.user;
    const password = details.pass;

    if (!username || !password) {
      throw new Error(
        "PLAYWRIGHT_USERNAME and PLAYWRIGHT_PASSWORD must be set",
      );
    }

    // Login with valid credentials
    await loginPage.login(username, password);
    await loginPage.verfiyInvalidLogin();
  });
}
});
