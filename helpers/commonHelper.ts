import { Page, expect } from "@playwright/test";

export class CommonHelper {
  constructor(private page: Page) {
    this.page = page;
  }

  async waitForAllLoadersToDisappear() {
    const loaders = this.page.locator(".oxd-loading-spinner");

    const count = await loaders.count();
    for (let i = 0; i < count; i++) {
      await expect(loaders.nth(i)).toBeHidden();
    }
  }
}
