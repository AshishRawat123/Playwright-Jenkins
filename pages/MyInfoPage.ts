import { Page, Locator,expect } from '@playwright/test';

export class MyInfoPage {
  readonly page: Page;

  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Using HTML attributes
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');

    // Using role
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async goto(){
    await this.page.getByRole('link',{
        name:'My Info'
    }).click();
    await this.page.waitForLoadState('networkidle');
    await this.page.locator('.oxd-loading-spinner').last().waitFor({state:'hidden'})
    await this.waitForAllLoadersToDisappear()
    await this.page.waitForLoadState("domcontentloaded");
  }

  async changeFirstName(firstName: string) {
    await this.firstNameInput.clear();
    await this.firstNameInput.fill(firstName);
  }

  async changeLastName(lastName: string) {
    await this.lastNameInput.clear();
    await this.lastNameInput.fill(lastName);
  }

  async saveChanges() {
    await this.saveButton.first().click();
  }

  async reloadPage() {
    await this.page.reload();
    await this.waitForAllLoadersToDisappear();
  }

  async waitForAllLoadersToDisappear() {
  const loaders = this.page.locator('.oxd-loading-spinner');

  const count = await loaders.count();

  for (let i = 0; i < count; i++) {
    await expect(loaders.nth(i)).toBeHidden();
  }
}
}