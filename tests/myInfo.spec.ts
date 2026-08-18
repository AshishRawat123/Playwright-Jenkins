import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MyInfoPage } from '../pages/MyInfoPage';
import dotenv  from 'dotenv';

dotenv.config({path: ".env" });

test.beforeEach (async ({page})=>{

        const loginPage = new LoginPage(page);
        
            // Navigate to login page
            await loginPage.goto();
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
    })


test('change employee name and save changes', async ({ page }) => {
  const infoPage = new MyInfoPage(page);
  await infoPage.goto();

  // Change employee name
  await infoPage.changeFirstName('Johnsasas');
  await infoPage.changeLastName('Updated');

  // Click Save and reload
  await infoPage.saveChanges();
  await infoPage.reloadPage();

  // Verify the changes after reload
  await expect(infoPage.firstNameInput).toHaveValue('Johnsasas');
  await expect(infoPage.lastNameInput).toHaveValue('Updated');
});