const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const snap = async (name) => {
        await delay(2000);
        await page.screenshot({ path: `snap_${name}.png`, fullPage: true });
        console.log(`Snapped: ${name}`);
    };

    try {
        // Login to make sure we are authorized
        await page.goto('http://localhost:5173/auth/login');
        await page.type('input[type="email"]', 'arjun.mehta@example.com');
        await page.type('input[type="password"]', 'FoodFlow@2024');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('button[type="submit"]')
        ]);

        // Drop Detail (Cart)
        await page.goto('http://localhost:5173/drops/4010');
        await snap('11_drop_detail');

        // Creator Profile
        await page.goto('http://localhost:5173/creators/1002');
        await snap('12_creator_profile');

        // Order Tracking
        await page.goto('http://localhost:5173/orders/5001/track');
        await snap('13_order_tracking');

    } catch (e) {
        console.error(e);
    }
    await browser.close();
})();
