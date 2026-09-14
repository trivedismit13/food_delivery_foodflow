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
        // 1. Login
        await page.goto('http://localhost:5173/auth/login');
        await page.type('input[type="email"]', 'arjun.mehta@example.com');
        await page.type('input[type="password"]', 'FoodFlow@2024');
        await snap('01_login_before');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('button[type="submit"]')
        ]);
        await snap('02_dashboard_after_login');

        // 2. Refresh Auth persistence
        await page.reload({ waitUntil: 'networkidle0' });
        await snap('03_dashboard_after_refresh');

        // 3. Home Page
        await page.goto('http://localhost:5173/');
        await snap('04_home_page');

        // 4. Discover Drops
        await page.goto('http://localhost:5173/drops');
        await snap('05_discover_drops');

        // 5. Following
        await page.goto('http://localhost:5173/dashboard/customer?tab=following');
        await snap('06_following_tab');

        // 6. Reels
        await page.goto('http://localhost:5173/reels');
        await snap('07_reels_page');

        // 7. Orders
        await page.goto('http://localhost:5173/dashboard/customer?tab=orders');
        await snap('08_orders_tab');

        // 8. Notifications
        await page.goto('http://localhost:5173/dashboard/customer?tab=notifications');
        await snap('09_notifications_tab');

        // 9. Profile
        await page.goto('http://localhost:5173/dashboard/customer?tab=profile');
        await snap('10_profile_tab');

    } catch (e) {
        console.error(e);
    }
    await browser.close();
})();
