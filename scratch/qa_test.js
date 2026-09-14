const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    let findings = [];
    let networkErrors = [];
    let consoleErrors = [];

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error' || msg.type() === 'warning') {
            consoleErrors.push({ type: msg.type(), text: msg.text() });
        }
    });

    page.on('response', response => {
        if (response.status() >= 400 && response.request().resourceType() === 'fetch') {
            networkErrors.push({
                url: response.url(),
                status: response.status(),
                method: response.request().method()
            });
        }
    });

    const addFinding = (step, result, details, status) => {
        findings.push({ step, result, details, status });
        console.log(`[${status}] ${step}: ${result}`);
    };

    try {
        // STEP 2 - LOGIN
        await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
        await page.fill('input[type="email"]', 'arjun.mehta@example.com');
        await page.fill('input[type="password"]', 'FoodFlow@2024');
        await page.click('button[type="submit"]');
        await page.waitForURL('**/dashboard/customer', { timeout: 10000 });
        addFinding('STEP 2 - Login', 'Success', 'Logged in as Arjun Mehta', 'PASS');

        // Refresh Auth check
        await page.reload({ waitUntil: 'networkidle' });
        const isStillAuthed = page.url().includes('dashboard');
        addFinding('STEP 2 - Auth Persistence', isStillAuthed ? 'Success' : 'Failed', 'Refresh preserved auth', isStillAuthed ? 'PASS' : 'FAIL');

        // STEP 3 - HOME PAGE
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
        const hasCreators = await page.locator('text=Top Creators').isVisible();
        const hasDrops = await page.locator('text=Featured Drops').isVisible();
        addFinding('STEP 3 - Home Page', hasCreators && hasDrops ? 'Success' : 'Failed', 'Home page loaded with creators and drops', (hasCreators && hasDrops) ? 'PASS' : 'FAIL');

        // STEP 4 - DISCOVER DROPS
        await page.goto('http://localhost:5173/drops', { waitUntil: 'networkidle' });
        const dropCards = await page.locator('.drop-card').count(); // Guessing class or we can use text
        const hasDiscoverDrops = await page.locator('text=Discover').isVisible();
        addFinding('STEP 4 - Discover Drops', hasDiscoverDrops ? 'Success' : 'Failed', 'Drops page loaded', hasDiscoverDrops ? 'PASS' : 'FAIL');

        // STEP 7 - FOLLOWING TAB
        await page.goto('http://localhost:5173/dashboard/customer?tab=following', { waitUntil: 'networkidle' });
        const hasFollowingTab = await page.locator('text=Following').isVisible();
        addFinding('STEP 7 - Following Tab', hasFollowingTab ? 'Success' : 'Failed', 'Following tab loaded', hasFollowingTab ? 'PASS' : 'FAIL');

        // STEP 8 - REELS
        await page.goto('http://localhost:5173/reels', { waitUntil: 'networkidle' });
        const hasReels = await page.locator('video').count() > 0;
        addFinding('STEP 8 - Reels', hasReels ? 'Success' : 'Failed', 'Reels page loaded videos', hasReels ? 'PASS' : 'FAIL');

        // STEP 11 - CUSTOMER ORDERS
        await page.goto('http://localhost:5173/dashboard/customer?tab=orders', { waitUntil: 'networkidle' });
        const hasOrders = await page.locator('text=Order').isVisible();
        addFinding('STEP 11 - Customer Orders', hasOrders ? 'Success' : 'Failed', 'Orders tab loaded', hasOrders ? 'PASS' : 'FAIL');

        // STEP 13 - NOTIFICATIONS
        await page.goto('http://localhost:5173/dashboard/customer?tab=notifications', { waitUntil: 'networkidle' });
        const hasNotifs = await page.locator('text=Notification').isVisible();
        addFinding('STEP 13 - Notifications', hasNotifs ? 'Success' : 'Failed', 'Notifications loaded', hasNotifs ? 'PASS' : 'FAIL');

        // STEP 15 - CUSTOMER PROFILE
        await page.goto('http://localhost:5173/dashboard/customer?tab=profile', { waitUntil: 'networkidle' });
        const hasProfile = await page.locator('text=Arjun Mehta').isVisible();
        addFinding('STEP 15 - Profile', hasProfile ? 'Success' : 'Failed', 'Profile shows correct name', hasProfile ? 'PASS' : 'FAIL');

    } catch (e) {
        addFinding('Test Execution', 'Error', e.message, 'FAIL');
    }

    fs.writeFileSync('qa_results.json', JSON.stringify({ findings, networkErrors, consoleErrors }, null, 2));
    await browser.close();
})();
