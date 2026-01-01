import { chromium } from "playwright";
import { USER_AGENT } from "./config";
import { clickLoginIfExists } from "./portal";
import {probeRedirect} from "./redirectProbe";
import {renderUI, UiState} from "./tui";

const state: UiState = {
    title: "〇〇スキー場WIFI認証自動化ツール",
    status: "接続OK",
    lastOkAt: null,
    probeCount: 0,
    okCount: 0,
    failCount: 0,
    lastRedirect: null,
    lastError: null,
};

async function wifiAuth(target: string) {
    state.status = 'ロクイン中...'
    state.lastRedirect = target
    renderUI(state)
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({ userAgent: USER_AGENT });
    const page = await ctx.newPage();

    try {
        await page.goto(target, { waitUntil: "domcontentloaded", timeout: 15000 });
        // console.log(await page.content())
        await clickLoginIfExists(page);
        state.status = '接続OK'
        state.lastOkAt = new Date()
        state.okCount++
        renderUI(state)
    } catch (e: any) {
        state.lastError = e.message
        state.failCount++
        renderUI(state)
    } finally {
        await browser.close();
    }
}

async function run() {
    while (1) {
        const target = await probeRedirect()
        state.probeCount++
        renderUI(state)
        try {
            target && await wifiAuth(target)
        } catch (e) {
            state.lastError = e + ''
            state.failCount++
            renderUI(state)
        }
    }
}

run()