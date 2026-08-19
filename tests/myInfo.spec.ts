import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MyInfoPage } from "../pages/MyInfoPage";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Navigate to login page
  await loginPage.goto();
  await page.waitForLoadState("domcontentloaded");

  const username = process.env.PLAYWRIGHT_username;
  const password = process.env.password;

  if (!username || !password) {
    throw new Error("PLAYWRIGHT_USERNAME and PLAYWRIGHT_PASSWORD must be set");
  }

  // Login with valid credentials
  await loginPage.login(username, password);
  await loginPage.verifySuccessfulLogin();
});

test("change employee name and save changes", async ({ page }) => {
  const infoPage = new MyInfoPage(page);
  await infoPage.goto();

  // Change employee name
  await infoPage.changeFirstName("Johnsasas");
  await infoPage.changeLastName("Updated");

  
  // Intercept before saving
//   await page.route(
//     "**/employees/*/personal-details",
//     async (route) => {
//       const reqData = route.request().postData();
//       if (reqData) {
//         let body = JSON.parse(reqData);
//         console.log('before first name is ',body.firstName)
//         body.firstName = "SASHASAS";
//         console.log('after edit first name is ',body)
//         route.continue({
//             headers: {
//                 ...route.request().headers(),
//                 'content-type': 'application/json' // Crucial to tell the server JSON is coming
//     },
//           postData: JSON.stringify(body),
//         });
//       }
//     },
//   );

  await page.pause();
  // Click Save and reload
  await infoPage.saveChanges();
  await page.pause();

  await infoPage.reloadPage();

  await page.pause();

  // Verify the changes after reload
  await expect(infoPage.firstNameInput).toHaveValue("Johnsasas");
  await expect(infoPage.lastNameInput).toHaveValue("Updated");
});

test('update the UI by API interceptor modifcation', async ({page})=>{

    // 1. intercept the request and modify it how its looks like or you can say mock it
    await page.route('**/v2/admin/users**', async route => {

    const response = await route.fetch();
    // 2. Parse the JSON body
    const json = await response.json();

    // 3. Target and modify the specific nested property safely
    if (json.data && json.data[0] && json.data[0].employee) {
      json.data[0].employee.firstName = 'XYZZZZZ';
    }

    console.log("Edited body  /n", JSON.stringify(json.data[0]) );

    await route.fulfill({
        response,
        json
    })
    });

    // Navigate to admin page
    await page.getByRole('link', {name  :'Admin'}).click()
    await page.waitForLoadState('networkidle');

    let Name = await page.locator('.oxd-table-card:nth-child(1) div.oxd-table-cell:nth-child(4)').first().textContent();
    expect(Name?.split(' ')[0]).toEqual('XYZZZZZ');
    // Delete the route
    await page.unroute('**/v2/admin/users**');

    // Let reload and check the admin name change for first entry
    await page.reload({waitUntil:'networkidle'});
    Name = await page.locator('.oxd-table-card:nth-child(1) div.oxd-table-cell:nth-child(4)').first().textContent();
    expect(Name?.split(' ')[0]).not.toEqual('XYZZZZZ');


})