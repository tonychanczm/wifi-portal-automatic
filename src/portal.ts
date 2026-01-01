import { Page } from "playwright";
import { btnSelector, checkSelector } from "./selectors";

export async function clickLoginIfExists(page: Page) {
    await page.waitForTimeout(800);

    {
        const el = page.locator(checkSelector).first();
        if (await el.count()) {
            await el.click({ timeout: 1500 }).catch(() => {});
        } else {
            throw new Error('failed to SELECT check')
        }
    }

    {
        const el = page.locator(btnSelector).first();
        if (await el.count()) {
            await el.click({ timeout: 1500 }).catch(() => {});
        } else {
            throw new Error('failed to SELECT btn')
        }
    }

    await page.waitForTimeout(1200);
}