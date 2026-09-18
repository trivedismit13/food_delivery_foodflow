const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
        console.log('Navigating to Creator 1002...');
        await page.goto('http://localhost:5173/creators/1002', { waitUntil: 'networkidle0' });

        // Wait for the Drops tab content to render
        await page.waitForSelector('.group.block', { timeout: 10000 });

        console.log('Taking screenshot of the Creator Profile Drops tab...');
        await page.screenshot({ path: 'snap_14_creator_drops.png', fullPage: true });

        console.log('Done.');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await browser.close();
    }
})();
